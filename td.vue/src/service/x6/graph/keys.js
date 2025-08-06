/**
 * @name keys
 * @description Adds key bindings to the graph
 */

import store from '@/store/index.js';

import {THREATMODEL_DIAGRAM_APPLIED, THREATMODEL_SAVE} from '@/store/actions/threatmodel.js';


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

const save = () => (evt) => {
    evt?.preventDefault();
    store.get().dispatch(THREATMODEL_DIAGRAM_APPLIED);
    store.get().dispatch(THREATMODEL_SAVE);
};

const bind = (graph) => {
    graph.bindKey('del', del(graph));
    graph.bindKey('ctrl+z', undo(graph));
    graph.bindKey('ctrl+y', redo(graph));
    graph.bindKey('ctrl+c', copy(graph));
    graph.bindKey('ctrl+v', paste(graph));
    graph.bindKey('ctrl+s', save());
};

export default {
    bind
};
