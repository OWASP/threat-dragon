/**
 * Utility functions and constants for the desktop application
 */
module.exports = {
    /**
     * URL for Electron development server
     */
    electronURL: process.env.WEBPACK_DEV_SERVER_URL,

    /**
     * Whether the app is running in development mode
     */
    isDevelopment: process.env.NODE_ENV !== 'production',

    /**
     * Whether the app is running on macOS
     */
    isMacOS: process.platform === 'darwin',

    /**
     * Whether the app is running on Windows
     */
    isWin: process.platform === 'win32' || process.platform === 'win64',

    /**
     * Log level for the application
     */
    logLevel: process.env.LOG_LEVEL || 'debug'
};
