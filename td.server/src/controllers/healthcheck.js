const healthz = (req, res) => {
    logger.debug('API healthz request:', req);
    return res.send(true);
};

export default {
    healthz
};
