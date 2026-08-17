import BitbucketEnv from '../env/Bitbucket.js';
import EncryptionEnv from '../env/Encryption.js';
import env from '../env/Env.js';
import GithubEnv from '../env/Github.js';
import GitlabEnv from '../env/Gitlab';
import GoogleEnv from '../env/Google.js';
import PlausibleEnv from '../env/Plausible.js';
import SecurityTxtEnv from '../env/SecurityTxt.js';
import ThreatDragonEnv from '../env/ThreatDragon.js';

const tryLoadDotEnv = () => {
    const github = new GithubEnv();
    const gitlab = new GitlabEnv();
    const bitbucket = new BitbucketEnv();
    const encryption = new EncryptionEnv();
    const plausible = new PlausibleEnv();
    const securityTxt = new SecurityTxtEnv();
    const threatDragon = new ThreatDragonEnv();
    const google = new GoogleEnv();
    env.get().addProvider(github);
    env.get().addProvider(gitlab);
    env.get().addProvider(encryption);
    env.get().addProvider(bitbucket);
    env.get().addProvider(plausible);
    env.get().addProvider(threatDragon);
    env.get().addProvider(google);
    env.get().addProvider(securityTxt);
    env.get().hydrate();
};

export default { tryLoadDotEnv };
