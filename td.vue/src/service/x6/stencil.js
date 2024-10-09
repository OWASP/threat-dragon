import { Stencil } from '@antv/x6-plugin-stencil';
import shapes from './shapes/index.js';
import { tc } from '@/i18n/index.js';

const getStencil = (target) => ({
    title: tc('threatmodel.stencil.entities'),
    target: target,
    collapsable: true,
    stencilGraphWidth: 500,
    groups: [
        {
            name: 'components',
            title: tc('threatmodel.stencil.components'),
            collapsed: false,
            collapsable: true
        },
        {
            name: 'boundaries',
            title: tc('threatmodel.stencil.boundaries'),
            collapsed: false,
            collapsable: true
        },
        {
            name: 'metadata',
            title: tc('threatmodel.stencil.metadata'),
            collapsed: false,
            collapsable: true
        }
    ],
    layoutOptions: {
        columns: 1,
        center: true,
        resizeToFit: true
    }
});

// the target is the graph or diagram
const get = (target, container) => {
    const stencil = new Stencil(getStencil(target));

    stencil.load([
        new shapes.ProcessShape(),
        new shapes.StoreShape(),
        new shapes.ActorShape(),
        // new shapes.FlowStencil()
    ], 'components');

    stencil.load([
        new shapes.TrustBoundaryBox({
            width: 160,
            height: 75
        }),
    ], 'boundaries');

    stencil.load([
        new shapes.TextBlock()
    ], 'metadata');

    // Searching forces a redraw of the stencil, which will ensure that all items in
    // the group are shown.  The boundaries are automatically calculated.
    // I could not find a way of doing that using the constructor options,
    // so this is a hack to force it to happen.
    stencil.onSearch({ target: { value: ' ' } });
    stencil.onSearch({ target: { value: '' } });

    // Add it to the DOM
    container.appendChild(stencil.container);
};

export default {
    get
};
