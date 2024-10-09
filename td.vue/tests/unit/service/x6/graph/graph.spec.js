import events from '@/service/x6/graph/events.js';
import graph, { beforeAddCommand } from '@/service/x6/graph/graph.js';
import keys from '@/service/x6/graph/keys.js';

describe('service/x6/graph/graph.js', () => {
    let container;

    class GraphMock {
        constructor(args) {
            Object.assign(this, args);
        }
        use = jest.fn().mockReturnThis();
    }

    describe('getReadonlyGraph', () => {
        beforeEach(() => {
            container = { foo: 'bar' };
            events.listen = jest.fn();
            graph.getReadonlyGraph(container, GraphMock);
        });

        it('adds the event listeners', () => {
            expect(events.listen).toHaveBeenCalledTimes(1);
        });
    });

    // const foo = {
    //     "batchCommands": null, "batchLevel": 0, "freezed": false, "handlers": [], "lastBatchIndex": -1, "listeners": {
    //         "add": [[Function onCommandAdded], {
    //             "cancelInvalid": true,
    //             "command": [Circular], "listeners": {}, "map": {}
    //         }]
    //     }, "name": "history", "options": {
    //         "applyOptionsList": ["propertyPath"], "beforeAddCommand": [Function beforeAddCommand], "enabled":
    //             true, "eventNames": ["cell:added", "cell:removed", "cell:change:*"], "revertOptionsList": ["propertyPath"]
    //     }, "stackSize": 0, "validator": {
    //         "cancelInvalid": true, "command": [Circular
    //         ], "listeners": {}, "map": {}
    //     }
    // }

    describe('getEditGraph', () => {
        let graphRes;

        beforeEach(() => {
            container = { foo: 'bar' };
            events.listen = jest.fn();
            keys.bind = jest.fn();
            graphRes = graph.getEditGraph(container, GraphMock);
        });

        it('applies the beforeAddCommand', () => {
            expect(graphRes.use).toHaveBeenCalledWith(
                expect.objectContaining({
                    options: expect.objectContaining({
                        beforeAddCommand: beforeAddCommand
                    })
                })
            );
        });

        it('does not save tool history', () => {
            expect(beforeAddCommand({}, { key: 'tools' })).toEqual(false);
        });

        it('saves history if not a tool', () => {
            expect(beforeAddCommand({}, { key: 'other' })).toEqual(true);
        });

        it('enables history', () => {
            expect(graphRes.use).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'history',
                    options: expect.objectContaining({
                        enabled: true
                    })
                })
            );
        });

        it('sets the grid', () => {
            expect(graphRes.grid).toEqual({
                size: 10,
                visible: true
            });
        });

        it('sets the snapline', () => {
            expect(graphRes.use).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'snapline',
                    options: expect.objectContaining({
                        enabled: true,
                        sharp: true
                    })
                })
            );
        });

        it('enables the clipboard', () => {
            expect(graphRes.use).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'clipboard',
                    options: expect.objectContaining({
                        enabled: true
                    })
                })
            );
        });

        it('enables the keyboard globally', () => {
            expect(graphRes.use).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'keyboard',
                    options: expect.objectContaining({
                        enabled: true,
                        global: true
                    })
                })
            );
        });

        it('enables selecting', () => {
            expect(graphRes.use).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'selection',
                    options: {
                        enabled: true,
                        rubberband: true,
                        rubberNode: true,
                        rubberEdge: true,
                        pointerEvents: 'auto',
                        multiple: true,
                        multipleSelectionModifiers: ['ctrl', 'meta'],
                        movable: true,
                        strict: true,
                        selectCellOnMoved: false,
                        selectNodeOnMoved: false,
                        selectEdgeOnMoved: false,
                        following: true,
                        content: null,
                        eventTypes: ['leftMouseDown', 'mouseWheelDown'],
                        useCellGeometry: false,
                        showNodeSelectionBox: false,
                        showEdgeSelectionBox: false,
                        handles: null
                    }
                })
            );
        });

        it('enables resizing and rotation', () => {
            console.dir(graphRes.use.mock.calls, { depth: 15 });
            expect(graphRes.use).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'transform',
                    disabled: false,
                    options: {
                        resizing: {
                            enabled: true,
                            minWidth: 50,
                            minHeight: 50,
                            maxWidth: 9007199254740991,
                            maxHeight: 9007199254740991,
                            orthogonal: true,
                            restricted: false,
                            autoScroll: true,
                            preserveAspectRatio: true,
                            allowReverse: true
                        },
                        rotating: true
                    }
                })
            );
        });

        it('enables the mouse wheel', () => {
            expect(graphRes.mousewheel).toEqual({
                enabled: true,
                global: true,
                modifiers: ['ctrl', 'meta']
            });
        });

        it('enables panning', () => {
            expect(graphRes.panning).toEqual({
                enabled: true,
                modifiers: ['shift']
            });
        });

        it('enables connecting', () => {
            expect(graphRes.connecting).toEqual({
                allowNode: true,
                allowBlank: true
            });
        });

        it('enables the scroller', () => {
            expect(graphRes.use).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'scroller',
                    options: expect.objectContaining({
                        enabled: true,
                        autoResize: true,
                        pannable: false,
                        pageVisible: true,
                        pageBreak: false
                    })
                })
            );
        });

        it('adds the event listeners', () => {
            expect(events.listen).toHaveBeenCalledTimes(1);
        });

        it('adds the key bindings', () => {
            expect(keys.bind).toHaveBeenCalledTimes(1);
        });
    });
});
