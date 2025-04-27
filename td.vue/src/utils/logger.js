/**
 * @name logger.js
 * @description Centralized client-side logging service for Threat Dragon
 * Provides structured logging with context, log levels, and debug control
 */

// Log levels matching server-side winston levels for consistency
export const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
};

// Map log level names to their numeric values for comparison
const LOG_LEVEL_VALUES = {
    error: LOG_LEVELS.ERROR,
    warn: LOG_LEVELS.WARN,
    info: LOG_LEVELS.INFO,
    debug: LOG_LEVELS.DEBUG
};

// Default configuration
const DEFAULT_CONFIG = {
    level: 'info', // Default log level
    enabledInProduction: false, // Disable debug in production
    correlationIdKey: 'td-correlation-id', // Key for correlation ID in localStorage
    debugQueryParam: 'td-debug', // URL query param to enable debug mode
    context: 'app' // Default context
};

// Current logger configuration
let loggerConfig = { ...DEFAULT_CONFIG };

/**
 * Checks if the current log level should be displayed
 * @param {string} level - The log level to check
 * @returns {boolean} - Whether the log level should be displayed
 */
const shouldLog = (level) => {
    // In production, don't show debug logs unless explicitly enabled
    if (
        process.env.NODE_ENV === 'production' &&
        !loggerConfig.enabledInProduction &&
        level === 'debug'
    ) {
        return false;
    }

    const configLevelValue = LOG_LEVEL_VALUES[loggerConfig.level] || LOG_LEVELS.INFO;
    const levelValue = LOG_LEVEL_VALUES[level] || LOG_LEVELS.INFO;

    return levelValue <= configLevelValue;
};

/**
 * Gets a correlation ID for tracking related logs
 * Creates one if it doesn't exist
 */
const getCorrelationId = () => {
    try {
        if (typeof localStorage === 'undefined') {
            return 'td-' + Math.random().toString(36).substring(2, 15);
        }

        let correlationId = localStorage.getItem(loggerConfig.correlationIdKey);

        if (!correlationId) {
            correlationId = 'td-' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem(loggerConfig.correlationIdKey, correlationId);
        }

        return correlationId;
    } catch (e) {
        // Fallback in case localStorage access fails
        return 'td-' + Math.random().toString(36).substring(2, 15);
    }
};

/**
 * Checks if debug mode is enabled via URL parameter
 */
const isDebugModeEnabled = () => {
    try {
        if (typeof window === 'undefined' || !window.location) return false;

        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has(loggerConfig.debugQueryParam);
    } catch (e) {
        // Fallback if there's an issue accessing window.location
        return false;
    }
};

/**
 * Prepares a message for logging with context and metadata
 */
const prepareLogMessage = (context, message, metadata = {}) => {
    const timestamp = new Date().toISOString();
    const correlationId = getCorrelationId();

    // Allow message to be an object, string, or error
    let formattedMessage = message;
    let errorStack = null;

    if (message instanceof Error) {
        formattedMessage = message.message;
        errorStack = message.stack;
    }

    return {
        timestamp,
        correlationId,
        context,
        message: formattedMessage,
        ...(errorStack ? { stack: errorStack } : {}),
        ...(Object.keys(metadata).length > 0 ? { metadata } : {})
    };
};

/**
 * Safely stringifies complex objects for logging
 */
const safeStringify = (obj) => {
    try {
        const cache = new Set();
        return JSON.stringify(
            obj,
            (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (cache.has(value)) {
                        return '[Circular Reference]';
                    }
                    cache.add(value);
                }
                return value;
            },
            2
        );
    } catch (err) {
        return `[Object cannot be stringified: ${err.message}]`;
    }
};

/**
 * Performs the actual console logging with appropriate formatting
 */
const doLog = (level, context, message, metadata = {}) => {
    if (!shouldLog(level)) return;

    const logObj = prepareLogMessage(context, message, metadata);

    // Select appropriate console method
    let consoleMethod = 'log';
    switch (level) {
    case 'error':
        consoleMethod = 'error';
        break;
    case 'warn':
        consoleMethod = 'warn';
        break;
    case 'info':
        consoleMethod = 'info';
        break;
    case 'debug':
        consoleMethod = 'debug';
        break;
    }

    // For errors, use a more detailed format
    if (level === 'error' && message instanceof Error) {
        console[consoleMethod](
            `[${logObj.timestamp}][${level.toUpperCase()}][${context}] ${message.message}`,
            message
        );
        return;
    }

    // Format: [timestamp][LEVEL][context] message {metadata if present}
    let logMessage = `[${logObj.timestamp}][${level.toUpperCase()}][${context}] `;

    // Add the message
    if (typeof message === 'string') {
        logMessage += message;
    } else {
        logMessage += safeStringify(message);
    }

    // Only add metadata if it's not empty
    if (Object.keys(metadata).length > 0) {
        console[consoleMethod](logMessage, metadata);
    } else {
        console[consoleMethod](logMessage);
    }

    return logObj;
};

/**
 * Logger class that maintains context across log calls
 */
class Logger {
    constructor(context = DEFAULT_CONFIG.context) {
        this.context = context;
    }

    /**
     * Logs a message at the ERROR level
     */
    error(message, metadata = {}) {
        return doLog('error', this.context, message, metadata);
    }

    /**
     * Logs a message at the WARN level
     */
    warn(message, metadata = {}) {
        return doLog('warn', this.context, message, metadata);
    }

    /**
     * Logs a message at the INFO level
     */
    info(message, metadata = {}) {
        return doLog('info', this.context, message, metadata);
    }

    /**
     * Logs a message at the DEBUG level
     */
    debug(message, metadata = {}) {
        return doLog('debug', this.context, message, metadata);
    }

    /**
     * Creates a child logger with a new context but inheriting the parent configuration
     */
    child(childContext) {
        return new Logger(`${this.context}:${childContext}`);
    }
}

/**
 * Configure the logger settings
 * @param {Object} config - Configuration options
 */
export const configureLogger = (config = {}) => {
    loggerConfig = { ...DEFAULT_CONFIG, ...config };

    // Check if debug mode is enabled via URL parameter
    if (isDebugModeEnabled()) {
        loggerConfig.level = 'debug';
    }

    return loggerConfig;
};

/**
 * Gets a logger instance with the specified context
 */
export const getLogger = (context = DEFAULT_CONFIG.context) => {
    return new Logger(context);
};

// Create a default logger instance
const defaultLogger = new Logger();

// Default exports
export { getCorrelationId };

export default {
    getLogger,
    configureLogger,
    getCorrelationId,
    LOG_LEVELS,
    error: (...args) => defaultLogger.error(...args),
    warn: (...args) => defaultLogger.warn(...args),
    info: (...args) => defaultLogger.info(...args),
    debug: (...args) => defaultLogger.debug(...args)
};
