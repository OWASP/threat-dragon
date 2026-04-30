import data_sets from '@/service/migration/tmBom/diagrams/sets';
import tmBomModel from '../test-model';
import { components as nodes } from './mockTdComponents.json';

describe('service/migration/tmBom/diagrams/sets.js', () => {

    describe('updates component descriptions', () => {
        let components = data_sets.merge(tmBomModel, nodes);

        it('adds the data set title', () => {
            expect(components[0].data.description).not.toContain('title data_set');
            expect(components[1].data.description).toContain('title data-set0');
            expect(components[2].data.description).toContain('title data-set1');
            expect(components[3].data.description).toContain('title data-set6');
            expect(components[3].data.description).toContain('title data-set7');
            expect(components[3].data.description).toContain('title data-set8');
            expect(components[4].data.description).toContain('title data-set2');
            expect(components[5].data.description).toContain('title data-set3');
            expect(components[6].data.description).toContain('title data-set4');
            expect(components[6].data.description).toContain('title data-set5');
            expect(components[7].data.description).not.toContain('title data_set');
            expect(components[9].data.description).not.toContain('title data_set');
        });

        it('adds the data set description', () => {
            expect(components[4].data.description).toContain('description data-set2');
            expect(components[6].data.description).toContain('description data-set5');
        });

        it('sets the encryption flag', () => {
            expect(components[1].data.isEncrypted).toBe(true);
            expect(components[4].data.isEncrypted).toBe(false);
            expect(components[7].data.isEncrypted).toBe(false);
        });

        it('adds the number of records', () => {
            expect(components[0].data.description).not.toContain('maximum of');
            expect(components[1].data.description).toContain('maximum of 100000');
            expect(components[5].data.description).toContain('maximum of 200');
            expect(components[6].data.description).not.toContain('maximum of');
        });

        it('adds the data sensitivity', () => {
            expect(components[0].data.description).not.toContain('data sensitivity of');
            expect(components[2].data.description).toContain('data sensitivity of phi');
            expect(components[4].data.description).toContain('data sensitivity of fin');
            expect(components[6].data.description).toContain('data sensitivity of biz');
            expect(components[7].data.description).not.toContain('data sensitivity of');
        });

        it('adds the access control methods', () => {
            expect(components[0].data.description).not.toContain('control methods');
            expect(components[1].data.description).toContain('control methods of acl');
            expect(components[6].data.description).toContain('control methods of none');
            expect(components[9].data.description).not.toContain('control methods');
        });
    });

    describe('handles empty data sets', () => {
        let noDataSetModel = JSON.parse(JSON.stringify(tmBomModel));
        delete noDataSetModel.data_sets;

        it('preserves the components', () => {
            let components = data_sets.merge(noDataSetModel, nodes);
            expect(components).toStrictEqual(nodes);
        });
    });
});
