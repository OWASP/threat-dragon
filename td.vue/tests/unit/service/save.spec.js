import save from '@/service/save.js';

// Mock the logger
jest.mock('@/utils/logger.js', () => ({
    getLogger: jest.fn().mockReturnValue({
        debug: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        warn: jest.fn()
    })
}));

// Get the mocked logger
const mockLogger = require('@/utils/logger.js').getLogger();

describe('service/save.js', () => {
    const data = { foo: 'bar' };
    const name = 'test.json';
    
    beforeEach(() => {
        // Reset mocks
        mockLogger.debug.mockClear();
        mockLogger.error.mockClear();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
        delete window.showSaveFilePicker;
    });
    
    describe('local', () => {
        describe('when using legacy download approach', () => {
            let mockAnchor;
            
            beforeEach(() => {
                // Ensure showSaveFilePicker is not available
                delete window.showSaveFilePicker;
                
                mockAnchor = {
                    href: '',
                    download: '',
                    click: jest.fn(),
                    remove: jest.fn()
                };
                
                window.URL = {
                    createObjectURL: jest.fn().mockReturnValue('blob:url')
                };
                
                document.createElement = jest.fn().mockReturnValue(mockAnchor);
                global.Blob = function Blob(content, options) {
                    return { content, options };
                };
                
                save.local(data, name);
            });
            
            it('creates the object url with correct content type', () => {
                expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
                const blobArg = window.URL.createObjectURL.mock.calls[0][0];
                expect(blobArg.options.type).toBe('application/json');
            });
            
            it('sets the correct href and download attributes', () => {
                expect(mockAnchor.href).toBe('blob:url');
                expect(mockAnchor.download).toBe(name);
            });
            
            it('clicks the link', () => {
                expect(mockAnchor.click).toHaveBeenCalledTimes(1);
            });
            
            it('removes the anchor', () => {
                expect(mockAnchor.remove).toHaveBeenCalledTimes(1);
            });
            
            it('logs the correct debug message', () => {
                expect(mockLogger.debug).toHaveBeenCalledWith('Save using browser local filesystem download');
            });
        });
        
        describe('when using File System Access API', () => {
            describe('when user completes the save process', () => {
                let fileHandle;
                let writableMock;
                
                beforeEach(async () => {
                    writableMock = {
                        write: jest.fn().mockResolvedValue(undefined),
                        close: jest.fn().mockResolvedValue(undefined)
                    };
                    
                    fileHandle = {
                        createWritable: jest.fn().mockResolvedValue(writableMock),
                        queryPermission: jest.fn().mockResolvedValue('granted'),
                        requestPermission: jest.fn().mockResolvedValue('granted')
                    };
                    
                    window.showSaveFilePicker = jest.fn().mockResolvedValue(fileHandle);
                    
                    await save.local(data, name);
                });
                
                it('calls showSaveFilePicker with correct options', () => {
                    expect(window.showSaveFilePicker).toHaveBeenCalledWith({
                        suggestedName: name,
                        types: [
                            {
                                description: 'Threat Model',
                                accept: {
                                    'application/json': ['.json'],
                                },
                            },
                        ],
                    });
                });
                
                it('checks and requests permission', () => {
                    expect(fileHandle.queryPermission).toHaveBeenCalledWith({ mode: 'readwrite' });
                });
                
                it('creates a writable stream', () => {
                    expect(fileHandle.createWritable).toHaveBeenCalled();
                });
                
                it('writes the data to the file', () => {
                    expect(writableMock.write).toHaveBeenCalledWith({
                        type: 'write',
                        position: 0,
                        data: JSON.stringify(data, null, 2)
                    });
                });
                
                it('closes the writable stream', () => {
                    expect(writableMock.close).toHaveBeenCalled();
                });
                
                it('logs the correct debug message', () => {
                    expect(mockLogger.debug).toHaveBeenCalledWith('Save using browser file picker');
                });
            });
            
            describe('when user cancels the file picker', () => {
                beforeEach(async () => {
                    window.showSaveFilePicker = jest.fn().mockRejectedValue(new Error('User cancelled'));
                    await save.local(data, name);
                });
                
                it('logs the correct debug message when user cancels', () => {
                    expect(mockLogger.debug).toHaveBeenCalledWith('Save failed, probably user canceled file picker');
                });
            });
            
            describe('when permission is granted on request but not initially', () => {
                let fileHandle;
                let writableMock;
                
                beforeEach(async () => {
                    writableMock = {
                        write: jest.fn().mockResolvedValue(undefined),
                        close: jest.fn().mockResolvedValue(undefined)
                    };
                    
                    fileHandle = {
                        createWritable: jest.fn().mockResolvedValue(writableMock),
                        queryPermission: jest.fn().mockResolvedValue('denied'),
                        requestPermission: jest.fn().mockResolvedValue('granted')
                    };
                    
                    window.showSaveFilePicker = jest.fn().mockResolvedValue(fileHandle);
                    
                    await save.local(data, name);
                });
                
                it('requests permission and creates a writable if granted', () => {
                    expect(fileHandle.queryPermission).toHaveBeenCalledWith({ mode: 'readwrite' });
                    expect(fileHandle.requestPermission).toHaveBeenCalledWith({ mode: 'readwrite' });
                    expect(fileHandle.createWritable).toHaveBeenCalled();
                });
            });

            describe('when permission is not granted', () => {
                let fileHandle;
                let writableMock;
                
                beforeEach(async () => {
                    writableMock = {
                        write: jest.fn().mockResolvedValue(undefined),
                        close: jest.fn().mockResolvedValue(undefined)
                    };
                    
                    fileHandle = {
                        createWritable: jest.fn().mockResolvedValue(writableMock),
                        queryPermission: jest.fn().mockResolvedValue('denied'),
                        requestPermission: jest.fn().mockResolvedValue('denied')
                    };
                    
                    window.showSaveFilePicker = jest.fn().mockResolvedValue(fileHandle);
                    
                    await save.local(data, name);
                });
                
                it('checks permission and does not create a writable', () => {
                    expect(fileHandle.queryPermission).toHaveBeenCalledWith({ mode: 'readwrite' });
                    expect(fileHandle.requestPermission).toHaveBeenCalledWith({ mode: 'readwrite' });
                    expect(fileHandle.createWritable).not.toHaveBeenCalled();
                });
            });
            
            describe('when write operation fails', () => {
                let fileHandle;
                let writableMock;
                
                beforeEach(async () => {
                    writableMock = {
                        write: jest.fn().mockRejectedValue(new Error('Write failed')),
                        close: jest.fn().mockResolvedValue(undefined)
                    };
                    
                    fileHandle = {
                        createWritable: jest.fn().mockResolvedValue(writableMock),
                        queryPermission: jest.fn().mockResolvedValue('granted'),
                        requestPermission: jest.fn().mockResolvedValue('granted')
                    };
                    
                    window.showSaveFilePicker = jest.fn().mockResolvedValue(fileHandle);
                    
                    await save.local(data, name);
                });
                
                it('logs the correct error message when write fails', () => {
                    expect(mockLogger.debug).toHaveBeenCalledWith('Save failed, could not write to filesystem');
                });
                
                it('still tries to close the writable', () => {
                    expect(writableMock.close).toHaveBeenCalled();
                });
            });
        });
    });
});