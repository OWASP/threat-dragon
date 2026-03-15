const fs = require('fs');
const { WebSocket } = require('ws');
const { getMainProcessClient } = require('./session');

const SOCKET_CLOSE_TIMEOUT_MS = 1000;
const DEFAULT_NODE_INSPECTOR_TIMEOUT_MS = 15000;
const DIALOG_OK_BUTTON_INDEX = 0;
const HTML_EXPORT_STUB_CONTENT = '<html><body>Threat Dragon export</body></html>';
const PDF_EXPORT_STUB_CONTENT = '%PDF-1.4\n%ThreatDragonE2E\n';

class MainProcessClient {
    constructor(wsUrl) {
        this.wsUrl = wsUrl;
        this.socket = null;
        this.nextId = 0;
    }

    async connect() {
        this.socket = new WebSocket(this.wsUrl);

        await new Promise((resolve, reject) => {
            this.socket.once('open', resolve);
            this.socket.once('error', reject);
        });

        await this.request('Runtime.enable');
    }

    async request(method, params = {}) {
        return new Promise((resolve, reject) => {
            const id = ++this.nextId;
            const onMessage = (raw) => {
                const payload = JSON.parse(raw.toString());

                if (payload.id !== id) {
                    return;
                }

                this.socket.off('message', onMessage);

                if (payload.error) {
                    reject(new Error(JSON.stringify(payload.error)));
                    return;
                }

                resolve(payload.result);
            };

            this.socket.on('message', onMessage);
            this.socket.send(JSON.stringify({ id, method, params }));
        });
    }

    async evaluate(expression) {
        const result = await this.request('Runtime.evaluate', {
            expression,
            returnByValue: true,
            awaitPromise: true
        });

        if (result.exceptionDetails) {
            throw new Error(result.exceptionDetails.exception.description);
        }

        return result.result.value;
    }

    async dispose() {
        if (!this.socket) {
            return;
        }

        await new Promise((resolve) => {
            const cleanup = () => {
                clearTimeout(timeout);
                resolve();
            };
            const timeout = setTimeout(() => {
                try {
                    this.socket.terminate();
                } catch (_error) {
                    // ignore teardown errors on an already-closed socket
                }
                resolve();
            }, SOCKET_CLOSE_TIMEOUT_MS);

            this.socket.once('close', cleanup);
            this.socket.once('error', cleanup);

            try {
                this.socket.close();
            } catch (_error) {
                cleanup();
            }
        });
    }
}

const waitForNodeInspectorUrl = async (logPath, waitFor, timeoutMs = DEFAULT_NODE_INSPECTOR_TIMEOUT_MS) => {
    return waitFor(
        () => {
            if (!fs.existsSync(logPath)) {
                return null;
            }

            const text = fs.readFileSync(logPath, 'utf8');
            const match = text.match(/Debugger listening on (ws:\/\/127\.0\.0\.1:\d+\/[^\s]+)/);
            return match ? match[1] : null;
        },
        timeoutMs,
        `Timed out waiting for Node inspector URL in ${logPath}`
    );
};

const installMenuTestHooks = async () => {
    return getMainProcessClient().evaluate(`
        (() => {
            const electron = process.mainModule.require('electron');
            const fs = process.mainModule.require('fs');
            const state = global.__tdDesktopE2E = global.__tdDesktopE2E || {
                externalUrls: [],
                messageBoxes: [],
                openDialogCalls: [],
                saveDialogCalls: [],
                htmlExports: [],
                pdfExports: [],
                nextOpenDialogResult: null,
                nextSaveDialogResult: null
            };

            if (!state.installed) {
                electron.dialog.showOpenDialog = async (options) => {
                    state.openDialogCalls.push(options);
                    const result = state.nextOpenDialogResult || { canceled: true, filePaths: [] };
                    state.nextOpenDialogResult = null;
                    return result;
                };

                electron.dialog.showSaveDialog = async (options) => {
                    state.saveDialogCalls.push(options);
                    const result = state.nextSaveDialogResult || { canceled: true, filePath: '' };
                    state.nextSaveDialogResult = null;
                    return result;
                };

                electron.dialog.showMessageBoxSync = (options) => {
                    state.messageBoxes.push(options);
                    return ${DIALOG_OK_BUTTON_INDEX};
                };

                electron.shell.openExternal = async (url) => {
                    state.externalUrls.push(url);
                    return '';
                };

                state.installed = true;
            }

            const [window] = electron.BrowserWindow.getAllWindows();
            if (window) {
                window.webContents.savePage = async (filePath) => {
                    fs.writeFileSync(filePath, ${JSON.stringify(HTML_EXPORT_STUB_CONTENT)});
                    state.htmlExports.push(filePath);
                };

                window.webContents.printToPDF = async () => {
                    state.pdfExports.push('generated');
                    return Buffer.from(${JSON.stringify(PDF_EXPORT_STUB_CONTENT)});
                };
            }

            return true;
        })()
    `);
};

