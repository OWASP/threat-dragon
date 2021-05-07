import bunyan from 'bunyan';
import expressBunyanLogger from 'express-bunyan-logger';

const excludes = [
    "req-headers",
    "res-headers",
    "res",
    "req",
    "short-body",
    "body",
    "response-hrtime",
    "incoming",
    "user-agent",
    "response-time",
    "http-version"
];

const bunyanOptions = {name: 'threatdragon', level: 'info', excludes: excludes};

const configLoggers = (app) => {   
    app.use(expressBunyanLogger(bunyanOptions));
};

export const logger = bunyan.createLogger(bunyanOptions);

export default {
    configLoggers,
    logger
};
