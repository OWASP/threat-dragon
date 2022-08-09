// health-check endpoint for applications

const healthz = (req, res) => {
    const data = {
        uptime: process.uptime(),
        message: 'OK',
        date: new Date()
    };

    return res.status(200).send(data);
};

export default {
    healthz
};