const resetMenuTestState = async () => {
    return getMainProcessClient().evaluate(`
        (() => {
            const state = global.__tdDesktopE2E;
            if (!state) {
                return false;
            }

            state.externalUrls = [];
            state.messageBoxes = [];
            state.openDialogCalls = [];
            state.saveDialogCalls = [];
            state.htmlExports = [];
            state.pdfExports = [];
            state.nextOpenDialogResult = null;
            state.nextSaveDialogResult = null;
            return true;
        })()
    `);
};

const setNextOpenDialogResult = async (result) => {
    return getMainProcessClient().evaluate(`
        (() => {
            global.__tdDesktopE2E.nextOpenDialogResult = ${JSON.stringify(result)};
            return true;
        })()
    `);
};

const setNextSaveDialogResult = async (result) => {
    return getMainProcessClient().evaluate(`
        (() => {
            global.__tdDesktopE2E.nextSaveDialogResult = ${JSON.stringify(result)};
            return true;
        })()
    `);
};

const getMenuTestState = async () => {
    return getMainProcessClient().evaluate(`
        (() => {
            const state = global.__tdDesktopE2E;
            return {
                externalUrls: state.externalUrls,
                messageBoxes: state.messageBoxes,
                openDialogCalls: state.openDialogCalls,
                saveDialogCalls: state.saveDialogCalls,
                htmlExports: state.htmlExports,
                pdfExports: state.pdfExports
            };
        })()
    `);
};

const getMenuSnapshot = async () => {
    return getMainProcessClient().evaluate(`
        (() => {
            const { Menu } = process.mainModule.require('electron');
            const menu = Menu.getApplicationMenu();

            return menu.items.map((item) => ({
                label: item.label || item.role || null,
                enabled: item.enabled,
                submenu: item.submenu ? item.submenu.items.map((subitem) => ({
                    label: subitem.label || subitem.role || null,
                    enabled: subitem.enabled,
                    submenu: subitem.submenu ? subitem.submenu.items.map((nested) => ({
                        label: nested.label || nested.role || null,
                        enabled: nested.enabled
                    })) : null
                })) : null
            }));
        })()
    `);
};

const clickMenuItem = async (...labels) => {
    return getMainProcessClient().evaluate(`
        (() => {
            const { Menu, BrowserWindow } = process.mainModule.require('electron');
            const [window] = BrowserWindow.getAllWindows();
            const labelPath = ${JSON.stringify(labels)};
            let item = { submenu: Menu.getApplicationMenu() };

            labelPath.forEach((label) => {
                if (!item.submenu) {
                    throw new Error('Menu path has no submenu for label: ' + label);
                }

                item = item.submenu.items.find((candidate) => {
                    return (candidate.label || candidate.role || null) === label;
                });

                if (!item) {
                    throw new Error('Menu item not found: ' + labelPath.join(' > '));
                }
            });

            if (typeof item.click === 'function') {
                item.click(item, window, {});
                return true;
            }

            if (item.role === 'close' && window) {
                window.close();
                return true;
            }

            return false;
        })()
    `);
};

module.exports = {
    MainProcessClient,
    waitForNodeInspectorUrl,
    installMenuTestHooks,
    resetMenuTestState,
    setNextOpenDialogResult,
    setNextSaveDialogResult,
    getMenuTestState,
    getMenuSnapshot,
    clickMenuItem
};
