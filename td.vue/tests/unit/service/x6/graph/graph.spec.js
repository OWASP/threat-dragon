import { Export } from '@antv/x6-plugin-export';

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

        it('does not add the event listeners', () => {
            expect(events.listen).not.toHaveBeenCalled();
        });
    });

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
                })
            );
        });

        it('enables resizing and rotation', () => {
            expect(graphRes.use).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'transform',
                    disabled: false,
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

        it('enables connecting', () => {
            expect(graphRes.connecting).toEqual(expect.objectContaining({
                allowNode: true,
                allowBlank: true
            }));
        });

        it('enables the scroller', () => {
            expect(graphRes.use).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'scroller',
                })
            );
        });

        it('adds the event listeners', () => {
            expect(events.listen).toHaveBeenCalledTimes(1);
        });

        it('adds the key bindings', () => {
            expect(keys.bind).toHaveBeenCalledTimes(1);
        });

        it('uses the export plugin', () => {
            expect(graphRes.use).toHaveBeenCalledWith(new Export());
        });
    });
});
