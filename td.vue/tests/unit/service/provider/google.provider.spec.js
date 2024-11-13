import google from '@/service/provider/google.provider.js';

describe('service/google.provider.js', () => {
    describe('getDashboardActions', () => {

        describe('open existing', () => {
            let action;

            beforeEach(() => {
                action = google.getDashboardActions().find(x => x.key === 'openExisting');
            });

            it('links to the folder page', () => {
                expect(action.to).toEqual('/google/google/folder');
            });

            it('uses the Google Drive icon', () => {
                expect(action.iconPreface).toEqual('fab');
                expect(action.icon).toEqual('google-drive');
            });
        });

        describe('new', () => {
            let action;

            beforeEach(() => {
                action = google.getDashboardActions().find(x => x.key === 'createNew');
            });

            it('links to the folder creation page', () => {
                expect(action.to).toEqual('/google/google/folder?action=create');
            });

            it('uses the plus icon', () => {
                expect(action.icon).toEqual('plus');
            });
        });

        describe('demo', () => {
            let action;

            beforeEach(() => {
                action = google.getDashboardActions().find(x => x.key === 'readDemo');
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
