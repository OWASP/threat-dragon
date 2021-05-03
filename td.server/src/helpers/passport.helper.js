import encryptionHelper from './encryption.helper.js';

const serializeUser = (user, done) => {
    const userToStore = {
        accessToken: user.accessToken,
        profile: {
            username: user.profile.username,
            provider: user.profile.provider,
            repos_url: user.profile._json.repos_url
        }
    };
    
    encryptionHelper.encrypt(JSON.stringify(userToStore), (cipherText) => {
        done(null, cipherText);
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
