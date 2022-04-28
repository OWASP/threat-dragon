import * as http from 'http';
import express, { Express } from 'express';
import path from 'path';
import rateLimit from 'express-rate-limit';

import { catchAllHandler, notFoundHandler } from './errors/handlers';
import { initializeRoutes } from './controllers';
import { Env, getEnv } from './env/Env';
import { upDir } from './service/FsHelper';
import { headersConfig } from './middleware/headers';
import httpsMiddleware from './middleware/https';
import { Logger } from './service/Logger';
import { GithubEnv } from './env/Github';
import { EncryptionEnv } from './env/Encryption';
import { ThreatDragonEnv } from './env/ThreatDragon';

export class Server {
    private readonly _app: Express;
    get app(): Express {
        return this._app;
    }

    private _server!: http.Server;
    get server(): http.Server {
        return this._server;
    }

    private readonly _logger: Logger;
    private readonly env: Env;

    constructor() {
        this.env = this.configureEnv();

        this._logger = new Logger('server.ts');

        this._app = express();
        this.configureMiddleware();
    }

    private get limiterConfig() {
        // maximum of 100 requests per 15 minutes
        return {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
            standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        };
    }

    private get siteDir(): string {
        return path.join(__dirname, upDir(), upDir(), 'dist');
    }

    private get docsDir(): string {
        return path.join(__dirname, upDir(), upDir(), 'docs');
    }

    private configureEnv(): Env {
        const env = getEnv();
        env.addProvider(new GithubEnv());
        env.addProvider(new EncryptionEnv());
        env.addProvider(new ThreatDragonEnv());
        env.hydrate();
        return env;
    }

    private configureMiddleware() {
        this.app.set('trust proxy', true);

        // Set security headers
        headersConfig(this.app);

        // Force HTTPS if configured
        this.app.use(httpsMiddleware);

        // Static content
        this.app.use('/public', express.static(this.siteDir));
        this.app.use('/docs', express.static(this.docsDir));

        // Parsers
        this._app.use(express.json({ limit: '50mb' }));
        this._app.use(express.urlencoded({ extended: true }));

        // Register routes
        initializeRoutes(this._app);

        // Rate limiting for the routes
        this.app.use(rateLimit(this.limiterConfig));

        // Handle 404s
        this._app.use(notFoundHandler);
        
        // This should always be last, as it's the generic catch-all error handler
        this._app.use(catchAllHandler);
    }

    public async start() {
        const port = this.env.config.PORT;
        return this._app.listen(port, () => {
            this._logger.info(`OWASP Threat Dragon server application started on http://localhost:${port}/`);
        });
    }
}
