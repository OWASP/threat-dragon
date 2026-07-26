import isElectron from 'is-electron';

export const isDesktopApp = () => {
    if (!isElectron()) {
        return false;
    }
    return typeof window !== 'undefined' && Boolean(window.electronAPI);
};

