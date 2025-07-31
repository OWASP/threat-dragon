import labels from '@/service/diagram/v1/labels.js';


describe('service/diagram/v1/labels.js', () => {
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
