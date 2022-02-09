import labels from '@/service/migration/labels.js';


describe('service/migration/labels.js', () => {
    it('gets the text', () => {
        const lbl = {
            attrs: {
                text: { text: 'asdf' }
            }
        };
        expect(labels.getText({}, lbl)).toEqual('asdf');
    });

    it('appends the protocol', () => {
        const lbl = {
            attrs: {
                text: { text: 'asdf' }
            }
        };
        const actual = labels.getText({protocol: 'HTTPS' }, lbl);
        expect(actual).toEqual('asdf (HTTPS)');

    });
});
