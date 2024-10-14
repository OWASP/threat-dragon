import shapes from './shapes/index.js';
import { tc } from '@/i18n/index.js';
import { Stencil as DefaultStencil } from '@antv/x6-plugin-stencil';

const getStencilConfig = (target) => ({
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
        resizeToFit: true,
    },
});

const get = (target, container, StencilClass = DefaultStencil) => {
    const stencil = new StencilClass(getStencilConfig(target));

    stencil.load(
        [
            new shapes.ProcessShape(),
            new shapes.StoreShape(),
            new shapes.ActorShape(),
            new shapes.FlowStencil(),
        ],
        'components'
    );

    stencil.load(
        [
            new shapes.TrustBoundaryBox({
                width: 160,
                height: 75,
            }),
            new shapes.TrustBoundaryCurveStencil(),
        ],
        'boundaries'
    );

    stencil.load([new shapes.TextBlock()], 'metadata');

    stencil.onSearch({ target: { value: ' ' } });
    stencil.onSearch({ target: { value: '' } });

    container.appendChild(stencil.container);
};

export default {
    get,
};

