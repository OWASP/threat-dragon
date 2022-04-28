import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { upDir } from '../service/FsHelper';

export interface ITdEnv {
    loadConfig(): object;
}

export class TdProviderProperty {
    key: string;
    required: boolean;
    defaultValue: any | undefined;
}

export interface ITdEnvProvider extends ITdEnv {
    get prefix(): string;
    get properties(): TdProviderProperty[];
}

export class Env implements ITdEnv {
    private readonly providers: ITdEnvProvider[] = [];
    private readonly defaultEnvFilePath = path.join(__dirname, upDir(), upDir(), upDir(), '.env');
    private readonly _config: object = {};
    private readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    get config(): { [ key: string ]: any } {
        return Object.freeze({ ...this._config});
    }

    /**
     * The properties to be loaded for this environment configuration WITHOUT
     * the given prefix.  For example:
     *  GITHUB_CLIENT_ID => { key: 'CLIENT_ID', required: true }
     */
    get properties(): TdProviderProperty[] {
        const errorMessage = 'When creating a new Env configuration class, you must override the getter for properties.  See GithubEnv for an example.';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    /**
     * The prefix for the properties associated with this configuration
     * For example:
     * GITHUB_CLIENT_ID => "GITHUB_"
     */
    get prefix(): string {
        const errorMessage = 'When creating a new Env configuration class, you must override the getter for prefix.  See GithubEnv for an example.';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    /**
     * Initializes the configuration
     * This should be called during application startup
     */
    hydrate(): void {
        this.tryLoadDotEnv();
        for (let i = 0; i < this.providers.length; i++) {
            Object.assign(this._config, this.providers[i].loadConfig());
        }
    }

    /**
     * Determines if there is a file with the associated
     * configuration and attempts to read the value from that
     * Useful for docker secrets and/or kubernetes deployments
     */
    tryReadFromFile(basePropertyName: string): string | null {
        const propertyName = `${basePropertyName}_FILE`;
        if (process.env[propertyName]) {
            const filePath = process.env[propertyName];
            if (!fs.existsSync(filePath)) {
                const errorMessage = `${propertyName} was set, but file ${filePath} does not exist.`;
                console.error(errorMessage);
                throw new Error(errorMessage);
            }

            return fs.readFileSync(filePath).
                toString('utf8').
                trim();
        }

        return null;
    }

    /**
     * Loads all of the configuration.  This will error if required properties are missing
     */
    loadConfig(): { [key: string]: any } {
        const config: { [ key: string ]: string } = {};
        console.log(`Initializing env config for ${this.name}`);
        this.properties.forEach(({ key, required, defaultValue }: TdProviderProperty) => {
            const prop = `${this.prefix}${key}`;
            const value = process.env[prop] || this.tryReadFromFile(prop) || defaultValue;
            if (!value && required) {
                const errMsg = `${prop} is a required property.  Threat Dragon server cannot start without it.  Please see setup-env.md for more information`;
                console.error(errMsg);
                throw new Error(errMsg);
            }
            config[prop] = value;
        });
        return config;
    }

    addProvider(provider: ITdEnvProvider): void {
        this.providers.push(provider);
    }

    private tryLoadDotEnv(): void {
        const envFilePath = process.env.ENV_FILE || this.defaultEnvFilePath;
        if (fs.existsSync(envFilePath)) {
            dotenv.config({
                path: envFilePath
            });
        } else {
            console.log(`Unable to find .env file, falling back to environment variables`);
        }
    }
}

let env: Env = null;

export const getEnv = (): Env => {
    if (env === null) {
        env = new Env('');
    }
    return env;
};
