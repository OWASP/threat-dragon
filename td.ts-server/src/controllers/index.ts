
import { Express } from 'express';

import { Logger } from '../service/Logger';
import { registerControllers } from '../decorators';

// Controllers
import { HealthcheckController } from './Healthcheck';

export const initializeRoutes = (app: Express) => {
    const logger = new Logger('controllers/index.ts');
    const controllers: any[] = [
        // Add controllers here
        HealthcheckController
    ];

    registerControllers(app, logger, controllers);
};