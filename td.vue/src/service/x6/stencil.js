import { Addon } from '@antv/x6';

import { Actor } from './shapes/actor.js';
import { ProcessShape } from './shapes/process.js';
import { Store } from './shapes/store.js';
import { TrustBoundary } from './shapes/trust-boundary.js';

const getDefaults = (target) => ({
    title: 'Entities',
    target,
    stencilGraphWidth: 400,
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
        resizeToFit: true,
    },
    search: (cell, keyword) => {
        if (cell.label && typeof cell.label !== 'undefined') {
            if (
                cell.label.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
            ) {
                return true;
            }
        }
        return cell.shape.indexOf(keyword.toLowerCase()) !== -1;
    },
    placeholder: 'Search',
    notFoundText: "We don't have that yet, want to open an issue? :)",
});

const get = (target, container) => {
    const stencil = new Addon.Stencil(getDefaults(target));
    const trustBoundary = new TrustBoundary({
        width: 160,
        height: 75
    });
    const processShape = new ProcessShape({
        width: 100,
        height: 100
    });
    const actor = new Actor();
    const store = new Store();
    stencil.load([ trustBoundary, processShape, store, actor ]);

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
