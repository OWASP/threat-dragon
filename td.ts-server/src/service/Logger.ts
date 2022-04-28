/**
 * @name logger.js
 * @description Default logging implementation
 */
import winston, { format, transports } from 'winston';

import { getEnv } from '../env/Env';

const logLevels: winston.config.AbstractConfigSetLevels = {
    audit: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    silly: 5
};

const _logger = winston.createLogger({
    levels: logLevels,
    level: getEnv().config.LOG_LEVEL || 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'threat-drgaon' },
    transports: [
        new transports.File({
            filename: 'audit.log',
            level: 'audit',
            silent: process.env.NODE_ENV === 'test'
        }),
        new transports.File({
            filename: 'app.log',
            level: getEnv().config.LOG_LEVEL || 'info',
            silent: process.env.NODE_ENV === 'test'
        }),
        new transports.Console({
            format: format.combine(format.colorize(), format.simple()),
            level: getEnv().config.LOG_LEVEL || 'info',
            silent: process.env.NODE_ENV === 'test'
        })
    ],
    silent: process.env.NODE_ENV === 'test'
});

export class Logger {
    private readonly service: string;
    private readonly logger: winston.Logger;

    constructor(service: string) {
        this.service = service;
        this.logger = _logger;
    }

    _formatMessage(service: string, message: string | object): string | object {
        if (typeof message === 'string') {
            return `${service}: ${message}`;
        }
        try {
            JSON.stringify(message);
        } catch (ignore) {
            console.error(message);
            return '{unknown}';
        }
    }

    log(level: string, message: string | object) { this.logger.log(level, this._formatMessage(this.service, message)); }

    silly(message: string | object) { this.logger.silly(this._formatMessage(this.service, message)); }

    debug(message: string | object) { this.logger.debug(this._formatMessage(this.service, message)); }

    info(message: string | object) { this.logger.info(this._formatMessage(this.service, message)); }

    warn(message: string | object) { this.logger.warn(this._formatMessage(this.service, message)); }

    error(message: string | object) { this.logger.error(this._formatMessage(this.service, message)); }

    audit(message: string | object) { this.logger.error(this._formatMessage(this.service, message)); }
}
