const utils = {
    electronURL: null,
    isDevelopment: false,
    isTest: true,
    isMacOS: false,
    isWin: false
};

function getUtilsMock () {
    return {
        get electronURL () { return utils.electronURL; },
        get isDevelopment () { return utils.isDevelopment; },
        get isTest () { return utils.isTest; },
        get isMacOS () { return utils.isMacOS; },
        get isWin () { return utils.isWin; }
    };
}

module.exports = { utils, getUtilsMock };
