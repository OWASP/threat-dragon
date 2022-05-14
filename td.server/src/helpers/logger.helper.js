/**
 * @name logger.js
 * @description Default logging implementation
 */
import winston, { format, transports } from 'winston';

import env from '../env/Env.js';

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

const _logger = winston.createLogger({
    levels: logLevels,
    level: env.get().config.LOG_LEVEL || 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'threat-dragon' },
    transports: [
        new transports.File({
            filename: 'audit.log',
            level: 'audit',
            silent: process.env.NODE_ENV === 'test'
        }),
        new transports.File({
            filename: 'app.log',
            level: env.get().config.LOG_LEVEL || 'info',
            silent: process.env.NODE_ENV === 'test'
        }),
        new transports.Console({
            format: format.combine(format.colorize(), format.simple()),
            level: env.get().config.LOG_LEVEL || 'info',
            silent: process.env.NODE_ENV === 'test'
        })
    ],
    silent: process.env.NODE_ENV === 'test'
});

class Logger {
    constructor(service, logger) {
        this.service = service;
        this.logger = logger || _logger;
    }

    _formatMessage(service, message, level) {
        if (typeof message === 'string') {
            return `${service}: ${message}`;
        }
        this.logger.log(level, `${service}: `);
        this.logger.log(level, message);
    }

    log(level, message) { this.logger.log(level, this._formatMessage(this.service, message)); }

    silly(message) { this.logger.silly(this._formatMessage(this.service, message, 'silly')); }

    debug(message) { this.logger.debug(this._formatMessage(this.service, message, 'debug')); }

    info(message) { this.logger.info(this._formatMessage(this.service, message, 'info')); }

    warn(message) { this.logger.warn(this._formatMessage(this.service, message, 'warn')); }

    error(message) { this.logger.error(this._formatMessage(this.service, message, 'error')); }

    audit(message) { this.logger.error(this._formatMessage(this.service, message, 'audit')); }
}

/**
 * Gets a new instance of a logger for a given service
 * @param {string} service
 * @param {Logger} logger
 * @returns {Logger}
 */
const get = (service, logger) => new Logger(service, logger);

export default {
    get,
    Logger
};
