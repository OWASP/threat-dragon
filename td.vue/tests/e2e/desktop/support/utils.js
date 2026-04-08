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

    fs.rmSync(directoryPath, { recursive: true, force: true });
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
