import env from '../env/Env.js';
import GithubEnv from '../env/Github.js';
import SessionEnv from '../env/Session.js';

// TODO: Ensure that all existing process.env[prop] props are covered
// TODO: Update README
// TODO: Update setup-env.md
// TODO: Test with docker (file based config)
// TODO: Update docs repo
const tryLoadDotEnv = () => {
    const github = new GithubEnv();
    const session = new SessionEnv();
    env.addProvider(github);
    env.addProvider(session);
    env.hydrate();
};

export default { tryLoadDotEnv };
