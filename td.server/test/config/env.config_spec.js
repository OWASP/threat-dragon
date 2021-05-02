import dotenv from 'dotenv';
import { expect } from 'chai';
import fs from 'fs';
import sinon from 'sinon';

import envConfig from '../../src/config/env.config.js';

describe('environment configuration tests', () => {

    beforeEach(function() {
        sinon.stub(dotenv, 'config');
    });
    
    afterEach(function() {
        sinon.restore();
    });

    describe('with .env file present', function () {
        beforeEach(() => {
            sinon.stub(fs, 'existsSync').returns(true);
            envConfig.tryLoadDotEnv();
        });

        it('checks if ../../.env exists', () => {
            expect(fs.existsSync).to.have.been.calledOnce;
        });

        it('calls dotenv.config', () => {
            expect(dotenv.config).to.have.been.calledOnce;
        });
    });

    describe('without a .env file present', function () {
        beforeEach(() => {
            sinon.stub(fs, 'existsSync').returns(false);
            envConfig.tryLoadDotEnv();
        });

        it('checks if ../../.env exists', () => {
            expect(fs.existsSync).to.have.been.calledOnce;
        });

        it('calls dotenv.config', () => {
            expect(dotenv.config).not.to.have.been.called;
        });
    });
});