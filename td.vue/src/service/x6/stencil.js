import factory from './factory.js';
import shapes from './shapes/index.js';

const getDefaults = (target) => ({
    title: 'Entities',
    target,
    stencilGraphWidth: 500,
    groups: [
        {
            name: 'entities',
            title: 'Entities',
            collapsed: false,
            collapsable: true,
        },
        {
            name: 'boundaries',
            title: 'Boundaries',
            collapsed: true,
            collapsable: true
        },
        {
            name: 'metadata',
            title: 'Metadata',
            collapsed: true,
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
    placeholder: 'Search',
    notFoundText: "We don't have that yet, want to open an issue? :)"
});

const get = (target, container) => {
    const stencil = factory.stencil(getDefaults(target));

    stencil.load([
        new shapes.ProcessShape(),
        new shapes.Store(),
        new shapes.Actor(),
        new shapes.FlowStencil()
    ], 'entities');

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
