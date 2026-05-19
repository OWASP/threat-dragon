import { expect } from 'chai';
import sinon from 'sinon';
import { getMockRequest, getMockResponse } from '../mocks/express.mocks.js';

import configController, {
    createConfigLoader,
    createConfigController,
    getConfig
} from '../../src/controllers/configcontroller.js';
import { ERROR_CODES } from '../../src/constants/errorCodes.js';
import { ERROR_MESSAGES } from '../../src/constants/errorMessages.js';
import responseWrapper from '../../src/controllers/responseWrapper';
import loggerHelper from '../../src/helpers/logger.helper.js';

describe('controllers/configcontroller.js', () => {
    let mockRequest, mockResponse;
    let sendResponseStub;
    let loggerMock;

    const EMPTY_CONFIG = { config: {} };

    beforeEach(() => {
        mockRequest = getMockRequest();
        mockResponse = getMockResponse();
        loggerMock = { warn: sinon.stub() };

        sendResponseStub = sinon.stub(responseWrapper, 'sendResponse');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getConfig', () => {

        it('should use default dependencies when called without arguments', () => {
            expect(() => getConfig()).to.not.throw();
        });

        it('should call env.get()', () => {
            const envMock = { get: sinon.stub().returns(EMPTY_CONFIG) };
            const buildConfigMock = sinon.stub().returns({ value: {}, errors: [] });

            getConfig({ envDep: envMock, buildConfigDep: buildConfigMock, loggerDep: loggerMock });

            expect(envMock.get.calledOnce).to.be.true;
        });

        it('should pass config to buildConfig', () => {
            const envMock = { get: sinon.stub().returns(EMPTY_CONFIG) };
            const buildConfigMock = sinon.stub().returns({ value: {}, errors: [] });

            getConfig({ envDep: envMock, buildConfigDep: buildConfigMock, loggerDep: loggerMock });

            expect(buildConfigMock.calledOnceWithExactly(EMPTY_CONFIG.config)).to.be.true;
        });

        it('should return the value from buildConfig', () => {
            const fakeValue = { parsed: true };
            const buildConfigMock = sinon.stub().returns({ value: fakeValue, errors: [] });

            const result = getConfig({
                envDep: { get: () => EMPTY_CONFIG },
                buildConfigDep: buildConfigMock,
                loggerDep: loggerMock
            });

            expect(result).to.equal(fakeValue);
        });

        it('should log errors using error.code as fallback when ERROR_MESSAGES has no mapping', () => {
            const buildConfigMock = sinon.stub().returns({
                value: {},
                errors: [
                    { code: 'ERR_A', meta: { a: 1 } },
                    { code: 'ERR_B', meta: { b: 2 } }
                ]
            });

            getConfig({
                envDep: { get: () => EMPTY_CONFIG },
                buildConfigDep: buildConfigMock,
                loggerDep: loggerMock
            });

            expect(loggerMock.warn.calledTwice).to.be.true;
            expect(loggerMock.warn.firstCall.args).to.deep.equal(['ERR_A', { a: 1 }]);
            expect(loggerMock.warn.secondCall.args).to.deep.equal(['ERR_B', { b: 2 }]);
        });

        it('should resolve known error codes using ERROR_MESSAGES', () => {
            const knownCode = ERROR_CODES.CONFIG_LOCALE_MISSING;
            const buildConfigMock = sinon.stub().returns({
                value: {},
                errors: [{ code: knownCode, meta: {} }]
            });

            getConfig({
                envDep: { get: () => EMPTY_CONFIG },
                buildConfigDep: buildConfigMock,
                loggerDep: loggerMock
            });

            expect(loggerMock.warn.calledOnce).to.be.true;
            expect(loggerMock.warn.firstCall.args[0]).to.equal(ERROR_MESSAGES[knownCode]);
        });

        it('should fall back to CONFIG_INVALID_ENTRY for malformed errors', () => {
            const buildConfigMock = sinon.stub().returns({
                value: {},
                errors: [
                    { meta: { some: 'data' } },
                    null
                ]
            });

            getConfig({
                envDep: { get: () => EMPTY_CONFIG },
                buildConfigDep: buildConfigMock,
                loggerDep: loggerMock
            });

            expect(loggerMock.warn.calledTwice).to.be.true;
            expect(loggerMock.warn.firstCall.args).to.deep.equal([
                ERROR_CODES.CONFIG_INVALID_ENTRY,
                { error: { meta: { some: 'data' } } }
            ]);
            expect(loggerMock.warn.secondCall.args).to.deep.equal([
                ERROR_CODES.CONFIG_INVALID_ENTRY,
                { error: null }
            ]);
        });

        it('should not log when errors array is empty', () => {
            const buildConfigMock = sinon.stub().returns({ value: {}, errors: [] });

            getConfig({
                envDep: { get: () => EMPTY_CONFIG },
                buildConfigDep: buildConfigMock,
                loggerDep: loggerMock
            });

            expect(loggerMock.warn.notCalled).to.be.true;
        });

        it('should handle missing errors array defensively', () => {
            const buildConfigMock = sinon.stub().returns({ value: {} });

            getConfig({
                envDep: { get: () => EMPTY_CONFIG },
                buildConfigDep: buildConfigMock,
                loggerDep: loggerMock
            });

            expect(loggerMock.warn.notCalled).to.be.true;
        });

        it('should not cache — each call invokes buildConfig', () => {
            const buildConfigMock = sinon.stub().returns({ value: {}, errors: [] });
            const deps = {
                envDep: { get: () => EMPTY_CONFIG },
                buildConfigDep: buildConfigMock,
                loggerDep: loggerMock
            };

            getConfig(deps);
            getConfig(deps);

            expect(buildConfigMock.calledTwice).to.be.true;
        });
    });

    describe('createConfigLoader', () => {
        it('should call getConfigDep only on first invocation', () => {
            const getConfigStub = sinon.stub().returns({ config: 'cached' });
            const loadConfig = createConfigLoader({ getConfigDep: getConfigStub });

            const result1 = loadConfig();
            const result2 = loadConfig();
            const result3 = loadConfig();

            expect(getConfigStub.calledOnce).to.be.true;
            expect(result1).to.equal(result2).and.to.equal(result3);
        });

        it('should return a function', () => {
            const loadConfig = createConfigLoader({ getConfigDep: () => ({}) });

            expect(loadConfig).to.be.a('function');
        });

        it('should return cached config after first invocation', () => {
            const config = { cached: true };

            const getConfigStub = sinon.stub().returns(config);

            const loadConfig = createConfigLoader({
                getConfigDep: getConfigStub
            });

            const first = loadConfig();
            const second = loadConfig();

            expect(first).to.equal(config);
            expect(second).to.equal(config);
            expect(getConfigStub.calledOnce).to.be.true;
        });

        it('should create loader with default getConfig dependency', () => {
            const loadConfig = createConfigLoader();

            expect(loadConfig).to.be.a('function');
        });
    });

    describe('createConfigController', () => {
        it('returns controller with config handler', () => {
            const controller = createConfigController();

            expect(controller).to.have.property('config');
            expect(controller.config).to.be.a('function');
        });

        it('passes the cached loader function to sendResponse', () => {
            const controller = createConfigController();

            controller.config(mockRequest, mockResponse);

            expect(sendResponseStub.calledOnce).to.be.true;
            const handlerArg = sendResponseStub.firstCall.args[0];

            // calling it again returns the same config
            const first = handlerArg();
            const second = handlerArg();

            expect(first).to.deep.equal(second);
        });

        it('accepts a custom logger dependency', () => {
            const customLogger = { warn: sinon.stub() };
            const controller = createConfigController({ loggerDep: customLogger });

            controller.config(mockRequest, mockResponse);

            expect(sendResponseStub.firstCall.args[3]).to.equal(customLogger);
        });

        it('uses the default logger when no loggerDep is provided', () => {
            const controller = createConfigController();

            controller.config(mockRequest, mockResponse);

            const passedLogger = sendResponseStub.firstCall.args[3];
            expect(passedLogger).to.have.property('warn');
            expect(passedLogger.warn).to.be.a('function');
        });
    });

    describe('default config controller', () => {
        it('should call responseWrapper.sendResponse', () => {
            configController.config(mockRequest, mockResponse);

            expect(sendResponseStub.calledOnce).to.be.true;
        });

        it('should pass a handler function that returns cached config', () => {
            configController.config(mockRequest, mockResponse);

            const handler = sendResponseStub.firstCall.args[0];
            const first = handler();
            const second = handler();

            expect(first).to.deep.equal(second);
        });

        it('should pass req and res to sendResponse', () => {
            configController.config(mockRequest, mockResponse);

            expect(sendResponseStub.firstCall.args[1]).to.equal(mockRequest);
            expect(sendResponseStub.firstCall.args[2]).to.equal(mockResponse);
        });
    });
});
