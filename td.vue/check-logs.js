// Script to check electron logs
const fs = require('fs');
const os = require('os');
const path = require('path');

// Get the electron logs location based on OS
function getElectronLogPath() {
    let logPath;
    if (process.platform === 'darwin') {
        logPath = path.join(os.homedir(), 'Library', 'Logs', 'OWASP Threat Dragon');
    } else if (process.platform === 'win32') {
        logPath = path.join(os.homedir(), 'AppData', 'Roaming', 'OWASP Threat Dragon', 'logs');
    } else {
        logPath = path.join(os.homedir(), '.config', 'OWASP Threat Dragon', 'logs');
    }
    return logPath;
}

// Check for the latest log file in the directory
function getLatestLogFile(logPath) {
    try {
        if (!fs.existsSync(logPath)) {
            console.log(`Log directory does not exist: ${logPath}`);
            return null;
        }
        
        const files = fs.readdirSync(logPath);
        const logFiles = files.filter(file => file.endsWith('.log'));
        
        if (logFiles.length === 0) {
            console.log(`No log files found in ${logPath}`);
            return null;
        }
        
        // Sort files by modified time, newest first
        logFiles.sort((a, b) => {
            return fs.statSync(path.join(logPath, b)).mtime.getTime() - 
                   fs.statSync(path.join(logPath, a)).mtime.getTime();
        });
        
        return path.join(logPath, logFiles[0]);
    } catch (error) {
        console.error('Error getting latest log file:', error);
        return null;
    }
}

// Read and display log file
function displayLogFile(logFile) {
    try {
        if (!logFile || !fs.existsSync(logFile)) {
            console.log(`Log file does not exist: ${logFile}`);
            return;
        }
        
        console.log(`Reading log file: ${logFile}`);
        const logContent = fs.readFileSync(logFile, 'utf8');
        console.log('\n--- LOG CONTENT ---\n');
        console.log(logContent);
        console.log('\n--- END OF LOG ---\n');
    } catch (error) {
        console.error('Error reading log file:', error);
    }
}

// Watch log file for changes
function watchLogFile(logFile) {
    if (!logFile) return;
    
    console.log(`Watching log file for changes: ${logFile}`);
    let lastSize = fs.statSync(logFile).size;
    
    // Check the file every second for changes
    const watcher = setInterval(() => {
        try {
            const stats = fs.statSync(logFile);
            if (stats.size > lastSize) {
                const newContent = fs.readFileSync(logFile, 'utf8').slice(lastSize);
                process.stdout.write(newContent);
                lastSize = stats.size;
            }
        } catch (error) {
            console.error('Error watching log file:', error);
            clearInterval(watcher);
        }
    }, 1000);
    
    // Stop watching after 5 minutes
    setTimeout(() => {
        console.log('Stopping log watch after 5 minutes');
        clearInterval(watcher);
    }, 5 * 60 * 1000);
}

// Main function
function main() {
    const logPath = getElectronLogPath();
    console.log(`Electron log path: ${logPath}`);
    
    const logFile = getLatestLogFile(logPath);
    if (logFile) {
        displayLogFile(logFile);
        
        // Watch for changes if --watch flag is provided
        if (process.argv.includes('--watch')) {
            watchLogFile(logFile);
        }
    }
}

main();