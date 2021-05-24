import upgrader from '@/service/migration/upgrader.js';
import v2Upgrader from '@/service/migration/v2.js';

describe('service/migration/upgrader.js', () => {
    describe('getVersion', () => {
        it('identifies a v1 model', () => {
            expect(upgrader.getVersion({})).toEqual('1');
        });

        it('identifies a v2.0 model', () => {
            expect(upgrader.getVersion({ version: '2.0' })).toEqual('2.0');
        });

        it('throws an error for an invalid model version', () => {
            expect(() => upgrader.getVersion({ version: 'foo' }))
                .toThrowError('Invalid model version: foo');
        });
    });

    describe('upgrade', () => {
        beforeEach(() => {
            v2Upgrader.upgrade = jest.fn();
        });

        it('upgrades a v1 model', () => {
            upgrader.upgrade({});
            expect(v2Upgrader.upgrade).toHaveBeenCalledWith({});
        });

        it('does not upgrade a v2.0 model', () => {
            upgrader.upgrade({ version: '2.0' });
            expect(v2Upgrader.upgrade).not.toHaveBeenCalled();
        });
    });
});
