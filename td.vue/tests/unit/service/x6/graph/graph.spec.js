import events from '@/service/x6/graph/events.js';
import factory from '@/service/x6/factory.js';
import graph from '@/service/x6/graph/graph.js';
import keys from '@/service/x6/graph/keys.js';

describe('service/x6/graph/graph.js', () => {
  let container;
  beforeEach(() => {
    factory.graph = jest.fn().mockImplementation(c => c);
  });

  describe('getReadonlyGraph', () => {
    beforeEach(() => {
      container = { foo: 'bar' };
      events.listen = jest.fn();
      graph.getReadonlyGraph(container);
    });

    it('sets the container', () => {
      expect(factory.graph).toHaveBeenCalledWith(
        expect.objectContaining({ container })
      );
    });

    it('does not pprevent default context menus', () => {
      expect(factory.graph).toHaveBeenCalledWith(
        expect.objectContaining({ preventDefaultContextMenu: false })
      );
    });

    it('disables history', () => {
      expect(factory.graph).toHaveBeenCalledWith(
        expect.objectContaining({ history: { enabled: false }})
      );
    });

    it('auto resizes', () => {
      expect(factory.graph).toHaveBeenCalledWith(
        expect.objectContaining({ autoResize: container })
      );
    });

    it('adds the event listeners', () => {
      expect(events.listen).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEditGraph', () => {
    let graphRes;

    beforeEach(() => {
      container = { foo: 'bar' };
      events.listen = jest.fn();
      keys.bind = jest.fn();
      graphRes = graph.getEditGraph(container);
    });

    it('sets the container', () => {
      expect(factory.graph).toHaveBeenCalledWith(
        expect.objectContaining({ container })
      );
    });

    it('does not pprevent default context menus', () => {
      expect(factory.graph).toHaveBeenCalledWith(
        expect.objectContaining({ preventDefaultContextMenu: false })
      );
    });

    it('auto resizes', () => {
      expect(factory.graph).toHaveBeenCalledWith(
        expect.objectContaining({ autoResize: container })
      );
    });

    it('does not save history for tool actions', () => {
      expect(graphRes.history.beforeAddCommand({}, { key: 'tools' })).toEqual(false);
    });

    it('saves history if not a tool', () => {
      expect(graphRes.history.beforeAddCommand({}, { key: 'other' })).toEqual(true);
    });

    it('enables history', () => {
      expect(graphRes.history.enabled).toEqual(true);
    });

    it('sets the grid', () => {
      expect(graphRes.grid).toEqual({
        size: 10,
        visible: true
      });
    });

    it('sets the snapline', () => {
      expect(graphRes.snapline).toEqual({
        enabled: true,
        sharp: true
      });
    });

    it('enables the clipboard', () => {
      expect(graphRes.clipboard).toEqual({
        enabled: true
      });
    });

    it('enables the keyboard globally', () => {
      expect(graphRes.keyboard).toEqual({
        enabled: true,
        global: true
      });
    });

    it('enables rotation', () => {
      expect(graphRes.rotating).toEqual({
        enabled: true
      });
    });

    it('enables selecting', () => {
      expect(graphRes.selecting).toEqual({
        enabled: true,
        pointerEvents: 'auto',
        rubberband: true,
        rubberNode: true,
        rubberEdge: true,
        multiple: true,
        movable: true,
        strict: true,
        useCellGeometry: false,
        showNodeSelectionBox: false,
        showEdgeSelectionBox: false,
        selectNodeOnMoved: false,
        selectEdgeOnMoved: false,
        selectCellOnMoved: false,
        content: null,
        handles: null
      });
    });

    it('enables resizing', () => {
      expect(graphRes.resizing).toEqual({
        enabled: true,
        minWidth: 50,
        minHeight: 50,
        maxWidth: Number.MAX_SAFE_INTEGER,
        maxHeight: Number.MAX_SAFE_INTEGER,
        orthogonal: true,
        restricted: false,
        autoScroll: true,
        preserveAspectRatio: true,
        allowReverse: true
      });
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
      expect(graphRes.scroller).toEqual({
        enabled: true,
        autoResize: true,
        pannable: false,
        pageVisible: true,
        pageBreak: true
      });
    });

    it('adds the event listeners', () => {
      expect(events.listen).toHaveBeenCalledTimes(1);
    });

    it('adds the key bindings', () => {
      expect(keys.bind).toHaveBeenCalledTimes(1);
    });
  });
});
