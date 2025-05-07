// Mock for the electron module
export const app = {
    addRecentDocument: jest.fn()
};

export const dialog = {
    showOpenDialog: jest.fn().mockResolvedValue({ canceled: true }),
    showSaveDialog: jest.fn().mockResolvedValue({ canceled: true })
};

export const shell = {
    openExternal: jest.fn().mockResolvedValue()
};

// Export the default mock
const electron = {
    app,
    dialog,
    shell
};

// For CommonJS require() compatibility
module.exports = electron;
export default electron;