function getElectronMock () {
    return {
        app: { addRecentDocument: jest.fn() },
        protocol: {},
        BrowserWindow: function () {},
        Menu: {},
        ipcMain: {},
        dialog: {
            showOpenDialog: jest.fn(),
            showSaveDialog: jest.fn(),
            showMessageBoxSync: jest.fn()
        },
        shell: { openExternal: jest.fn() }
    };
}

module.exports = { getElectronMock };
