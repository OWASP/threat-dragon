'use strict';

// Extend the $exceptionHandler service to also display a toast.
function extendExceptionHandler($delegate, config, logger) {
    var appErrorPrefix = config.appErrorPrefix;
    var logError = logger.getLogFn('app', 'error');
    return function (exception, cause) {
        $delegate(exception, cause);
        if (appErrorPrefix && exception.message.indexOf(appErrorPrefix) === 0) { return; }

        var errorData = { exception: exception, cause: cause };
        var msg = appErrorPrefix + exception.message;
        logError(msg, errorData, true);
    };
}

module.exports = extendExceptionHandler;