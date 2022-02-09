/**
 * Graciously adapted from https://github.com/electron/electron/issues/2288#issuecomment-337858978
 */
const isElectron = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.indexOf(' electron/') !== -1;
};

export default {
    isElectron
};
