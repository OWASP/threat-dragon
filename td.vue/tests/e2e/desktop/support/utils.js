const fs = require('fs');
const os = require('os');
const { join } = require('path');

const DEFAULT_POLL_INTERVAL_MS = 100;

const waitFor = async (predicate, timeoutMs, errorMessage, pollIntervalMs = DEFAULT_POLL_INTERVAL_MS) => {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
        const value = await predicate();

        if (value) {
            return value;
        }

        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }

    throw new Error(errorMessage);
};

const createTempDirectory = (prefix) => {
    return fs.mkdtempSync(join(os.tmpdir(), prefix));
};

const removeDirectory = (directoryPath) => {
    if (!directoryPath) {
        return;
    }

    try {
        fs.rmSync(directoryPath, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    } catch (error) {
        console.warn(`Could not remove temporary directory ${directoryPath}: ${error.message}`);
    }
};

const withTempDirectory = async (prefix, callback) => {
    const directoryPath = createTempDirectory(prefix);

    try {
        return await callback(directoryPath);
    } finally {
        removeDirectory(directoryPath);
    }
};

module.exports = {
    waitFor,
    createTempDirectory,
    removeDirectory,
    withTempDirectory
};
