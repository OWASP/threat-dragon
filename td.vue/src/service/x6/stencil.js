import { Graph } from '@antv/x6';
import { Stencil } from '@antv/x6-plugin-stencil';

import shapes from './shapes/index.js';
import { tc } from '@/i18n/index.js';

const getStencil = (target) => ({
    title: tc('threatmodel.stencil.entities'),
    target,
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

const ports = {
    groups: {
        top: {
            position: 'top',
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#5F95FF',
                    strokeWidth: 1,
                    fill: '#fff',
                    style: {
                        visibility: 'hidden',
                    },
                },
            },
        },
        right: {
            position: 'right',
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#5F95FF',
                    strokeWidth: 1,
                    fill: '#fff',
                    style: {
                        visibility: 'hidden',
                    },
                },
            },
        },
        bottom: {
            position: 'bottom',
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#5F95FF',
                    strokeWidth: 1,
                    fill: '#fff',
                    style: {
                        visibility: 'hidden',
                    },
                },
            },
        },
        left: {
            position: 'left',
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#5F95FF',
                    strokeWidth: 1,
                    fill: '#fff',
                    style: {
                        visibility: 'hidden',
                    },
                },
            },
        },
    },
    items: [
        {
            group: 'top',
        },
        {
            group: 'right',
        },
        {
            group: 'bottom',
        },
        {
            group: 'left',
        },
    ],
};

Graph.registerNode(
    'customRect',
    {
        inherit: 'rect',
        width: 66,
        height: 36,
        attrs: {
            body: {
                strokeWidth: 1,
                stroke: '#5F95FF',
                fill: '#EFF4FF',
            },
            text: {
                fontSize: 12,
                fill: '#262626',
            },
        },
        ports: { ...ports },
    },
    true,
);

// the target is the graph or diagram
const get = (target, container) => {
    const stencil = new Stencil(getStencil(target));

    stencil.load([
        new shapes.ProcessShape(),
        new shapes.StoreShape(),
        new shapes.ActorShape(),
        new shapes.FlowStencil(),
        new shapes.ProcessShape()
    ], 'components');

    stencil.load([
        new shapes.TrustBoundaryBox({
            width: 160,
            height: 75
        }),
        new shapes.TrustBoundaryCurveStencil()
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
