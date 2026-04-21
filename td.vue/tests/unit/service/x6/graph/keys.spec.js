import keys from '@/service/x6/graph/keys.js';
import saveDiagram from '@/service/diagram/save.js';
import store from '@/store/index.js';

jest.mock('@/service/diagram/save.js', () => ({
    __esModule: true,
    default: {
        save: jest.fn()
    }
}));

jest.mock('@/store/index.js', () => ({
    __esModule: true,
    default: {
        get: jest.fn()
    }
}));

describe('service/x6/graph/keys.js', () => {
    let graph, mockCanUndo, mockCanRedo, mockUndo, mockRedo;
    let bindings;

    beforeEach(() => {
        bindings = {};
        mockCanUndo = jest.fn().mockReturnValue(true);
        mockCanRedo = jest.fn().mockReturnValue(true);
        mockUndo = jest.fn();
        mockRedo = jest.fn();
        saveDiagram.save.mockClear();
        graph = {
            removeCells: jest.fn(),
            getSelectedCells: jest.fn(),
            getPlugin: (name) => {
                if (name === 'history') {
                    return {
                        canUndo: mockCanUndo,
                        canRedo: mockCanRedo,
                        undo: mockUndo,
                        redo: mockRedo
                    };
                }
            },
            copy: jest.fn(),
            isClipboardEmpty: jest.fn(),
            paste: jest.fn(),
            cleanSelection: jest.fn(),
            select: jest.fn(),
            bindKey: jest.fn().mockImplementation((key, fn) => {
                bindings[key] = fn;
            })
        };
        store.get.mockReturnValue({
            state: {
                threatmodel: {
                    selectedDiagram: {
                        id: 'diagram-1'
                    }
                }
            }
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            keys.bind(graph);
            bindings.del();
        });

        it('binds to the delete key', () => {
            expect(graph.bindKey).toHaveBeenCalledWith('del', expect.any(Function));
        });

        it('gets the selected cells', () => {
            expect(graph.getSelectedCells).toHaveBeenCalled();
        });

        it('removes the selected cells', () => {
            expect(graph.removeCells).toHaveBeenCalled();
        });
    });

    describe('undo', () => {
        describe('canUndo is true', () => {
            beforeEach(() => {
                graph.getPlugin('history').canUndo.mockImplementation(() => true);
                keys.bind(graph);
                bindings['ctrl+z']();
            });

            it('binds to the ctrl + x keys', () => {
                expect(graph.bindKey).toHaveBeenCalledWith('ctrl+z', expect.any(Function));
            });

            it('checks if it can undo', () => {
                expect(graph.getPlugin('history').canUndo).toHaveBeenCalled();
            });

            it('calls undo', () => {
                expect(graph.getPlugin('history').undo).toHaveBeenCalled();
            });
        });

        describe('canUndo is false', () => {
            beforeEach(() => {
                graph.getPlugin('history').canUndo.mockImplementation(() => false);
                keys.bind(graph);
                bindings['ctrl+z']();
            });

            it('does not call undo', () => {
                expect(graph.getPlugin('history').undo).not.toHaveBeenCalled();
            });
        });
    });

    describe('redo', () => {
        describe('canRedo is true', () => {
            beforeEach(() => {
                graph.getPlugin('history').canRedo.mockImplementation(() => true);
                keys.bind(graph);
                bindings['ctrl+y']();
            });

            it('binds to the ctrl + y keys', () => {
                expect(graph.bindKey).toHaveBeenCalledWith('ctrl+y', expect.any(Function));
            });

            it('checks if it can redo', () => {
                expect(graph.getPlugin('history').canRedo).toHaveBeenCalled();
            });

            it('calls redo', () => {
                expect(graph.getPlugin('history').redo).toHaveBeenCalled();
            });
        });

        describe('canRedo is false', () => {
            beforeEach(() => {
                graph.getPlugin('history').canRedo.mockImplementation(() => false);
                keys.bind(graph);
                bindings['ctrl+y']();
            });

            it('does not call redo', () => {
                expect(graph.getPlugin('history').redo).not.toHaveBeenCalled();
            });
        });
    });

    describe('copy', () => {
        describe('with undefined selected cells', () => {
            beforeEach(() => {
                keys.bind(graph);
                bindings['ctrl+c']();
            });

            it('binds to the ctrl + c keys', () => {
                expect(graph.bindKey).toHaveBeenCalledWith('ctrl+c', expect.any(Function));
            });

            it('does not call copy', () => {
                expect(graph.copy).not.toHaveBeenCalled();
            });
        });

        describe('with 0 selected cells', () => {
            beforeEach(() => {
                graph.getSelectedCells.mockImplementation(() => []);
                keys.bind(graph);
                bindings['ctrl+c']();
            });

            it('does not call copy', () => {
                expect(graph.copy).not.toHaveBeenCalled();
            });
        });

        describe('with selected cells', () => {
            let cells;

            beforeEach(() => {
                cells = [{ foo: 'bar' }];
                graph.getSelectedCells.mockImplementation(() => cells);
                keys.bind(graph);
                bindings['ctrl+c']();
            });


            it('gets the selected cells', () => {
                expect(graph.getSelectedCells).toHaveBeenCalled();
            });

            it('copies the cells', () => {
                expect(graph.copy).toHaveBeenCalledWith(cells);
            });
        });
    });

    describe('paste', () => {
        describe('with an empty clipboard', () => {
            beforeEach(() => {
                graph.isClipboardEmpty.mockImplementation(() => true);
                keys.bind(graph);
                bindings['ctrl+v']();
            });

            it('binds to the ctrl + v keys', () => {
                expect(graph.bindKey).toHaveBeenCalledWith('ctrl+v', expect.any(Function));
            });

            it('does not paste the cells', () => {
                expect(graph.paste).not.toHaveBeenCalled();
            });

            it('does not clean the selection', () => {
                expect(graph.cleanSelection).not.toHaveBeenCalled();
            });

            it('does not select the cells', () => {
                expect(graph.select).not.toHaveBeenCalled();
            });
        });

        describe('with selected cells', () => {
            let cells;

            beforeEach(() => {
                cells = [{ foo: 'bar' }];
                graph.isClipboardEmpty.mockImplementation(() => false);
                graph.paste.mockImplementation(() => cells);
                keys.bind(graph);
                bindings['ctrl+v']();
            });

            it('pastes the cells', () => {
                expect(graph.paste).toHaveBeenCalled();
            });

            it('cleans the selection', () => {
                expect(graph.cleanSelection).toHaveBeenCalled();
            });

            it('selects the cells', () => {
                expect(graph.select).toHaveBeenCalledWith(cells);
            });
        });
    });

    it('binds ctrl + s to the shared save service', () => {
        const event = { preventDefault: jest.fn() };
        keys.bind(graph);
        bindings['ctrl+s'](event);

        expect(graph.bindKey).toHaveBeenCalledWith('ctrl+s', expect.any(Function));
        expect(event.preventDefault).toHaveBeenCalled();
        expect(saveDiagram.save).toHaveBeenCalledWith(store.get(), graph, { id: 'diagram-1' });
    });
});
