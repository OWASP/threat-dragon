import labels from './labels.js';

const getEdgeLabels = (cell) => {
    const res = [];
    if (!cell.labels) {
        return res;
    }

    cell.labels.forEach((label) => {
        res.push({
            position: label.position,
            attrs: { label: { text: labels.getText(cell, label) } }
        });
    });

    return res;
};

const applyData = (cell, data) => {
    if (data.type === 'tm.Flow') {
        data.protocol = cell.protocol || '';
        data.isEncrypted = !!cell.isEncrypted;
        data.isPublicNetwork = !!cell.isPublicNetwork;
    }
};

const map = (constructor) => (cell) => {
    return new constructor({
        source: cell.source,
        target: cell.target,
        vertices: cell.vertices,
        connector: 'smooth',
        attrs: {},
        labels: getEdgeLabels(cell)
    });
};

export default {
    map,
    applyData
};
