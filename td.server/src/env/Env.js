import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { upDir } from '../helpers/path.helper.js';

export class Env {
    /* eslint no-console: 0 */

    /**
     * Creates a new instance of the Env class
     * @constructor
     * @param {string} name
     */
    constructor (name) {
        this._providers = [];
        this._defaultEnvFilePath = path.join(__dirname, upDir, upDir, upDir, '.env');
        this._config = {};
        this.name = name;
    }

    /**
     * Gets the configuration
     * @returns {Object}
     */
    get config () {
        return Object.freeze({ ...this._config });
    }

    /**
     * The properties to be loaded for this environment configuration WITHOUT
     * the given prefix.  For example:
     *  GITHUB_CLIENT_ID => { key: 'CLIENT_ID', required: true }
     * @returns {Object[]}
     */
    get properties () {
        const errorMessage = 'When creating a new Env configuration class, you must override the getter for properties.  See GithubEnv for an example.';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    /**
     * The prefix for the properties associated with this configuration
     * For example:
     * GITHUB_CLIENT_ID => "GITHUB_"
     */
    get prefix () {
        const errorMessage = 'When creating a new Env configuration class, you must override the getter for prefix.  See GithubEnv for an example.';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    /**
     * Initializes the configuration
     * This should be called during application startup
     */
    hydrate () {
        this._tryLoadDotEnv();
        for (let i = 0; i < this._providers.length; i++) {
            Object.assign(this._config, this._providers[i]._loadConfig());
        }
    }

    /**
     * Determines if there is a file with the associated
     * configuration and attempts to read the value from that
     * Useful for docker secrets and/or kubernetes deployments
     * @param {string} basePropertyName
     * @returns {string|null}
     */
    tryReadFromFile (basePropertyName) {
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
    _loadConfig () {
        const config = {};
        this.properties.forEach(({ key, required, defaultValue }) => {
            const prop = `${this.prefix}${key}`;
            const value = process.env[prop] || this.tryReadFromFile(prop) || defaultValue;
            if (!value && required) {
                const errMsg = `${prop} is a required property, Threat Dragon server cannot start without it. Refer to development/environment.md for more information`;
                console.error(errMsg);
                throw new Error(errMsg);
            }
            config[prop] = value;
        });
        return config;
    }

    /**
     * Adds a provider to use for env configuration
     * @param {Env} provider
     */
    addProvider (provider) {
        this._providers.push(provider);
    }

    /**
     * Attempts to load the configuration from a dotenv file
     */
    _tryLoadDotEnv () {
        const envFilePath = process.env.ENV_FILE || this._defaultEnvFilePath;
        if (fs.existsSync(envFilePath)) {
            dotenv.config({
                path: envFilePath
            });
            console.log(`Using config file: ${envFilePath}`);
        } else {
            console.log('Unable to find .env file, falling back to environment variables');
        }
    }
}

let env = null;

const get = () => {
    if (env === null) {
        env = new Env();
    }
    return env;
};

export default {
    get,
    Env
};
