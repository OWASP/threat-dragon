import { Shape } from '@antv/x6';

const name = 'process';

/**
 * A graphical representation of a process (circle, white background)
 * https://x6.antv.vision/en/docs/tutorial/intermediate/custom-node
 * Attrs can use standard SVG attributes (in camelCase)
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */
export const ProcessShape = Shape.Circle.define({
    height: 200,
    width: 200,
    constructorName: name,
    zIndex: 0,
    label: 'Process',
    attrs: {
        body: {
            magnet: true
        }
    }
});

const updateStyle = (cell, color, dash) => {
    cell.setAttrByPath('body/stroke', color);
    cell.setAttrByPath('body/strokeDasharray', dash);
};

export default {
    name,
    ProcessShape,
    updateStyle
};
