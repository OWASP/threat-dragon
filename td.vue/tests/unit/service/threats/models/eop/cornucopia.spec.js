import cornucopia from '@/service/threats/models/eop/cornucopia';

describe('service/threats/models/eop/cornucopia-companion.js', () => {

    it('has the correct id', () => {
        expect(cornucopia.id).toEqual('cornucopia');
    });

    it('has the correct name', () => {
        expect(cornucopia.name).toEqual('OWASP Cornucopia');
    });

    it('gets all suits', () => {
        expect(cornucopia.getSuits().length).toBeGreaterThan(0);
    });

    it('gets cards for Authentication suit', () => {
        expect(cornucopia.getCardsBySuit('AUTHENTICATION').length).toBeGreaterThan(0);
    });

    it('returns empty array when no suit given', () => {
        expect(cornucopia.getCardsBySuit(null)).toEqual([]);
    });

    it('gets the category for card AT5', () => {
        expect(cornucopia.getCardCategory('AT5')).toEqual('AUTHENTICATION');
    });

    it('returns null when no category given', () => {
        expect(cornucopia.getCardCategory(null)).toEqual(null);
    });

    it('gets the url for Authentication suite card AT5', () => {
        expect(cornucopia.getCardUrl('AT5')).toContain('https://cornucopia.owasp.org/');
    });

    it('returns default url when no card given', () => {
        expect(cornucopia.getCardUrl(null)).toEqual('https://cornucopia.owasp.org/cards');
    });
});
