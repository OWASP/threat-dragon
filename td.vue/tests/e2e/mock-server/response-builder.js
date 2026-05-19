const buildPagedResponse = (allItems, page, perPage) => {
    const totalPages = Math.ceil(allItems.length / perPage);
    const startIdx = (page - 1) * perPage;
    return {
        items: allItems.slice(startIdx, startIdx + perPage),
        pagination: { page, next: page < totalPages, prev: page > 1 },
    };
};

module.exports = { buildPagedResponse };
