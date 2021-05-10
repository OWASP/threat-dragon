import { expect } from 'chai';

import tmVersion from '../../src/helpers/threatmodel.version.js';

describe('helpers/threatmodel.version.js', () => {

    describe('isVersion1x', () => {
        it('identifies a v1 threat model', () => {
            const model = {};
            expect(tmVersion.isVersion1x(model)).to.be.true;
        });
    
        it('identifies a newer version', () => {
            const model = { version: '2.0' };
            expect(tmVersion.isVersion1x(model)).to.be.false;
        });
    });

    describe('convertToVersion2', () => {
        const original = {
            summary: {
                title: 'title',
                owner: 'owner',
                description: 'description'
            },
            detail: {
                contributors: [{ name: 'name1' }, { name: 'name2' }],
                diagrams: [{ title: 'd1' }] 
            },
            reviewer: 'reviewer'
        };
        const expected = {
            version: '2.0',
            title: 'title',
            owner: 'owner',
            description: 'description',
            reviewer: 'reviewer',
            contributors: [ 'name1', 'name2' ],
            diagrams: [{ title: 'd1' }]
        };

        it('converts the v1 diagram to v2', () => {
            expect(tmVersion.convertToVersion2(original)).to.deep.equal(expected);
        });
    });
});
