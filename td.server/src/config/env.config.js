import env from '../env/Env.js';
import GithubEnv from '../env/Github.js';
import SessionEnv from '../env/Session.js';
import ThreatDragonEnv from '../env/ThreatDragon.js';

const tryLoadDotEnv = () => {
    const github = new GithubEnv();
    const session = new SessionEnv();
    const threatDragon = new ThreatDragonEnv();
    env.get().addProvider(github);
    env.get().addProvider(session);
    env.get().addProvider(threatDragon);
    env.get().hydrate();
};

export default { tryLoadDotEnv };
