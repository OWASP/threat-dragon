import { Shape } from '@antv/x6';

const name = 'text';

/**
 * A graphical representation of a process (circle, white background)
 * https://x6.antv.vision/en/docs/tutorial/intermediate/custom-node
 * Attrs can use standard SVG attributes (in camelCase)
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */
export const TextBlock = Shape.Rect.define({
    height: 80,
    width: 150,
    constructorName: name,
    zIndex: 0,
    label: 'Arbitrary Text',
    attrs: {
        body: {
            magnet: true,
            fillOpacity: 0,
            strokeOpacity: 0
        }
    }
});

// const updateStyle = (cell, color, dash) => {
//     cell.setAttrByPath('body/stroke', color);
//     cell.setAttrByPath('body/strokeDasharray', dash);
// };

export default {
    name,
    TextBlock
    // updateStyle
};
