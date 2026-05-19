const generateItems = (names, total) => {
    const items = [];
    for (let idx = 0; idx < total; idx++) {
        const name = names[idx % names.length];
        const suffix = Math.floor(idx / names.length);
        items.push(suffix > 0 ? `${name}-${suffix}` : name);
    }
    return items;
};

module.exports = { generateItems };
