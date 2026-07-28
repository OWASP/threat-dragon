import cornucopiaMobileapp from '@/service/threats/models/eop/cornucopia-mobileapp';

describe('service/threats/models/eop/cornucopia-companion.js', () => {

    it('has the correct id', () => {
        expect(cornucopiaMobileapp.id).toEqual('cornucopia-mobileapp');
    });

    it('has the correct name', () => {
        expect(cornucopiaMobileapp.name).toEqual('OWASP Cornucopia Mobileapp');
    });

    it('gets all suits', () => {
        expect(cornucopiaMobileapp.getSuits().length).toBeGreaterThan(0);
    });

    it('gets cards for Network & Storage suit', () => {
        expect(cornucopiaMobileapp.getCardsBySuit('Network & Storage').length).toBeGreaterThan(0);
    });

    it('returns empty array when no suit given', () => {
        expect(cornucopiaMobileapp.getCardsBySuit(null)).toEqual([]);
    });

    it('gets the category for NS5', () => {
        expect(cornucopiaMobileapp.getCardCategory('NS5')).toEqual('Network & Storage');
    });

    it('returns null when no category given', () => {
        expect(cornucopiaMobileapp.getCardCategory(null)).toEqual(null);
    });

    it('gets the url for NS5', () => {
        expect(cornucopiaMobileapp.getCardUrl('NS5')).toContain('https://cornucopia.owasp.org/');
    });

    it('returns default url when no card given', () => {
        expect(cornucopiaMobileapp.getCardUrl(null)).toEqual('https://cornucopia.owasp.org/cards');
    });
});
