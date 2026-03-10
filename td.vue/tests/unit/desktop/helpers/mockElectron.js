function getElectronMock () {
    return {
        app: {},
        protocol: {},
        BrowserWindow: function () {},
        Menu: {},
        ipcMain: {},
        dialog: {},
        shell: {}
    };
}

module.exports = { getElectronMock };
