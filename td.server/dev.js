import appFactory from './src/app.js';
import loggerHelper from '../helpers/logger.helper.js';

const logger = loggerHelper.get('dev.js');

const app = appFactory.create();
const tdServerPort = process.env.SERVER_API_PORT || process.env.PORT || 3000;

const server = app.listen(tdServerPort, function () {
    const address = server.address();
    if (address) {
        logger.info(
            'Express API server listening at ' + address.address + ' on port ' + address.port
        );
    } else {
        logger.info('Express API server listening on port ' + tdServerPort);
    }
});

process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
});
