import summary from '@/service/migration/otm/summary';
import otmModel from '../otm-test-model';

describe('service/migration/otm/summary.js', () => {

    describe('merging OTM', () => {
        let testSummary;

        describe('creates summary from OTM', () => {

            beforeEach(() => {
                testSummary = summary.merge(otmModel);
            });

            it('creates the id', () => {
                expect(testSummary.id.length).toBeGreaterThan(5);
            });
            
            it('creates the title', () => {
                expect(testSummary.title.length).toBeGreaterThan(5);
            });

            it('creates the description', () => {
                expect(testSummary.description.length).toBeGreaterThan(5);
            });
            
            it('creates the owner', () => {
                expect(testSummary.owner.length).toBeGreaterThanOrEqual(1);
            });
            
            it('stores the compatibility values', () => {
                expect(testSummary.compatibility.ownerContact).toBe(otmModel.project.ownerContact);
            });

            it('stores the compatibility attributes', () => {
                expect(testSummary.compatibility.attributes).toStrictEqual(otmModel.project.attributes);
            });

            it('stores the compatibility tags', () => {
                expect(testSummary.compatibility.tags).toStrictEqual(otmModel.project.tags);
            });
        });

        describe('creating summary with absent project', () => {
            const missingModel = JSON.parse(JSON.stringify(otmModel));
            delete missingModel.project;

            beforeEach(() => {
                testSummary = summary.merge(missingModel);
            });
                
            it('provides the title', () => {
                expect(testSummary.title.length).toBeGreaterThan(5);
            });

            it('skips the unused summary keys', () => {
                expect(testSummary.id).toBeUndefined();
                expect(testSummary.description).toBeUndefined();
                expect(testSummary.description).toBeUndefined();
            });

            it('provides an empty compatibility', () => {
                expect(testSummary.compatibility).toBeUndefined();
            });
        });

        describe('handling optional values', () => {
            let missingModel;

            beforeEach(() => {
                missingModel = JSON.parse(JSON.stringify(otmModel));
            });

            it('handles absent description', () => {
                delete missingModel.project.description;
                testSummary = summary.merge(missingModel);
                expect(testSummary.description).toHaveLength(0);
                expect(testSummary.owner).toBeDefined();
            });

            it('handles absent owner', () => {
                delete missingModel.project.owner;
                testSummary = summary.merge(missingModel);
                expect(testSummary.owner).toHaveLength(0);
                expect(testSummary.description).toBeDefined();
            });

            it('handles absent owner contact', () => {
                delete missingModel.project.ownerContact;
                testSummary = summary.merge(missingModel);
                expect(testSummary.compatibility.ownerContact).toBeUndefined();
                expect(testSummary.compatibility).toBeDefined();
            });

            it('handles empty compatibility', () => {
                delete missingModel.project.ownerContact;
                delete missingModel.project.attributes;
                delete missingModel.project.tags;
                testSummary = summary.merge(missingModel);
                expect(testSummary.compatibility).toBeDefined();
            });
        });
    });
});
