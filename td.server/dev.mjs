#!/usr/bin/env node

import { createServer } from './src/index.js';

// Start the server
const app = await createServer();
const port = process.env.SERVER_API_PORT || process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Threat Dragon server listening on port ${port}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

export default server;