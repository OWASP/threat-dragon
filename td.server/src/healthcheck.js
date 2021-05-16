console.log('LEO LEO LEO LEO');
console.log('HEALTHCHECK STARTING!');

const http = require('http');

console.log('after require');

http.get('http://localhost:3000/healthz', (res) => {
    console.log('callback');
    const { statusCode } = res;
    
    console.log(`status: ${statusCode}`);
    if (statusCode !== 200) {
        console.error(`Healthcheck failure: invalid status code: ${statusCode}`);
        process.exit(1);
    }

    console.log('Exiting 0?');
    process.exit(0);
}).on('error', (e) => {
    console.error(`Healthcheck failure: ${e.message}`);
    process.exit(1);
});
