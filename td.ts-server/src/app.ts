import { Server } from './server';

const run = async () => {
    const server = new Server();
    await server.start();
};

export default {
    run
};
