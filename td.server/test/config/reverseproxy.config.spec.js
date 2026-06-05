import { expect } from 'chai';
import sinon from 'sinon';

import { getMockRequest, getMockResponse } from '../mocks/express.mocks.js';
import decodeRepoPaths from '../../src/config/decodeRepoPaths.config.js';

describe('config/decodeRepoPaths.config.js', () => {
    let req, res, next;

    beforeEach(() => {
        req = getMockRequest();
        res = getMockResponse();
        next = sinon.spy();
    });

    it('normalises a decoded repository path', () => {
        req.params.repo = ['foo', 'bar', 'baz'];

        decodeRepoPaths.middleware(req, res, next);

        expect(req.params.repo).to.equal('foo/bar/baz');
    });

    it('leaves encoded route repository params unchanged', () => {
        req.params.repo = 'foo/bar/baz';

        decodeRepoPaths.middleware(req, res, next);

        expect(req.params.repo).to.equal('foo/bar/baz');
    });

    it('calls the next handler', () => {
        decodeRepoPaths.middleware(req, res, next);

        expect(next).to.have.been.calledOnce;
    });
});
