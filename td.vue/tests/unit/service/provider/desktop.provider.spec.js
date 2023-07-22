import desktop from '@/service/provider/desktop.provider.js';

describe('service/desktop.provider.js', () => {
    describe('getDashboardActions', () => {

        describe('import', () => {
            let action;

            beforeEach(() => {
                action = desktop.getDashboardActions().find(x=> x.key === 'openExisting');
            });

            it('links to the import page', () => {
                expect(action.to).toEqual('/desktop/threatmodel/import');
            });

            it('uses the file-import icon', () => {
                expect(action.icon).toEqual('file-import');
            });
        });

        describe('new', () => {
            let action;

            beforeEach(() => {
                action = desktop.getDashboardActions().find(x=> x.key === 'createNew');
            });

            it('links to the create page', () => {
                expect(action.to).toEqual('/desktop/threatmodel/new');
            });

            it('uses the plus icon', () => {
                expect(action.icon).toEqual('plus');
            });
        });

        describe('demo', () => {
            let action;

            beforeEach(() => {
                action = desktop.getDashboardActions().find(x=> x.key === 'readDemo');
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
