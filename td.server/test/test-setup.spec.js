import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

before(() => {
    process.env.NODE_ENV = 'test';
    chai.use(sinonChai);
    chai.use(chaiAsPromised);
});

