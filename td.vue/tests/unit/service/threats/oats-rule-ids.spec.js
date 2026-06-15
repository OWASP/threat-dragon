import { getRuleId } from '@/service/threats/oats/rule-ids.js';

describe('service/threats/oats/rule-ids.js', () => {
    it('reuses the v1 rule ID for an automated threat', () => {
        expect(getRuleId({
            title: 'CAPTCHA defeat',
            description: ''
        })).toEqual('5b0d4c4e-8245-4bea-a2ad-cf0be0a441f5');
    });

    it('uses the scalping rule ID for goods and services footprinting', () => {
        expect(getRuleId({
            title: 'Footprinting',
            description: 'See OWASP Automated Threat #5:'
        })).toEqual('c50e8d53-5e0a-45e7-8c69-be92492ad7dc');
    });

    it('uses the footprinting rule ID for web application footprinting', () => {
        expect(getRuleId({
            title: 'Footprinting',
            description: 'See OWASP Automated Threat #18:'
        })).toEqual('20527bee-aae7-4593-acac-7a07169ccc4f');
    });

    it('returns undefined for an unknown suggestion', () => {
        expect(getRuleId({
            title: 'Unknown',
            description: ''
        })).toBeUndefined();
    });
});
