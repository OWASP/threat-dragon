import { modelVersions } from '@/service/migration/versions.js';

describe('service/migration/versions.js', () => {
    it('defines v1', () => {
        expect(modelVersions.v1).toEqual('1');
    });

    it('defines v2_0', () => {
        expect(modelVersions.v2_0).toEqual('2.0');
    });

    it('is immutable', () => {
        expect(() => { modelVersions.foo = 'bar'; })
            .toThrowError('object is not extensible');
    });
});