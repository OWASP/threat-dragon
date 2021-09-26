import local from '@/service/provider/local.provider.js';

describe('service/local.provider.js', () => {
    describe('getDashboardActions', () => {

        describe('open existing', () => {
            let action;

            beforeEach(() => {
                action = local.getDashboardActions().find(x=> x.key === 'openExisting');
            });

            it('links to the tm select page', () => {
                expect(action.to).toEqual('/local/threatmodels');
            });

            it('uses the github icon', () => {
                expect(action.iconPreface).toEqual('fab');
                expect(action.icon).toEqual('vuejs');
            });
        });

        describe('new', () => {
            let action;

            beforeEach(() => {
                action = local.getDashboardActions().find(x=> x.key === 'createNew');
            });

            xit('links to the create page', () => {
                expect(action.to).toEqual('/repository');
            });

            it('uses the plus icon', () => {
                expect(action.icon).toEqual('plus');
            });
        });

        describe('demo', () => {
            let action;

            beforeEach(() => {
                action = local.getDashboardActions().find(x=> x.key === 'demo');
            });

            it('links to the demo select page', () => {
                expect(action.to).toEqual('/demo/select');
            });

            it('uses the cloud download icon', () => {
                expect(action.icon).toEqual('cloud-download-alt');
            });
        });
    });
});
