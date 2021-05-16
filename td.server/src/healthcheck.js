/* eslint-disable no-console */
const http = require('http');

http.get('http://localhost:3000/healthz', (res) => {
    const { statusCode } = res;
    
    if (statusCode !== 200) {
        console.error(`Healthcheck failure: invalid status code: ${statusCode}`);
        process.exit(1);
    }

    process.exit(0);
}).on('error', (e) => {
    console.error(`Healthcheck failure: ${e.message}`);
    process.exit(1);
});
