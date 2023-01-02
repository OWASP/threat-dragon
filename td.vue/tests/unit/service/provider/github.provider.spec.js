import github from '@/service/provider/github.provider.js';

describe('service/github.provider.js', () => {
    describe('getDashboardActions', () => {

        describe('open existing', () => {
            let action;

            beforeEach(() => {
                action = github.getDashboardActions().find(x=> x.key === 'openExisting');
            });

            it('links to the repository page', () => {
                expect(action.to).toEqual('/git/github/repository');
            });

            it('uses the github icon', () => {
                expect(action.iconPreface).toEqual('fab');
                expect(action.icon).toEqual('github');
            });
        });

        describe('new', () => {
            let action;

            beforeEach(() => {
                action = github.getDashboardActions().find(x=> x.key === 'createNew');
            });

            it('links to the repository page', () => {
                expect(action.to).toEqual('/git/github/repository?action=create');
            });

            it('uses the plus icon', () => {
                expect(action.icon).toEqual('plus');
            });
        });

        describe('demo', () => {
            let action;

            beforeEach(() => {
                action = github.getDashboardActions().find(x=> x.key === 'readDemo');
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
