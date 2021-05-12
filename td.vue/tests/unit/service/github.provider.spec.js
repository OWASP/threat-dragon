import github from '@/service/github.provider.js';

describe('service/github.provider.js', () => {
    describe('getDashboardActions', () => {

        describe('open existing', () => {
            let action;

            beforeEach(() => {
                action = github.getDashboardActions().find(x=> x.description.startsWith('Open'));
            });

            it('links to the repository page', () => {
                expect(action.to).toEqual('/repository');
            });

            it('uses the github icon', () => {
                expect(action.iconPreface).toEqual('fab');
                expect(action.icon).toEqual('github');
            });
        });

        describe('new', () => {
            let action;

            beforeEach(() => {
                action = github.getDashboardActions().find(x=> x.description.startsWith('Create'));
            });

            it('links to the repository page', () => {
                expect(action.to).toEqual('/repository');
            });

            it('uses the plus icon', () => {
                expect(action.icon).toEqual('plus');
            });
        });

        describe('download', () => {
            let action;

            beforeEach(() => {
                action = github.getDashboardActions().find(x=> x.description.startsWith('Download'));
            });

            xit('links to the home edit page', () => {
                expect(action.to).toEqual('/repository');
            });

            it('uses the cloud download icon', () => {
                expect(action.icon).toEqual('cloud-download-alt');
            });
        });
    });
});
