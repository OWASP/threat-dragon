import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import env from '../src/env/Env.js';
import ThreatDragonEnv from '../src/env/ThreatDragon.js';

before(() => {
    process.env.NODE_ENV = 'test';

    const threatDragon = new ThreatDragonEnv();
    env.get().addProvider(threatDragon);
    env.get().hydrate();
    
    chai.use(sinonChai);
    chai.use(chaiAsPromised);
});

afterEach(() => {
    sinon.restore();
});
