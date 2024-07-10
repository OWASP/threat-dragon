/**
 * @name logger.js
 * @description Default logging implementation
 * logging level either provided by dotenv LOG_LEVEL or defaults to 'info'
 */
import winston, { format } from 'winston';

/**
 * The available log levels
 * @type {object}
 */
const logLevels = {
    audit: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    silly: 5
};

// declare the various destinations for the logging messages
const transports = {
    app: new winston.transports.File({
        filename: 'app.log',
        level: 'info',
        silent: process.env.NODE_ENV === 'test'
    }),
    audit: new winston.transports.File({
        filename: 'audit.log',
        level: 'audit',
        silent: process.env.NODE_ENV === 'test'
    }),
    console: new winston.transports.Console({
        format: format.combine(format.colorize(), format.simple()),
        level: 'info',
        silent: process.env.NODE_ENV === 'test'
    })
};

const _logger = winston.createLogger({
    levels: logLevels,
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'threat-dragon' },
    transports: [
        transports.audit,
        transports.app,
        transports.console
    ],
    silent: process.env.NODE_ENV === 'test'
});

class Logger {
    constructor (service, logger) {
        this.service = service;
        this.logger = logger || _logger;
    }

    _formatMessage (service, message, level) {
        if (typeof message === 'string') {
            return `${service}: ${message}`;
        }
        this.logger.log(level, `${service}: `);
        this.logger.log(level, message);
    }

    transformToString (complexObject) {
        const cache = [];
        const resultString = JSON.stringify(complexObject, function(key, value) {
          if (typeof value === "object" && value !== null) {
            if (cache.indexOf(value) !== -1) {
              // Circular reference found
              return "[Circular]";
            }
            cache.push(value);
          }
          return value;
        });
        return resultString;
    }

    log (level, message) { this.logger.log(level, this._formatMessage(this.service, message)); }

    silly (message) { this.logger.silly(this._formatMessage(this.service, message, 'silly')); }

    debug (message) { this.logger.debug(this._formatMessage(this.service, message, 'debug')); }

    info (message) { this.logger.info(this._formatMessage(this.service, message, 'info')); }

    warn (message) { this.logger.warn(this._formatMessage(this.service, message, 'warn')); }

    error (message) { this.logger.error(this._formatMessage(this.service, message, 'error')); }

    audit (message) { this.logger.error(this._formatMessage(this.service, message, 'audit')); }
}

/**
 * Gets a new instance of a logger for a given service
 * @param {string} service
 * @param {Logger} logger
 * @returns {Logger}
 */
const get = (service, logger) => new Logger(service, logger);

const level = (logLevel) => { transports.console.level = logLevel; transports.app.level = logLevel; };

export default {
    level,
    get,
    Logger
};
