/**
 * Python Setup Script for Threat Dragon AI Tools
 * 
 * Windows: Downloads embedded Python (no system install required)
 * macOS/Linux: Creates venv using system Python
 */

const { join } = require('path');
const { spawnSync, execSync } = require('child_process');
const fs = require('fs');
const https = require('https');

const isWin = process.platform === 'win32';
const rootDir = process.cwd();
const pythonDir = join(rootDir, isWin ? 'python-embedded' : 'venv');
const reqFile = join(rootDir, 'ai-tools', 'requirements.txt');

// Stable Python version for Windows embedded
const PYTHON_VERSION = '3.14.2';

function run(cmd, args) {
    // On Windows with shell, properly quote paths that contain spaces
    let command = cmd;
    let commandArgs = args;
    
    if (isWin) {
        // Quote the command if it contains spaces
        if (cmd.includes(' ') && !cmd.startsWith('"')) {
            command = `"${cmd}"`;
        }
        // Quote each argument that contains spaces
        commandArgs = args.map(arg => {
            if (typeof arg === 'string' && arg.includes(' ') && !arg.startsWith('"')) {
                return `"${arg}"`;
            }
            return arg;
        });
        // On Windows with shell, combine command and args into a single string
        const fullCommand = `${command} ${commandArgs.join(' ')}`;
        console.log(`Running: ${fullCommand}`);
        const result = spawnSync(fullCommand, [], { 
            stdio: 'inherit', 
            shell: true
        });
        if (result.status !== 0) {
            throw new Error(`Command failed with exit code ${result.status}`);
        }
    } else {
        // Unix: use spawnSync normally
        console.log(`Running: ${cmd} ${args.join(' ')}`);
        const result = spawnSync(cmd, args, { 
            stdio: 'inherit'
        });
        if (result.status !== 0) {
            throw new Error(`Command failed with exit code ${result.status}`);
        }
    }
}

function download(url, dest) {
    return new Promise((resolve, reject) => {
        console.log(`Downloading: ${url}`);
        const file = fs.createWriteStream(dest);
        
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                file.close();
                fs.unlinkSync(dest);
                return download(res.headers.location, dest).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                file.close();
                fs.unlinkSync(dest);
                return reject(new Error(`HTTP ${res.statusCode}`));
            }
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(); });
        }).on('error', (e) => { fs.unlink(dest, () => {}); reject(e); });
    });
}

async function setupWindows() {
    const pythonExe = join(pythonDir, 'python.exe');
    const pipExe = join(pythonDir, 'Scripts', 'pip.exe');
    
    // Already set up?
    if (fs.existsSync(pythonExe) && fs.existsSync(pipExe)) {
        console.log('Embedded Python exists. Updating dependencies...');
        run(pipExe, ['install', '-r', reqFile, '-q']);
        return;
    }
    
    // Clean and create directory
    if (fs.existsSync(pythonDir)) {
        fs.rmSync(pythonDir, { recursive: true, force: true });
    }
    fs.mkdirSync(pythonDir, { recursive: true });
    
    // Download embedded Python
    const arch = process.arch === 'x64' ? 'amd64' : 'win32';
    const zipFile = `python-${PYTHON_VERSION}-embed-${arch}.zip`;
    const zipPath = join(rootDir, zipFile);
    
    await download(`https://www.python.org/ftp/python/${PYTHON_VERSION}/${zipFile}`, zipPath);
    
    // Extract using PowerShell
    console.log('Extracting...');
    execSync(`powershell -NoProfile -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${pythonDir}' -Force"`, { stdio: 'inherit' });
    fs.unlinkSync(zipPath);
    
    // Enable pip by modifying ._pth file
    const pthFile = fs.readdirSync(pythonDir).find(f => f.endsWith('._pth'));
    if (pthFile) {
        let content = fs.readFileSync(join(pythonDir, pthFile), 'utf8');
        content = content.replace(/^#\s*import site/m, 'import site');
        if (!content.includes('Lib/site-packages')) {
            content += '\nLib/site-packages\n';
        }
        fs.writeFileSync(join(pythonDir, pthFile), content);
    }
    
    // Install pip
    const getPipPath = join(pythonDir, 'get-pip.py');
    await download('https://bootstrap.pypa.io/get-pip.py', getPipPath);
    run(pythonExe, [getPipPath]);
    fs.unlinkSync(getPipPath);
    
    // Install dependencies
    console.log('Installing dependencies...');
    run(pipExe, ['install', '-r', reqFile]);
    
    console.log('Windows embedded Python setup complete!');
}

function setupUnix() {
    const venvPython = join(pythonDir, 'bin', 'python');
    const venvPip = join(pythonDir, 'bin', 'pip');
    
    // Already set up?
    if (fs.existsSync(venvPython) && fs.existsSync(venvPip)) {
        console.log('Virtual environment exists. Updating dependencies...');
        run(venvPip, ['install', '-r', reqFile, '-q']);
        return;
    }
    
    // Find system Python
    let pythonExe = null;
    for (const cmd of ['python3', 'python']) {
        const result = spawnSync(cmd, ['--version'], { encoding: 'utf8' });
        if (result.status === 0) {
            pythonExe = cmd;
            console.log(`Found: ${result.stdout.trim() || result.stderr.trim()}`);
            break;
        }
    }
    
    if (!pythonExe) {
        console.warn('\nWARNING: Python not found. AI Tools requires Python 3.10+.');
        console.warn('Install Python and run "npm install" again.\n');
        return;
    }
    
    // Create venv
    console.log('Creating virtual environment...');
    run(pythonExe, ['-m', 'venv', 'venv']);
    
    // Install dependencies
    console.log('Installing dependencies...');
    run(venvPip, ['install', '-r', reqFile]);
    
    console.log('Virtual environment setup complete!');
}

async function main() {
    console.log(`\nPython Setup (${process.platform}/${process.arch})\n`);
    
    if (!fs.existsSync(reqFile)) {
        console.error(`Error: ${reqFile} not found`);
        process.exit(1);
    }
    
    try {
        if (isWin) {
            await setupWindows();
        } else {
            setupUnix();
        }
    } catch (err) {
        console.error(`\nSetup failed: ${err.message}`);
        if (isWin) process.exit(1);
    }
}

main();
