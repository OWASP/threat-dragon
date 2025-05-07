/**
 * @name error.js
 * @description Centralized error handling utilities for Threat Dragon
 * Provides standardized error handling patterns and error categorization
 */
import logger from './logger.js';

// Create a specific logger for errors
const errorLogger = logger.getLogger('errors');

/**
 * Error categories
 */
export const ERROR_CATEGORIES = {
    // System errors
    APP_INITIALIZATION: 'app_initialization',
    COMPONENT_RENDER: 'component_render',
    STORE_ACTION: 'store_action',
    ROUTER: 'router',

    // API errors
    API_CLIENT: 'api_client', // Client-side errors (network, etc)
    API_SERVER: 'api_server', // Server-side errors (500, etc)
    API_AUTH: 'api_auth', // Authentication errors (401, 403)
    API_VALIDATION: 'api_validation', // Validation errors (400)

    // Data errors
    DATA_PARSE: 'data_parse', // Error parsing data
    DATA_VALIDATION: 'data_validation', // Data validation errors
    FILE_SYSTEM: 'file_system', // File system errors

    // User errors
    USER_INPUT: 'user_input', // User input errors

    // Uncategorized
    UNKNOWN: 'unknown' // Default category
};

/**
 * Standard error class with additional context information
 */
export class AppError extends Error {
    constructor(message, options = {}) {
        super(message);
        this.name = options.name || 'AppError';
        this.category = options.category || ERROR_CATEGORIES.UNKNOWN;
        this.originalError = options.originalError || null;
        this.metadata = options.metadata || {};
        this.userMessage = options.userMessage || message;
        this.errorCode = options.errorCode || null;
        this.timestamp = new Date().toISOString();
        this.isOperational = options.isOperational !== undefined ? options.isOperational : true;
    }
}

/**
 * API error class for handling HTTP request errors
 */
export class ApiError extends AppError {
    constructor(message, options = {}) {
        const category = options.category || ERROR_CATEGORIES.API_CLIENT;
        super(message, {
            ...options,
            name: 'ApiError',
            category
        });

        this.status = options.status || 500;
        this.response = options.response || null;
        this.request = options.request || null;
    }
}

/**
 * Configuration error class for system configuration issues
 */
export class ConfigError extends AppError {
    constructor(message, options = {}) {
        super(message, {
            ...options,
            name: 'ConfigError',
            category: ERROR_CATEGORIES.APP_INITIALIZATION
        });
    }
}

/**
 * Data validation error class for input validation issues
 */
export class ValidationError extends AppError {
    constructor(message, options = {}) {
        super(message, {
            ...options,
            name: 'ValidationError',
            category: ERROR_CATEGORIES.DATA_VALIDATION
        });

        this.validationErrors = options.validationErrors || [];
    }
}

/**
 * Wrap any function with try/catch error handling
 * @param {Function} fn - Function to wrap
 * @param {Object} options - Error handling options
 * @returns {Function} - Wrapped function
 */
export const withErrorHandling = (fn, options = {}) => {
    // Default error handler logs the error
    const defaultErrorHandler = (error) => {
        errorLogger.error(error, {
            functionName: fn.name || 'anonymous',
            ...options
        });
        return null;
    };

    const errorHandler = options.errorHandler || defaultErrorHandler;

    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            return errorHandler(error, ...args);
        }
    };
};

/**
 * Result object for standardizing function return values
 * Use this to handle success/error states consistently
 */
export class Result {
    constructor(success, data = null, error = null) {
        this.success = success;
        this.data = data;
        this.error = error;
        this.timestamp = new Date().toISOString();
    }

    /**
     * Creates a success result
     * @param {any} data - Result data
     * @returns {Result} - Success result
     */
    static success(data = null) {
        return new Result(true, data, null);
    }

    /**
     * Creates an error result
     * @param {Error} error - Error object
     * @param {any} data - Optional partial data
     * @returns {Result} - Error result
     */
    static failure(error, data = null) {
        return new Result(false, data, error);
    }

