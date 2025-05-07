/**
 * @name logger.js
 * @description Default logging implementation for Threat Dragon
 *
 * Logging Strategy:
 * - Uses Winston for structured, level-based logging
 * - Logs to multiple destinations: app.log, audit.log, and console
 * - Log level is configurable via LOG_LEVEL environment variable (defaults to 'warn')
 * - Supports 5 log levels: audit (0), error (1), warn (2), info (3), debug (4)
 *
 * Log Level Usage Guidelines:
 * - audit: Security-relevant events (authentication, authorization, data access/modifications)
 * - error: Exceptions that affect functionality (API failures, database errors, etc.)
 * - warn: Unexpected but recoverable conditions (deprecated features, performance issues)
 * - info: General operational information (startup/shutdown, configuration, successful operations)
 * - debug: Detailed tracing information (request details, function entry/exit, variable values)
 *
 * Transport Configuration:
 * - app.log: Captures info, warn, error levels (general application logs)
 * - audit.log: Captures only audit level (security-relevant events)
 * - console: Captures info, warn, error levels (configurable based on environment)
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
    debug: 4
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
        // Use a safer format in production to avoid colorize issues
        format:
            process.env.NODE_ENV === 'production'
                ? format.simple()
                : format.combine(format.colorize(), format.simple()),
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
    transports: [transports.audit, transports.app, transports.console],
    silent: process.env.NODE_ENV === 'test'
});

class Logger {
    constructor(service, logger) {
        this.service = service;
        this.logger = logger || _logger;
    }

    _formatMessage(service, message, _level) {
        // If message is already a string, just prepend the service name
        if (typeof message === 'string') {
            return `${service}: ${message}`;
        }

        // For complex objects, try to safely convert to string
        try {
            // Use our transformToString method to safely handle circular references
            const safeString = this.transformToString(message);
            return `${service}: ${safeString}`;
        } catch (err) {
            // If stringification fails, log a simpler message
            return `${service}: [Complex object that could not be stringified]`;
        }
    }

    transformToString(complexObject) {
        try {
            // Handle primitive types directly
            if (complexObject === null) return 'null';
            if (complexObject === undefined) return 'undefined';
            if (typeof complexObject !== 'object') return String(complexObject);

            // For Error objects, extract useful properties
            if (complexObject instanceof Error) {
                return `Error: ${complexObject.message || 'Unknown error'} ${
                    complexObject.stack ? `\nStack: ${complexObject.stack}` : ''
                }`;
            }

            // For objects, handle circular references
            const cache = [];
            const resultString = JSON.stringify(
                complexObject,
                function (key, value) {
                    // Handle special cases that might cause issues
                    if (value === undefined) return 'undefined';
                    if (typeof value === 'function') return '[Function]';
                    if (typeof value === 'symbol') return value.toString();

                    // Handle circular references
                    if (typeof value === 'object' && value !== null) {
                        if (cache.indexOf(value) !== -1) {
                            return '[Circular]';
                        }
                        cache.push(value);
                    }
                    return value;
                }
                // Remove the indentation parameter to match test expectations
            );

            return resultString || '[Empty object]';
        } catch (err) {
            // If all else fails, return a fallback message
            return `[Object could not be stringified: ${err.message}]`;
        }
    }

    log(level, message) {
        try {
            this.logger.log(level, this._formatMessage(this.service, message));
        } catch (err) {
            // Fallback to a simple string if formatting fails
            this.logger.log(level, `${this.service}: [Logging error: ${err.message}]`);
        }
    }

    /**
     * Logs a message at the debug level
     * @param {string|object} message - The message to log
     * @description Use for detailed tracing information:
     * - Request/response details
     * - Function entry/exit points
     * - Variable values during execution
     * - Low-level operations
     */
    debug(message) {
        try {
            this.logger.debug(this._formatMessage(this.service, message, 'debug'));
        } catch (err) {
            // Fallback to a simple string if formatting fails
            this.logger.debug(`${this.service}: [Logging error: ${err.message}]`);
        }
    }

    /**
     * Logs a message at the info level
     * @param {string|object} message - The message to log
     * @description Use for general operational information:
     * - Application startup/shutdown
     * - Configuration settings (non-sensitive)
     * - Successful operations completion
     * - User actions (non-sensitive)
     * - Service status changes
     */
    info(message) {
        try {
            this.logger.info(this._formatMessage(this.service, message, 'info'));
        } catch (err) {
            // Fallback to a simple string if formatting fails
            this.logger.info(`${this.service}: [Logging error: ${err.message}]`);
        }
    }

    /**
     * Logs a message at the warn level
     * @param {string|object} message - The message to log
     * @description Use for potential issues that don't prevent operation:
     * - Deprecated feature usage
     * - Unexpected but recoverable conditions
     * - Performance issues
     * - Potential security concerns
     * - Configuration inconsistencies
     */
    warn(message) {
        try {
            this.logger.warn(this._formatMessage(this.service, message, 'warn'));
        } catch (err) {
            // Fallback to a simple string if formatting fails
            this.logger.warn(`${this.service}: [Logging error: ${err.message}]`);
        }
    }

    /**
     * Logs a message at the error level
     * @param {string|object} message - The message to log
     * @description Use for exceptions that affect functionality:
     * - Exceptions that affect functionality
     * - API call failures
     * - Database errors
     * - Authentication/authorization failures
     * - Data validation errors
     */
    error(message) {
        try {
            this.logger.error(this._formatMessage(this.service, message, 'error'));
        } catch (err) {
            // Fallback to a simple string if formatting fails
            this.logger.error(`${this.service}: [Logging error: ${err.message}]`);
        }
    }

    /**
     * Logs a message at the audit level
     * @param {string|object} message - The message to log
     * @description Audit logs are for security-relevant events like authentication,
     * authorization, data access, and data modifications
     */
    audit(message) {
        try {
            this.logger.log('audit', this._formatMessage(this.service, message, 'audit'));
        } catch (err) {
            // Fallback to a simple string if formatting fails
            this.logger.log('audit', `${this.service}: [Logging error: ${err.message}]`);
        }
    }
}

/**
 * Gets a new instance of a logger for a given service
 * @param {string} service
 * @param {Logger} logger
 * @returns {Logger}
 */
const get = (service, logger) => new Logger(service, logger);

/**
 * Sets the log level for the transports
 * @param {string} logLevel - The log level to set
 * @description Sets the log level for console and app transports.
 * The audit transport always remains at 'audit' level regardless of this setting.
 */
const level = (logLevel) => {
    transports.console.level = logLevel;
    transports.app.level = logLevel;
    // Note: We don't change audit.log level - it should always be 'audit'

    // Update the default level on the logger itself
    _logger.level = logLevel;
};

export default {
    level,
    get,
    Logger
};
