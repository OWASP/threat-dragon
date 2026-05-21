import { buildConfig } from '../helpers/config.helper.js';
import env from '../env/Env';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { ERROR_MESSAGES } from '../constants/errorMessages.js';
import { isNullish } from '../helpers/validators.helper.js';
import loggerHelper from '../helpers/logger.helper.js';
import responseWrapper from './responseWrapper';

const logger = loggerHelper.get('controllers/configcontroller.js');

export const getConfig = (deps) => {
    const resolvedDeps = deps || {};

    const envDep = resolvedDeps.envDep || env;
    const buildConfigDep = resolvedDeps.buildConfigDep || buildConfig;
    const loggerDep = resolvedDeps.loggerDep || logger;
    const envResult = envDep.get();
    const config = envResult.config;
    const buildResult = buildConfigDep(config);
    const value = buildResult.value;
    const errors = Array.isArray(buildResult.errors)
        ? buildResult.errors
        : [];

    for (const error of errors) {
        const hasValidCode =
            error &&
            typeof error.code === 'string';

        if (hasValidCode) {
            const message = ERROR_MESSAGES[error.code]
                ? ERROR_MESSAGES[error.code]
                : error.code;

            loggerDep.warn(message, error.meta);
        } else {
            loggerDep.warn(
                ERROR_CODES.CONFIG_INVALID_ENTRY,
                { error: error }
            );
        }
    }

    return value;
};

export const createConfigLoader = (deps) => {
    const resolvedDeps = deps || {};

    const getConfigDep = resolvedDeps.getConfigDep || getConfig;

    let cachedConfig;

    return () => {
        if (isNullish(cachedConfig)) {
            cachedConfig = getConfigDep();
        }

        return cachedConfig;
    };
};

export const createConfigController = (deps = {}) => {
    const loadConfig = createConfigLoader(deps);

    return {
        config: (req, res) => responseWrapper.sendResponse(loadConfig, req, res, deps.loggerDep || logger)
    };
};

const configController = createConfigController();

export default configController;
