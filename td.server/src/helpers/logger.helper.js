/**
 * @name logger
 * @description Custom logger
 */
import { addColors, createLogger, format, transports } from 'winston';
import env from '../env/Env.js';

const { combine, colorize, timestamp, label, printf, errors } = format;



// TODO: This is creating a new app.log for each file that needs a logger... not good.

/**
 * The levels available to our logger
 * @type {object}
 */
const levels = {
    audit: 0,
    fatal: 1,
    error: 2,
    warn: 3,
    info: 4,
    debug: 5,
    silly: 6
};

/**
 * Colors for the logging levels.
 * This is really only to help during development.
 * @type {object}
 */
const colors = {
    fatal: 'bold underline red',
    error: 'red',
    warn: 'yellow',
    audit: 'bold cyan',
    info: 'blue',
    debug: 'green',
    silly: 'magenta'
};

/**
 * The logging format that we will be using for all loggers
 * @param {object} info
 * @returns {string}
 */
const defaultFormat = printf((info) => {
    const { label, level, stack, timestamp } = info;
    let { code, message } = info;
    code = code ? `${code} ` : '';
    message = stack || message;

    // Attempt to log objects as well
    if (typeof message !== 'string') {
        try {
            message = JSON.stringify(message);
        } catch (ignore) {
            message = '[Object object]';
        }
    }

    return `${timestamp} [${label}] ${level}: ${code}${message}`;
});

const getFileFormats = (fileName) => combine(
    timestamp(),
    label({ label: fileName }),
    defaultFormat
);

/**
 * The file transport for recording audit events
 * @param {string} fileName
 * @type {transports.File}
 */
const auditLogTransport = (fileName) => new transports.File({
    filename: 'audit.log',
    level: 'audit',
    format: getFileFormats(fileName),
    silent: env.get().config.NODE_ENV === 'test',
    maxsize: env.get().config.LOG_MAX_FILE_SIZE || 24
});

/**
 * The file transport for logging of all the things
 * @param {string} fileName
 * @type {transports.File}
 */
const appLogTransport = (fileName) => new transports.File({
    filename: 'app.log',
    level: env.get().config.LOG_LEVEL || 'info',
    format: getFileFormats(fileName),
    silent: env.get().config.NODE_ENV === 'test',
    maxsize: env.get().config.LOG_MAX_FILE_SIZE || 24
});

/**
 * The console transport for logging of all the things
 * @param {string} fileName
 * @type {transports.Console}
 */
const consoleLogTransport = (fileName) => new transports.Console({
    level: env.get().config.LOG_LEVEL || 'info',
    silent: env.get().config.NODE_ENV === 'test',
    format: combine(
        colorize(),
        timestamp(),
        label({ label: fileName }),
        defaultFormat
    )
});

// Make winston aware of the custom colors we wish to use
addColors(colors);

/**
 * Gets a logger
 * @param {string} fileName
 * @returns {Logger}
 */
const get = (fileName) => createLogger({
        format: errors({ stack: true }),
        level: env.get().config.LOG_LEVEL || 'info',
        levels: levels,
        transports: [
            auditLogTransport(fileName),
            appLogTransport(fileName),
            consoleLogTransport(fileName)
        ]
    });

export default {
    get
};
