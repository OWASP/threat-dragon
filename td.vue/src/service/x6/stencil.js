import actor from './shapes/actor.js';
import factory from './factory.js';
import processShape from './shapes/process.js';
import store from './shapes/store.js';
import textBlock from './shapes/text.js';
import trustBoundaryBox from './shapes/trust-boundary-box.js';
import trustBoundaryCurve from './shapes/trust-boundary-curve.js';

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
            name: 'trust_boundaries',
            title: 'Trust Boundaries',
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
    const boxBoundary = new trustBoundaryBox.TrustBoundaryBox({
        width: 160,
        height: 75
    });
    const curveBoundary = new trustBoundaryCurve.TrustBoundaryCurve();
    const ps = new processShape.ProcessShape({
        width: 100,
        height: 100
    });
    const a = new actor.Actor();
    const s = new store.Store();
    const text = new textBlock.TextBlock();
    stencil.load([ ps, s, a ], 'entities');
    stencil.load([ boxBoundary, curveBoundary ], 'trust_boundaries');
    stencil.load([ text ], 'metadata');

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
