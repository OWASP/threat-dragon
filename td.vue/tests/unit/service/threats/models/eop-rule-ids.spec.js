import cornucopia from '@/service/threats/models/eop/cornucopia.js';
import cornucopiaCompanion from '@/service/threats/models/eop/cornucopia-companion.js';
import cornucopiaMobileApp from '@/service/threats/models/eop/cornucopia-mobileapp.js';

describe('service/threats/models/eop Cornucopia games', () => {
    it('gets the web application card rule ID from the API data', () => {
        expect(cornucopia.getCardRuleId('VE2'))
            .toEqual('https://cornucopia.owasp.org/edition/webapp/VE2/3.0/en');
    });

    it('gets the mobile application card rule ID from the API data', () => {
        expect(cornucopiaMobileApp.getCardRuleId('PC2'))
            .toEqual('https://cornucopia.owasp.org/edition/mobileapp/PC2/1.1/en');
    });

    it('gets the companion card rule ID from the API data', () => {
        expect(cornucopiaCompanion.getCardRuleId('LLM2'))
            .toEqual('https://cornucopia.owasp.org/edition/companion/LLM2/1.0/en');
    });

    it('returns undefined for an unknown card', () => {
        expect(cornucopia.getCardRuleId('unknown')).toBeUndefined();
    });
});
