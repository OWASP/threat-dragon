import {
    createPlausiblePayload,
    hasValidProperties,
    isAnalyticsEvent
} from '../helpers/plausible.helper.js';
import env from '../env/Env.js';
import loggerHelper from '../helpers/logger.helper.js';
import { sendEvent } from '../helpers/plausibleClient.helper.js';

const logger = loggerHelper.get('controllers/analyticscontroller.js');

export const createAnalyticsController = (deps = {}) => {
    const envDep = deps.envDep || env;
    const sendEventDep = deps.sendEventDep || sendEvent;
    const loggerDep = deps.loggerDep || logger;

    return {
        track: async (req, res) => {
            const config = envDep.get().config;
            if (!config.PLAUSIBLE_ENABLED) {
                return res.status(204).send();
            }

            const { event, props } = req.body || {};
            if (!isAnalyticsEvent(event) || !hasValidProperties(event, props)) {
                return res.status(400).send();
            }

            try {
                const payload = createPlausiblePayload(config, event, props);
                await sendEventDep(config, payload, {
                    ip: req.ip,
                    userAgent: req.get('user-agent')
                });
            } catch {
                loggerDep.warn('Plausible event forwarding failed.');
            }

            res.status(204).send();
        }
    };
};

export default createAnalyticsController();
