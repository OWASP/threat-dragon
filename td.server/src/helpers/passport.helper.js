import encryptionHelper from './encryption.helper.js';
import { logger } from '../config/loggers.config.js';

const serializeUser = (user, done) => {
    const userToStore = {
        accessToken: user.accessToken,
        profile: {
            username: user.profile.username,
            provider: user.profile.provider,
            repos_url: user.profile._json.repos_url
        }
    };
    
    return encryptionHelper.encryptPromise(JSON.stringify(userToStore)).
        then((cipherText) => done(null, cipherText)).
        catch((e) => {
            logger.error({ security: true }, e);
            done(e);
        });
};

const deserializeUser = (obj, done) => {
    const user = JSON.parse(encryptionHelper.decrypt(obj));
    done(null, user);
};

export default {
    deserializeUser,
    serializeUser
};
