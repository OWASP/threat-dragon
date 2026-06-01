import cornucopiaCompanion from '@/service/threats/models/eop/cornucopia-companion.js';

describe('service/threats/models/eop/cornucopia-companion.js', () => {

    it('has the correct id', () => {
        expect(cornucopiaCompanion.id).toEqual('cornucopia-companion');
    });

    it('has the correct name', () => {
        expect(cornucopiaCompanion.name).toEqual('OWASP Cornucopia Companion');
    });

    it('gets all suits', () => {
        expect(cornucopiaCompanion.getSuits().length).toBeGreaterThan(0);
    });

    it('gets cards for Large Language Models suit', () => {
        expect(cornucopiaCompanion.getCardsBySuit('Large Language Models').length).toBeGreaterThan(0);
    });

    it('returns empty array when no suit given', () => {
        expect(cornucopiaCompanion.getCardsBySuit(null)).toEqual([]);
    });

    it('gets the category for LLM2', () => {
        expect(cornucopiaCompanion.getCardCategory('LLM2')).toEqual('Large Language Models');
    });

    it('gets the url for LLM2', () => {
        expect(cornucopiaCompanion.getCardUrl('LLM2')).toContain('https://cornucopia.owasp.org/');
    });

    it('returns default url when no card given', () => {
        expect(cornucopiaCompanion.getCardUrl(null)).toEqual('https://cornucopia.owasp.org/cards');
    });
});
