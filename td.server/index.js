// Use dynamic import for ESM compatibility
const importAppFactory = async () => {
    try {
        const appFactory = await import('./dist/app.js');
        return appFactory.default;
    } catch (err) {
        console.error('Failed to import app factory:', err);
        process.exit(1);
    }
};

// Self-executing async function to run the server
(async () => {
    const appFactory = await importAppFactory();
    const app = appFactory.create();

    const server = app.listen(app.get('port'), function () {
        const address = server.address();
        if (address) {
            console.log(
                'Express server listening at ' + address.address + ' on port ' + address.port
            );
        } else {
            console.log('Express server listening on port ' + app.get('port'));
        }
    });
})();
