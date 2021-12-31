import events from '@/service/x6/graph/events.js';
import factory from '@/service/x6/factory.js';
import graphService from '@/service/x6/graph/graph.js';
import keys from '@/service/x6/graph/keys.js';

describe('service/x6/graph/graph.js', () => {
    let cfg, container, graph;

    beforeEach(() => {
        const graphMock = { foo: 'bar' };
        container = { bar: 55 };
        events.listen = jest.fn();
        keys.bind = jest.fn();
        factory.graph = jest.fn().mockImplementation((config) => {
            cfg = config;
            return graphMock;
        });
        graph = graphService.get(container);
    });

    it('sets the container', () => {
        expect(cfg.container).toEqual(container);
    });

    it('does not prevent the default context menu', () => {
        expect(cfg.preventDefaultContextMenu).toEqual(false);
    });

    it('enables the history', () => {
        expect(cfg.history.enabled).toEqual(true);
    });

    it('does not add tools updates to the history stack', () => {
        const res = cfg.history.beforeAddCommand('foo', { key: 'tools' });
        expect(res).toEqual(false);
    });

    it('adds other updates to the history stack', () => {
        const res = cfg.history.beforeAddCommand('foo', { key: 'anything' });
        expect(res).toEqual(true);
    });

    it('enables the grid by default', () => {
        expect(cfg.grid).toEqual({
            size: 10,
            visible: true
        });
    });

    it('enables a sharp snapline by default', () => {
        expect(cfg.snapline).toEqual({
            enabled: true,
            sharp: true
        });
    });

    it('enables the clipboard', () => {
        expect(cfg.clipboard.enabled).toEqual(true);
    });

    it('enables keyboard shortcuts', () => {
        expect(cfg.keyboard).toEqual({
            enabled: true,
            global: true
        });
    });

    it('enables object rotation', () => {
        expect(cfg.rotating.enabled).toEqual(true);
    });

    it('enables selecting with options', () => {
        expect(cfg.selecting).toEqual({
            enabled: true,
            showNodeSelectionBox: false,
            showEdgeSelectionBox: true
        });
    });

    it('enables resizing with options', () => {
        expect(cfg.resizing).toEqual({
            enabled: true,
            minWidth: 0,
            minHeight: 0,
            maxWidth: Number.MAX_SAFE_INTEGER,
            maxHeight: Number.MAX_SAFE_INTEGER,
            orthogonal: true,
            restricted: false,
            autoScroll: true,
            preserveAspectRatio: false,
            allowReverse: true
        });
    });

    it('enables mousewheel zooming', () => {
        expect(cfg.mousewheel).toEqual({
            enabled: true,
            global: true,
            modifiers: ['ctrl', 'meta']
        });
    });

    it('enables panning', () => {
        expect(cfg.panning).toEqual({
            enabled: true,
            modifiers: ['shift']
        });
    });

    it('enables scrolling', () => {
        expect(cfg.scroller).toEqual({
            autoResize: true,
            enabled: true,
            pageBreak: true,
            pageVisible: true,
            pannable: true
        });
    });

    it('enables connecting', () => {
        expect(cfg.connecting).toEqual({
            allowNode: true,
            allowBlank: true // needed for v1 diagrams, maybe edge cases too
        });
    });

    it('listens to events', () => {
        expect(events.listen).toHaveBeenCalledWith(graph);
    });

    it('adds the key bindings', () => {
        expect(keys.bind).toHaveBeenCalledWith(graph);
    });
});