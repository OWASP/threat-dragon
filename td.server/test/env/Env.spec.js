import dotenv from 'dotenv';
import { expect } from 'chai';
import fs from 'fs';
import sinon from 'sinon';

import { Env } from '../../src/env/Env.js';

describe('env/Env.js', () => {
    let env;

    describe('ctor', () => {
        beforeEach(() => {
            env = new Env();
        });

        it('has a _providers array', () => {
            expect(env._providers).to.be.a('array');
        });

        it('has a default .env file path', () => {
            expect(env._defaultEnvFilePath).to.be.a('String');
        });

        it('has a config property', () => {
            expect(env._config).to.be.a('Object');
        });
    });

    describe('config getter', () => {
        const config = {
            foo: 'bar'
        };

        beforeEach(() => {
            env = new Env();
            env._config = config;
        });

        it('returns the config object', () => {
            expect(env.config).to.deep.equal(config);
        });

        it('prevents config mutation', () => {
            expect(() => {
                env.config.bar = 'baz';
            }).to.throw();
        });
    });

    describe('properties getter', () => {
        beforeEach(() => {
            env = new Env();
        });

        it('throws an error when called on the parent class', () => {
            expect(() => {
                env.properties
            }).to.throw('override the getter for properties');
        });
    });

    describe('prefix getter', () => {
        beforeEach(() => {
            env = new Env();
        });

        it('throws an error when called on the parent class', () => {
            expect(() => {
                env.prefix
            }).to.throw('override the getter for prefix');
        });
    });

    describe('hydrate', () => {
        const childConfig = { foo: 'bar' };
        let child;

        beforeEach(() => {
            env = new Env();
            child = {
                _loadConfig: () => childConfig
            };
            sinon.stub(env, '_tryLoadDotEnv');
            sinon.spy(child, '_loadConfig');
            env.addProvider(child);
            env.hydrate();
        });

        it('tries to load dotenv config', () => {
            expect(env._tryLoadDotEnv).to.have.been.calledOnce;
        });

        it('calls loadConfig on the children', () => {
            expect(child._loadConfig).to.have.been.calledOnce;
        });

        it('applies the child config to the parent', () => {
            expect(env.config).to.deep.equal(childConfig);
        });
    });

    describe('tryReadFromFile', () => {
        beforeEach(() => {
            env = new Env();
        });

        it('returns null if process.env[${basePropertyName}_FILE] is undefined', () => {
            const result = env.tryReadFromFile('foo');
            expect(result).to.be.null;
        });

        describe('with file property set', () => {
            const basePropertyName = 'foo',
                propertyValue = 'bar';

            beforeEach(() => {
                process.env[`${basePropertyName}_FILE`] = propertyValue;
            });

            afterEach(() => {
                delete process.env[`${basePropertyName}_FILE`];
            });

            describe('with existing file', () => {
                const contents = 'winner      ';
                let result;

                beforeEach(() => {
                    sinon.stub(fs, 'existsSync').returns(true);
                    sinon.stub(fs, 'readFileSync').returns(contents);
                    result = env.tryReadFromFile(basePropertyName);
                });

                it('reads the file contents', () => {
                    expect(result).not.to.be.null;
                });

                it('trims the results', () => {
                    expect(result).to.eq(contents.trim());
                });
            });

            describe('with a non-existent file', () => {
                beforeEach(() => {
                    sinon.stub(fs, 'existsSync').returns(false);
                });

                it('throws an error', () => {
                    expect(() => {
                        env.tryReadFromFile(basePropertyName);
                    }).to.throw('does not exist');
                });
            });
        });
    });

    describe('_tryLoadDotEnv', () => {
        beforeEach(() => {
            env = new Env();
        });

        describe('without a .env file', () => {
            beforeEach(() => {
                process.env.ENV_FILE = 'foo';
                sinon.stub(fs, 'existsSync').returns(false);
                env._tryLoadDotEnv();
            });

            afterEach(() => {
                delete process.env.ENV_FILE;
            });

            it('uses the ENV_FILE environment variable', () => {
                expect(fs.existsSync).to.have.been.calledWith('foo');
            });
        });

        describe('with a .env file', () => {
            beforeEach(() => {
                sinon.stub(fs, 'existsSync').returns(true);
                sinon.stub(dotenv, 'config');
                env._tryLoadDotEnv();
            });
    
            it('uses the default env file path', () => {
                expect(fs.existsSync).to.have.been.calledWith(env._defaultEnvFilePath);
            });

            it('configures dotenv', () => {
                expect(dotenv.config).to.have.been.calledWith({ path: env._defaultEnvFilePath });
            });
        });
    });

    describe('loadConfig', () => {
        const prefix = 'TEST_';
        const name = 'test';
        const props = [
            { key: 'TEST1', required: false },
            { key: 'TEST2', required: true }
        ];

        class TestEnv extends Env {
            constructor() {super('test'); }
            get prefix() { return prefix; }
            get properties() { return props; }
        }

        describe('with missing required properties', () => {
            beforeEach(() => {
                process.env.TEST1 = 'foo';
                env = new TestEnv();

                sinon.stub(env, 'tryReadFromFile');
            });

            afterEach(() => {
                delete process.env.TEST1;
            });

            it('attempts to read a file based property', () => {
                try { env._loadConfig(); } catch (e) { }
                expect(env.tryReadFromFile).to.have.been.calledWith('TEST_TEST1');
            });

            it('throws an error', () => {
                expect(() => {
                    env._loadConfig();
                }).to.throw();
            });
        });

        describe('with environment fully configured', () => {
            let config;

            beforeEach(() => {
                process.env.TEST_TEST1 = 'foo';
                process.env.TEST_TEST2 = 'bar';
                env = new TestEnv();

                config = env._loadConfig();
            });

            afterEach(() => {
                delete process.env.TEST_TEST1;
                delete process.env.TEST_TEST2;
            });

            it('names the env', () => {
                expect(env.name).to.eq(name);
            });

            it('returns the config object', () => {
                const expected = {
                    TEST_TEST1: 'foo',
                    TEST_TEST2: 'bar'
                };
                expect(config).to.deep.equal(expected);
            });
        });
    });
});
