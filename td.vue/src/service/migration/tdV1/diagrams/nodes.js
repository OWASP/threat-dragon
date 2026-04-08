const map = (constructor) => (cell) => {
    return new constructor({
        angle: cell.angle,
        width: cell.size.width,
        height: cell.size.height,
        x: cell.position.x,
        y: cell.position.y,
        // This id will be overwritten by x6, but is needed to link
        // process flows to other elements prior to drawing
        id: cell.id,
        zIndex: cell.z,
        label: cell.attrs && cell.attrs.text && cell.attrs.text.text ? cell.attrs.text.text : ''
    });
};

export default {
    map
};
