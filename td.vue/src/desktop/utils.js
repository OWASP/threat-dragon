module.exports = {
    electronURL: process.env.WEBPACK_DEV_SERVER_URL,
    isDevelopment: process.env.NODE_ENV !== 'production',
    isMacOS: process.platform === 'darwin',
    isTest: process.env.IS_TEST === 'true',
    isWin: (process.platform === 'win32' || process.platform === 'win64'),
    logLevel: process.env.LOG_LEVEL || 'debug'
};
