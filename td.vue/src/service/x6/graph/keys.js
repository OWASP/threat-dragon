import saveDiagram from '@/service/diagram/save.js';
import store from '@/store/index.js';

const del = (graph) => () => graph.removeCells(graph.getSelectedCells());

const undo = (graph) => () => {
    if (!graph.getPlugin('history').canUndo()) {
        return false;
    }
    graph.getPlugin('history').undo();
};

const redo = (graph) => () => {
    if (!graph.getPlugin('history').canRedo()) {
        return false;
    }
    graph.getPlugin('history').redo();
};

const copy = (graph) => () => {
    const cells = graph.getSelectedCells();
    if (!cells || cells.length === 0) {
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

const save = (graph) => (evt) => {
    evt?.preventDefault();
    const appStore = store.get();
    const diagram = appStore.state?.threatmodel?.selectedDiagram || {};
    saveDiagram.save(appStore, graph, diagram);
};

const bind = (graph) => {
    graph.bindKey('del', del(graph));
    graph.bindKey('ctrl+z', undo(graph));
    graph.bindKey('ctrl+y', redo(graph));
    graph.bindKey('ctrl+c', copy(graph));
    graph.bindKey('ctrl+v', paste(graph));
    graph.bindKey('ctrl+s', save(graph));
};

export default {
    bind
};
