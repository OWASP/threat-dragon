import gitlab from '@/service/provider/gitlab.provider';

describe('service/provider/bitbucket.provider.js', () => {
    describe('getDashboardActions', () => {

        describe('open existing', () => {
            let action;

            beforeEach(() => {
                action = gitlab.getDashboardActions().find(x => x.key === 'openExisting');
            });

            it('links to the repository page', () => {
                expect(action.to).toEqual('/git/gitlab/repository');
            });

            it('uses the bitbucket icon', () => {
                expect(action.iconPreface).toEqual('fab');
                expect(action.icon).toEqual('gitlab');
            });
        });

        describe('new', () => {
            let action;

            beforeEach(() => {
                action = gitlab.getDashboardActions().find(x => x.key === 'createNew');
            });

            it('links to the repository page', () => {
                expect(action.to).toEqual('/git/gitlab/repository?action=create');
            });

            it('uses the plus icon', () => {
                expect(action.icon).toEqual('plus');
            });
        });

        describe('demo', () => {
            let action;

            beforeEach(() => {
                action = gitlab.getDashboardActions().find(x => x.key === 'readDemo');
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
