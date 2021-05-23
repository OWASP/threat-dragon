/**
 * @name keys
 * @description Adds key bindings to the graph
 */
const del = (graph) => () => graph.removeCells(graph.getSelectedCells());

const undo = (graph) => () => {
    if (graph.canUndo()) {
        graph.undo();
    }
};

const redo = (graph) => () => {
    if (graph.canRedo()) {
        graph.redo();
    }
};

const copy = (graph) => () => {
    const cells = graph.getSelectedCells();
    if (cells.length === 0) {
        return false;
    }
    graph.copy(cells);
};

const paste = (graph) => () => {
    if (graph.isClipboardEmpty()) {
        return false;
    }
    const cells = graph.paste({ offset: 32 });
    graph.cleanSelection();
    graph.select(cells);
};

const bind = (graph) => {
    graph.bindKey('del', del(graph));
    graph.bindKey('ctrl+z', undo(graph));
    graph.bindKey('ctrl+y', redo(graph));
    graph.bindKey('ctrl+c', copy(graph));
    graph.bindKey('ctrl+v', paste(graph));
};

export default {
    bind
};
