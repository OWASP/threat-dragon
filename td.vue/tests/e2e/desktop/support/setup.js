const fs = require('fs');
const http = require('http');
const net = require('net');
const { spawn, spawnSync } = require('child_process');
const { join } = require('path');
const { remote } = require('webdriverio');
const { setBrowser, getBrowser, setMainProcessClient, getMainProcessClient } = require('./session');
const { MainProcessClient, waitForNodeInspectorUrl, installMenuTestHooks } = require('./main-process');
const { waitFor, createTempDirectory, removeDirectory } = require('./utils');

let chromedriverPort;
let chromedriverProcess;
let electronAppProcess;
let electronUserDataDir;

const isProcessAlive = (processRef) => {
    if (!processRef || !processRef.pid) {
        return false;
    }

    try {
        process.kill(processRef.pid, 0);
        return true;
    } catch (_error) {
        return false;
    }
};

const getFreePort = async () => {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.listen(0, '127.0.0.1', () => {
            const { port } = server.address();
            server.close(() => resolve(port));
        });
        server.on('error', reject);
    });
};

const readJson = async (url) => {
    return new Promise((resolve) => {
        const request = http.get(url, (response) => {
            let body = '';
            response.setEncoding('utf8');
            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (_error) {
                    resolve(null);
                }
            });
        });

        request.on('error', () => resolve(null));
    });
};

const waitForChromedriver = (port) => {
    return waitFor(
        async () => {
            const status = await readJson(`http://127.0.0.1:${port}/status`);
            return status && status.value && status.value.ready ? status : null;
        },
        15000,
        `Timed out waiting for chromedriver status on port ${port}`
    );
};

const waitForElectronPageTarget = (debugPort) => {
    return waitFor(
        async () => {
            const targets = await readJson(`http://127.0.0.1:${debugPort}/json/list`);

            if (!Array.isArray(targets)) {
                return null;
            }

            return targets.find((target) => target.type === 'page' && target.url === 'app://./index.html') || null;
        },
        20000,
        `Timed out waiting for an Electron page target on port ${debugPort}`
    );
};

const getElectronBinaryPath = () => {
    if (process.platform === 'linux') {
        return join(process.cwd(), 'dist-desktop', 'linux-unpacked', 'threat-dragon');
    }

    if (process.platform === 'darwin') {
        const macFolder = process.arch === 'arm64' ? 'mac-arm64' : 'mac';
        return join(process.cwd(), 'dist-desktop', macFolder, 'Threat Dragon.app', 'Contents', 'MacOS', 'Threat Dragon');
    }

    if (process.platform === 'win32') {
        return join(process.cwd(), 'dist-desktop', 'win-unpacked', 'Threat Dragon.exe');
    }

    throw new Error(`Unsupported desktop E2E platform: ${process.platform}`);
};

const killProcess = async (processRef) => {
    if (!processRef) {
        return;
    }

    if (!isProcessAlive(processRef)) {
        return;
    }

    processRef.kill('SIGTERM');

    try {
        await waitFor(() => !isProcessAlive(processRef), 2000, 'Timed out waiting for process to exit');
        return;
    } catch (_error) {
        processRef.kill('SIGKILL');
    }

    try {
        await waitFor(() => !isProcessAlive(processRef), 2000, 'Timed out waiting for process to exit after SIGKILL');
    } catch (_error) {
    // ignore teardown errors if the OS has already reaped the process
    }
};

exports.mochaHooks = {
    beforeAll: [
        async function () {
            this.timeout(90000);

            const electronBinaryPath = getElectronBinaryPath();
            const chromedriverBinary = join(process.cwd(), 'node_modules', 'electron-chromedriver', 'bin', 'chromedriver');
            const logsPath = join(process.cwd(), 'wdio-logs');

            spawnSync('pkill', ['-f', 'electron-chromedriver/bin/chromedriver']);
            spawnSync('pkill', ['-f', electronBinaryPath]);
            fs.mkdirSync(logsPath, { recursive: true });

            electronUserDataDir = createTempDirectory('td-desktop-e2e-');
            const electronLog = fs.openSync(join(logsPath, 'desktop-electron-app.log'), 'w');
            const nodeInspectorLogPath = join(logsPath, 'desktop-node-inspector.log');
            const nodeInspectorLog = fs.openSync(nodeInspectorLogPath, 'w');
            const chromedriverLog = fs.openSync(join(logsPath, 'desktop-standalone-chromedriver.log'), 'w');

            electronAppProcess = spawn(
                electronBinaryPath,
                [
                    '--inspect=0',
                    '--remote-debugging-port=0',
                    '--no-sandbox',
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--ozone-platform=x11',
                    `--user-data-dir=${electronUserDataDir}`
                ],
                {
                    env: { ...process.env, ELECTRON_ENABLE_LOGGING: 'true' },
                    stdio: ['ignore', electronLog, nodeInspectorLog]
                }
            );

            const nodeInspectorUrl = await waitForNodeInspectorUrl(nodeInspectorLogPath, waitFor);
            const mainProcessClient = new MainProcessClient(nodeInspectorUrl);
            await mainProcessClient.connect();
            setMainProcessClient(mainProcessClient);

            const portFile = join(electronUserDataDir, 'DevToolsActivePort');
            await waitFor(() => fs.existsSync(portFile), 15000, `Timed out waiting for file ${portFile}`);

            const debugPort = fs.readFileSync(portFile, 'utf8').split('\n')[0].trim();
            await waitForElectronPageTarget(debugPort);

            chromedriverPort = await getFreePort();
            chromedriverProcess = spawn(chromedriverBinary, [`--port=${chromedriverPort}`, '--url-base=/', '--verbose'], {
                stdio: ['ignore', chromedriverLog, chromedriverLog]
            });

            await waitForChromedriver(chromedriverPort);

            const browser = await remote({
                automationProtocol: 'webdriver',
                hostname: '127.0.0.1',
                port: chromedriverPort,
                path: '/',
                logLevel: 'error',
                connectionRetryCount: 0,
                connectionRetryTimeout: 10000,
                capabilities: {
                    browserName: 'chrome',
                    'goog:chromeOptions': {
                        debuggerAddress: `127.0.0.1:${debugPort}`,
                        windowTypes: ['page', 'webview']
                    }
                }
            });

            setBrowser(browser);
            await installMenuTestHooks();
        }
    ],
    afterAll: [
        async function () {
            this.timeout(15000);

            await killProcess(electronAppProcess);
            electronAppProcess = null;

            try {
                await getBrowser().deleteSession();
            } catch (_error) {
                // ignore teardown errors from already-closed sessions
            }

            try {
                await getMainProcessClient().dispose();
            } catch (_error) {
                // ignore teardown errors from already-closed sockets
            }

            await killProcess(chromedriverProcess);
            chromedriverProcess = null;

            if (electronUserDataDir) {
                removeDirectory(electronUserDataDir);
                electronUserDataDir = null;
            }
        }
    ]
};
