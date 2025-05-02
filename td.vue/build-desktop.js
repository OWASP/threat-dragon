#!/usr/bin/env node

/**
 * This script is a wrapper around the electron:build command that handles
 * platform-specific dependencies gracefully.
 */

const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

// Determine the current platform
const platform = os.platform();
console.log(`Building for platform: ${platform}`);

// Set environment variables
process.env.NODE_ENV = 'production';
process.env.PYTHON_PATH = 'python3';

// Function to check if a module is installed
function isModuleInstalled(moduleName) {
    try {
        require.resolve(moduleName);
        return true;
    } catch (e) {
        return false;
    }
}

// Function to try installing a package
function tryInstallPackage(packageName) {
    console.log(`Attempting to install ${packageName}...`);
    try {
        // Install the package as a dev dependency to ensure it's in the right location
        execSync(`npm install --save-dev ${packageName}`, { stdio: 'inherit' });
        console.log(`Successfully installed ${packageName}`);
        return true;
    } catch (error) {
        console.warn(`Warning: Failed to install ${packageName}. Continuing anyway.`);
        console.warn(`Error details: ${error.message}`);
        return false;
    }
}

// Platform-specific checks
let buildCommand = 'npx vue-cli-service electron:build';

// Add platform-specific flags
if (platform === 'darwin') {
    // macOS - check for dmg-license
    if (!isModuleInstalled('dmg-license')) {
        console.warn('Warning: dmg-license is not installed. Attempting to install it...');
        tryInstallPackage('dmg-license');
    }
    
    // Check for dmg-builder
    if (!isModuleInstalled('dmg-builder')) {
        console.warn('Warning: dmg-builder is not installed. Attempting to install it...');
        tryInstallPackage('dmg-builder');
    }
    
    buildCommand += ' --mac';
} else if (platform === 'win32') {
    // Windows - check for electron-builder-squirrel-windows
    if (!isModuleInstalled('electron-builder-squirrel-windows')) {
        console.warn('Warning: electron-builder-squirrel-windows is not installed. Attempting to install it...');
        tryInstallPackage('electron-builder-squirrel-windows');
    }
    buildCommand += ' --win';
} else if (platform === 'linux') {
    // Linux - no specific dependencies to check
    buildCommand += ' --linux';
}

// Check for other common optional dependencies
const optionalDependencies = [
    'app-builder-bin',
    'app-builder-lib'
];

optionalDependencies.forEach(dep => {
    if (!isModuleInstalled(dep)) {
        console.warn(`Warning: ${dep} is not installed. Attempting to install it...`);
        tryInstallPackage(dep);
    }
});

// Fix Python compatibility issue if needed
const corePyPath = path.join(__dirname, 'node_modules/vue-cli-plugin-electron-builder/node_modules/dmg-builder/vendor/dmgbuild/core.py');
if (fs.existsSync(corePyPath)) {
    const content = fs.readFileSync(corePyPath, 'utf8');
    if (content.includes('reload(sys)') && !content.includes('try:')) {
        console.log('Fixing Python 3 compatibility in core.py...');
        const fixedContent = content.replace(
            'import sys\nreload(sys)  # Reload is a hack\nsys.setdefaultencoding(\'UTF8\')',
            'import sys\ntry:\n    # Python 2\n    reload(sys)  # Reload is a hack\n    sys.setdefaultencoding(\'UTF8\')\nexcept NameError:\n    # Python 3\n    import importlib\n    # No need to set default encoding in Python 3 as it\'s UTF-8 by default'
        );
        fs.writeFileSync(corePyPath, fixedContent, 'utf8');
    }
}

// Execute the build command
try {
    console.log(`Executing: ${buildCommand}`);
    execSync(buildCommand, { stdio: 'inherit' });
    console.log('Build completed successfully');
} catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
}