import { Addon, Shape } from '@antv/x6';
import { TrustBoundary } from './shapes/trust-boundary';

const getDefaults = (target) => ({
    title: 'Diagraming Tools',
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
        if (cell.label && typeof cell.label !== "undefined") {
            if (
                cell.label.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
            ) {
                return true;
            }
        }
        return cell.shape.indexOf(keyword.toLowerCase()) !== -1;
    },
    placeholder: "Search for components",
    notFoundText: "We don't have that yet, want to open an issue? :)",
});

const get = (target, container) => {
    const stencil = new Addon.Stencil(getDefaults(target));

    // TODO: Placeholders
    const ropts = {
        width: 70,
        height: 40,
    };

    const copts = {
        width: 50,
        height: 50,
    };
    const r1 = new Shape.Rect(ropts);
    const c1 = new Shape.Circle(copts);
    const r2 = new Shape.Rect(ropts);
    const c2 = new Shape.Circle(copts);
    const r3 = new Shape.Rect(ropts);
    const c3 = new Shape.Circle(copts);

    const trustBoundary = new TrustBoundary({
        width: 160,
        height: 75
    });
    stencil.load([trustBoundary, c1, r1, c2, r2, c3, r3]);

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
