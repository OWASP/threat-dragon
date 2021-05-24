import { modelVersions } from '@/service/migration/versions.js';
import v2 from '@/service/migration/v2.js';

describe('service/migration/v2.js', () => {
    const getV1ThreatModel = () => ({
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
    });

    let v1Tm, v2Tm;

    describe('with summary data', () => {
        beforeEach(() => {
            v1Tm = getV1ThreatModel();
            v2Tm = v2.upgrade(v1Tm);
        });
    
        it('adds a version label', () => {
            expect(v2Tm.version).toEqual(modelVersions.v2_0);
        });
    
        it('flattens the title', () => {
            expect(v2Tm.title).toEqual(v1Tm.summary.title);
        });

        it('flattens the owner', () => {
            expect(v2Tm.owner).toEqual(v1Tm.summary.owner);
        });

        it('migrates the reviewer', () => {
            expect(v2Tm.reviewer).toEqual(v1Tm.reviewer);
        });

        it('flattens the description', () => {
            expect(v2Tm.description).toEqual(v1Tm.summary.description);
        });

        it('flattens the contributors', () => {
            expect(v2Tm.contributors).toEqual(['name1', 'name2']);
        });

        it('flattens the diagrams', () => {
            expect(v2Tm.diagrams).toEqual(v1Tm.detail.diagrams);
        });
    });

    describe('without expected fields', () => {

        beforeEach(() => {
            v1Tm = getV1ThreatModel();
            v1Tm.summary = {};
            delete v1Tm.reviewer;
            v1Tm.detail = {};
            v2Tm = v2.upgrade(v1Tm);
        });
    
        it('defaults an empty title', () => {
            expect(v2Tm.title).toEqual('');
        });

        it('defaults an empty owner', () => {
            expect(v2Tm.owner).toEqual('');
        });

        it('defaults an empty reviewer', () => {
            expect(v2Tm.reviewer).toEqual('');
        });

        it('defaults an empty description', () => {
            expect(v2Tm.description).toEqual('');
        });

        it('defaults an empty array for contributors', () => {
            expect(v2Tm.contributors).toEqual([]);
        });
    });
});
