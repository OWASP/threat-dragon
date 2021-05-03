import AzureTablesConnect from 'connect-azuretables';

const config = (session, logger) => AzureTablesConnect(session).create({ errorLogger: logger.error.bind(logger) });

export default {
    config
};
