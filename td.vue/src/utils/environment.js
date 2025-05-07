import isElectronPackage from 'is-electron';

export const isElectronMode = () => {
    // Web-only mode always returns false for Electron checks
    if (process.env.VUE_APP_WEB_ONLY === true) {
        return false;
    }

    return (
        isElectronPackage() ||
        process.env.IS_ELECTRON === true ||
        (typeof window !== 'undefined' &&
            (window.electronAPI?.isElectron === true || window.isElectronMode === true))
    );
};

export const isServerEnabled = () => {
    return !isElectronMode();
};

export default {
    isElectronMode,
    isServerEnabled
};
