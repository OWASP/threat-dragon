import { expect } from 'chai';
import sinon from 'sinon';

import { getMockRequest, getMockResponse } from '../mocks/express.mocks.js';
import reverseproxy from '../../src/config/reverseproxy.config.js';

describe('config/reverseproxy.config.js', () => {
    let req, res, next;

    beforeEach(() => {
        req = getMockRequest();
        res = getMockResponse();
        next = sinon.spy();
    });

    it('normalises a decoded repository path', () => {
        req.params.repo = ['foo', 'bar', 'baz'];

        reverseproxy.middleware(req, res, next);

        expect(req.params.repo).to.equal('foo/bar/baz');
    });

    it('leaves encoded route repository params unchanged', () => {
        req.params.repo = 'foo/bar/baz';

        reverseproxy.middleware(req, res, next);

        expect(req.params.repo).to.equal('foo/bar/baz');
    });

    it('calls the next handler', () => {
        reverseproxy.middleware(req, res, next);

        expect(next).to.have.been.calledOnce;
    });
});
