export const electronURL = process.env.ELECTRON_RENDERER_URL;
export const isDevelopment = process.env.NODE_ENV !== 'production';
export const isMacOS = process.platform === 'darwin';
export const isTest = process.env.IS_TEST === 'true';
export const isWin = (process.platform === 'win32' || process.platform === 'win64');
export const logLevel = process.env.LOG_LEVEL || 'debug';
