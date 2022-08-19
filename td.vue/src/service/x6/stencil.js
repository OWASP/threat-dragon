import factory from './factory.js';
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
            collapsable: true,
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
    },
    search: (cell, keyword) => {
        const search = keyword.toLowerCase();
        if (cell.label && typeof cell.label !== 'undefined') {
            return cell.label.toLowerCase().indexOf(search) !== -1;
        }
        return cell.shape.toLowerCase().indexOf(search) !== -1 ||
            cell.constructor.name.toLowerCase().indexOf(search) !== -1;
    },
    placeholder: tc('threatmodel.stencil.search'),
    notFoundText: tc('threatmodel.stencil.notFound')
});

// the target is the graph or diagram
const get = (target, container) => {
    const stencil = factory.stencil(getStencil(target));

    stencil.load([
        new shapes.ProcessShape(),
        new shapes.StoreShape(),
        new shapes.ActorShape(),
        new shapes.FlowStencil()
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
