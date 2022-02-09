import sinon from 'sinon';

const get = () => ({
    audit: sinon.spy(),
    error: sinon.spy(),
    warn: sinon.spy(),
    info: sinon.spy(),
    debug: sinon.spy(),
    silly: sinon.spy(),
    log: sinon.spy()
});

export default {
    get
};
