import env from '../env/Env.js';
import errors from './errors.js';
import loggerHelper from '../helpers/logger.helper';

const getSecurityTxt = (config) => {
    // Contact and expires are required
    // security.txt must be in `key: value` format
    // All other fields are optional
    const parts = [];

    // You are allowed multiple contacts. This implementation
    // allows a CSV, and we will honor the order.
    const contacts = config.SECURITY_TXT_CONTACT.split(',');
    parts.push(...contacts.map((x) => `Contact: ${x.trim()}`));
    parts.push(`Expires: ${config.SECURITY_TXT_EXPIRES}`);
  
    if (config.SECURITY_TXT_POLICY) {
        parts.push(`Policy: ${config.SECURITY_TXT_POLICY}`);
    }

    if (config.SECURITY_TXT_CANONICAL) {
        parts.push(`Canonical: ${config.SECURITY_TXT_CANONICAL}`);
    }

    if (config.SECURITY_TXT_PREFERRED_LANGUAGES) {
        parts.push(`Preferred-Languages: ${config.SECURITY_TXT_PREFERRED_LANGUAGES}`);
    }

    return parts.join('\n');
};

const securityTxt = (_req, res) => {
    const config = env.get().config;
    if (!config.SECURITY_TXT_ENABLED) {
        return errors.notFound('File not found', res, loggerHelper.get('controllers/metadataController.js'));
    }

    // RFC 9116 states that /.well-known/security.txt must return a 200
    // with Content-Type: text/plain; charset=utf-8
    res.set('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(getSecurityTxt(config));
};

const legacySecurityTxtRedirect = (_req, res) => res.redirect('/.well-known/security.txt');

export default {
    legacySecurityTxtRedirect,
    securityTxt
};

