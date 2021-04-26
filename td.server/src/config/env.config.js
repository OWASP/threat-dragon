var fs = require('fs');
var path = require('path');

var dotenv = require('dotenv');

/**
 * Attempts to load configuration as environment variables
 * from the .env file at the root of the project.
 * If the file does not exist, no-op
 */
function tryLoadDotEnv () {
    var upDir = '..' + path.sep;
    var dotEnvPath = path.join(__dirname, upDir, upDir, '.env');
    if (fs.existsSync(dotEnvPath)) {
        dotenv.config();
    }
}

var envConfig = {
    tryLoadDotEnv: tryLoadDotEnv
};

module.exports = envConfig;

