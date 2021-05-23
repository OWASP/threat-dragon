import actor from './shapes/actor.js';
import factory from './factory.js';
import processShape from './shapes/process.js';
import store from './shapes/store.js';
import trustBoundary from './shapes/trust-boundary.js';

const getDefaults = (target) => ({
    title: 'Entities',
    target,
    stencilGraphWidth: 500,
    // We can add groups in the future.  For now, there is no need
    // stencil.load([r1, c1, c2, r2.clone()], "test1"); // for adding shapes to the group
    // groups: [
    //     {
    //         name: "test1",
    //         title: "Test 1",
    //         collapsed: true,
    //         collapsable: true,
    //         graphHeight: "250",
    //     },
    //     {
    //         name: "test2",
    //         title: "Test 2",
    //         collapsed: false,
    //         collapsable: true,
    //     },
    // ],
    layoutOptions: {
        columns: 1,
        center: true,
        resizeToFit: true
    },
    search: (cell, keyword) => {
        if (cell.label && typeof cell.label !== 'undefined') {
            if (
                cell.label.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
            ) {
                return true;
            }
        }
        return cell.shape.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
    },
    placeholder: 'Search',
    notFoundText: "We don't have that yet, want to open an issue? :)",
});

const get = (target, container) => {
    const stencil = factory.stencil(getDefaults(target));
    const tb = new trustBoundary.TrustBoundary({
        width: 160,
        height: 75
    });
    const ps = new processShape.ProcessShape({
        width: 100,
        height: 100
    });
    const a = new actor.Actor();
    const s = new store.Store();
    stencil.load([ tb, ps, s, a ]);

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
