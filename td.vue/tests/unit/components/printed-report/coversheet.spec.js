import { shallowMount, createLocalVue } from '@vue/test-utils';

import TdCoverSheet from '@/components/printed-report/Coversheet.vue';

describe('components/printed-report/Coversheet.vue', () => {
    let summary, wrapper;

    const getSummary = () => ({
        title: 'My Awesome Model',
        owner: 'Bob',
        reviewer: 'Marley',
        contributors: ['Alice', 'Babs'],
        branding: true
    });

    const setup = (data) => {
        const localVue = createLocalVue();
        wrapper = shallowMount(TdCoverSheet, {
            localVue,
            propsData: {
                title: data.title,
                owner: data.owner,
                reviewer: data.reviewer,
                contributors: data.contributors,
                branding: data.branding
            },
            mocks: {
                $t: key => key
            }
        });
    };

    describe('with branding', () => {
        beforeEach(() => {
            summary = getSummary();
            setup(summary);
        });

        it('displays the title', () => {
            expect(wrapper.find('h1').text()).toEqual(summary.title);
        });

        it('displays the owner', () => {
            expect(wrapper.find('.td-owner').text())
                .toEqual(`threatmodel.owner: ${summary.owner}`);
        });

        it('displays the reviewer', () => {
            expect(wrapper.find('.td-reviewer').text())
                .toEqual(`threatmodel.reviewer: ${summary.reviewer}`);
        });

        it('displays the contributors', () => {
            expect(wrapper.find('.td-contributors').text())
                .toEqual(`threatmodel.contributors: ${summary.contributors.join(', ')}`);
        });

        it('displays the date generated', () => {
            expect(wrapper.find('.td-date-generated').text())
                .toContain(`report.dateGenerated: `);
        });

        it('displays the brand image', () => {
            expect(wrapper.find('.td-brand-logo').exists())
                .toEqual(true);
        });

        it('displays the brand text', () => {
            expect(wrapper.find('.td-brand-text').text())
                .toEqual('OWASP Threat Dragon');
        });
    });

    describe('without branding', () => {
        beforeEach(() => {
            summary = getSummary();
            summary.branding = false;
            setup(summary);            
        });

        it('hides the brand image', () => {
            expect(wrapper.find('.td-brand-logo').exists())
                .toEqual(false);
        });

        it('hides the brand text', () => {
            expect(wrapper.find('.td-brand-text').exists())
                .toEqual(false);
        });
    });
});
