const getText = (cell, label) => {
    let text = label.attrs.text.text;
    if (cell.protocol) {
        text = `${text} (${cell.protocol})`;
    }
    return text;
};

export default {
    getText
};
