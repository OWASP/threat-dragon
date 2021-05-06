import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

before(() => {
    chai.use(sinonChai);
    chai.use(chaiAsPromised);
});
