import {expect} from 'chai';
import sinon from 'sinon';

import env from '../../src/env/Env.js';
import configController, {getConfig} from '../../src/controllers/configcontroller.js';
import {getMockRequest, getMockResponse} from '../mocks/express.mocks.js';
import responseWrapper from "../../src/controllers/responseWrapper";

describe('controllers/configcontroller.js', () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
        mockRequest = getMockRequest();
        mockResponse = getMockResponse();
    });

    // sinon.stub(env, 'get').returns({config: {BITBUCKET_WORKSPACE: workspace}});

    describe('/api/config', () => {
        beforeEach(async () => {
            sinon.stub(responseWrapper, 'sendResponseAsync').callsFake(async (p) => {
                await p();
            });
            sinon.stub(responseWrapper, 'sendResponse').callsFake((fn) => fn());
            const mockEnv = {
                config: {
                    NODE_ENV: 'development'
                }
            };
            sinon.stub(env, 'get').returns(mockEnv);
            configController.config(mockRequest, mockResponse);

        });

        it('should send the home page file', async () => {
            expect(responseWrapper.sendResponse).to.have.been.calledOnce;
        });
    });

    describe("getConfig", () => {

        it("all true", () => {
            sinon.stub(env, 'get').returns({config: {BITBUCKET_CLIENT_ID: '123', GITHUB_CLIENT_ID: '456',GITLAB_CLIENT_ID: '456', GOOGLE_CLIENT_ID: '123'}});
            expect(getConfig()).to.deep.equal({
                "bitbucketEnabled": true,
                "githubEnabled": true,
                "gitlabEnabled": true,
                "googleEnabled": true,
                "localEnabled": true,
            })
        })
        it("bitbucket and local", () => {
            sinon.stub(env, 'get').returns({config: {BITBUCKET_CLIENT_ID: '123', }});
            expect(getConfig()).to.deep.equal({
                "bitbucketEnabled": true,
                "githubEnabled": false,
                "gitlabEnabled": false,
                "googleEnabled": false,
                "localEnabled": true,
            })
        })
        it("github and local", () => {
            sinon.stub(env, 'get').returns({config: {GITHUB_CLIENT_ID: '123', }});
            expect(getConfig()).to.deep.equal({
                "bitbucketEnabled": false,
                "githubEnabled": true,
                "gitlabEnabled": false,
                "googleEnabled": false,
                "localEnabled": true,
            })
        })
        it("gitlab and local", () => {
            sinon.stub(env, 'get').returns({config: {GITLAB_CLIENT_ID: '123', }});
            expect(getConfig()).to.deep.equal({
                "bitbucketEnabled": false,
                "githubEnabled": false,
                "gitlabEnabled": true,
                "googleEnabled": false,
                "localEnabled": true,
            })
        })
        it("google and local", () => {
            sinon.stub(env, 'get').returns({config: {GOOGLE_CLIENT_ID: '123', }});
            expect(getConfig()).to.deep.equal({
                "bitbucketEnabled": false,
                "githubEnabled": false,
                "gitlabEnabled": false,
                "googleEnabled": true,
                "localEnabled": true,
            })
        })
        it("github and bitbucket null and local", () => {
            sinon.stub(env, 'get').returns({config: {GITHUB_CLIENT_ID: '123', BITBUCKET_CLIENT_ID: null}});
            expect(getConfig()).to.deep.equal({
                "bitbucketEnabled": false,
                "githubEnabled": true,
                "gitlabEnabled": false,
                "googleEnabled": false,
                "localEnabled": true,
            })
        })
        it("local only", () => {
            sinon.stub(env, 'get').returns({config: { }});
            expect(getConfig()).to.deep.equal({
                "bitbucketEnabled": false,
                "githubEnabled": false,
                "gitlabEnabled": false,
                "googleEnabled": false,
                "localEnabled": true,
            })
        })
    });
});