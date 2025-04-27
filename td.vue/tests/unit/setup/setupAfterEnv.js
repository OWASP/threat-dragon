// This file runs after the testing framework has been installed in the environment
// but before the test code itself runs

// Suppress specific Vue component resolution warnings
const originalWarn = console.warn;
console.warn = function(msg, ...args) {
    // Filter out component resolution warnings we've already handled with our mocks
    if (msg && (
        msg.includes('Failed to resolve component') ||
        msg.includes('Unknown custom element') ||
        msg.includes('make sure to exclude it from component resolution') ||
        msg.includes('Component has already been registered') ||
        (msg.includes('[Vue warn]') && msg.includes('has already been registered')) ||
        (msg.includes('[Vue warn]') && msg.includes('A plugin must either be a function')) || // Filter out plugin warnings
        msg === 'Error retrying after refresh token update' || // Filter out httpClient test warning
        msg.includes('Toast not available') || // Filter out toast warnings
        msg.includes('Translation error') || // Filter out translation warnings
        msg.includes('Failed to validate') || // Filter schema validation warnings
        msg.includes('Router using web history') // Filter router mode messages
    )) {
        return;
    }
    return originalWarn.call(console, msg, ...args);
};

// Suppress debug messages during tests
const _originalDebug = console.debug;
console.debug = function(_msg, ..._args) {
    // Suppress all debug messages in tests
    return;
};

// Suppress specific errors that might occur during testing
const originalError = console.error;
console.error = function(msg, ...args) {
    // Filter out specific error messages that are expected or handled
    if (msg && 
     (typeof msg === 'string' && (
         msg.includes('Vue warn') && 
         (msg.includes('Failed to resolve component') || 
          msg.includes('has already been registered')
         )
     )) ||
     // Filter out http client test errors
     (msg === 'Request error:' && args[0] && 
       (args[0].message === 'Request failed' || 
        args[0].response && (args[0].response.status === 401 || args[0].response.status === 500))
     ) ||
     // Filter out Vuex unknown action errors
     (typeof msg === 'string' && msg.includes('[vuex] unknown action type:')) ||
     // Filter out SyntaxError for invalid JSON tests
     (msg.toString().includes('SyntaxError') && msg.toString().includes('is not valid JSON')) ||
     (args[0] instanceof SyntaxError && args[0].message.includes('is not valid JSON'))
    ) {
        return;
    }
    return originalError.call(console, msg, ...args);
};