    /**
     * Checks if the result is successful
     * @returns {boolean} - Whether the result is successful
     */
    isSuccess() {
        return this.success;
    }

    /**
     * Checks if the result is an error
     * @returns {boolean} - Whether the result is an error
     */
    isError() {
        return !this.success;
    }
}

/**
 * Standardized error message map by error category
 * Used to provide user-friendly error messages
 */
export const DEFAULT_ERROR_MESSAGES = {
    [ERROR_CATEGORIES.APP_INITIALIZATION]:
        'Application failed to initialize properly. Please refresh the page.',
    [ERROR_CATEGORIES.COMPONENT_RENDER]:
        'Failed to display this component. Please refresh the page.',
    [ERROR_CATEGORIES.STORE_ACTION]:
        'The application encountered an error while processing your request.',
    [ERROR_CATEGORIES.ROUTER]: 'Failed to navigate to the requested page.',

    [ERROR_CATEGORIES.API_CLIENT]:
        'Could not connect to the server. Please check your internet connection.',
    [ERROR_CATEGORIES.API_SERVER]: 'The server encountered an error. Please try again later.',
    [ERROR_CATEGORIES.API_AUTH]:
        'Your session has expired or you do not have permission to perform this action.',
    [ERROR_CATEGORIES.API_VALIDATION]:
        'The request contains invalid data. Please check your inputs.',

    [ERROR_CATEGORIES.DATA_PARSE]:
        'Failed to process the data. The file may be corrupted or in an unsupported format.',
    [ERROR_CATEGORIES.DATA_VALIDATION]: 'The provided data is invalid. Please check your inputs.',
    [ERROR_CATEGORIES.FILE_SYSTEM]:
        'Failed to access the file system. Please check your permissions.',

    [ERROR_CATEGORIES.USER_INPUT]: 'Please check your input and try again.',
    [ERROR_CATEGORIES.UNKNOWN]:
        'An unexpected error occurred. Please try again or refresh the page.'
};

/**
 * Gets a user-friendly message for an error
 * @param {Error} error - The error
 * @returns {string} - User-friendly error message
 */
export const getUserFriendlyErrorMessage = (error) => {
    // If it's our AppError with a userMessage, use that
    if (error instanceof AppError && error.userMessage) {
        return error.userMessage;
    }

    // If it has a specific category, use the default message for that category
    if (error instanceof AppError && error.category) {
        return (
            DEFAULT_ERROR_MESSAGES[error.category] ||
            DEFAULT_ERROR_MESSAGES[ERROR_CATEGORIES.UNKNOWN]
        );
    }

    // Default unknown error message
    return DEFAULT_ERROR_MESSAGES[ERROR_CATEGORIES.UNKNOWN];
};

/**
 * Creates an appropriate AppError from any error type
 * @param {Error} error - Original error
 * @param {Object} options - Options for the new error
 * @returns {AppError} - Standardized error
 */
export const createAppError = (error, options = {}) => {
    // If it's already an AppError, just add any missing options
    if (error instanceof AppError) {
        // Allow overriding properties
        if (Object.keys(options).length > 0) {
            error = new AppError(error.message, {
                ...error,
                ...options,
                // Preserve the original error
                originalError: error.originalError || error
            });
        }
        return error;
    }

    // Otherwise, wrap it in an AppError
    return new AppError(options.message || error.message || 'An error occurred', {
        ...options,
        originalError: error
    });
};

/**
 * Global error handler for unexpected errors
 * @param {Error} error - The error that occurred
 * @param {Object} metadata - Additional context about the error
 */
export const handleGlobalError = (error, metadata = {}) => {
    const appError = createAppError(error, {
        category: ERROR_CATEGORIES.UNKNOWN,
        metadata
    });

    errorLogger.error(appError, {
        ...metadata,
        stack: appError.stack
    });

    // Return the standardized error
    return appError;
};

export default {
    handleGlobalError,
    createAppError,
    withErrorHandling,
    getUserFriendlyErrorMessage,
    Result,
    ERROR_CATEGORIES,
    AppError,
    ApiError,
    ValidationError,
    ConfigError
};
