import { BootstrapVue } from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import TdCoverSheet from '@/components/report/Coversheet.vue';
import TdThreatModelSummaryCard from '@/components/ThreatModelSummaryCard.vue';

describe('components/report/Coversheet.vue', () => {
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
        localVue.use(BootstrapVue);
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

        it('displays the branding', () => {
            expect(wrapper.find('.td-brand-text').text()).toContain('OWASP Threat Dragon');
        });

        it('displays the summary card', () => {
            expect(wrapper.findComponent(TdThreatModelSummaryCard).exists())
                .toEqual(true);
        });
    });

    describe('without branding', () => {
        beforeEach(() => {
            summary = getSummary();
            summary.branding = false;
            setup(summary);            
        });

        it('hides the brand text', () => {
            expect(wrapper.find('.td-brand-text').exists())
                .toEqual(false);
        });

        it('displays the summary card', () => {
            expect(wrapper.findComponent(TdThreatModelSummaryCard).exists())
                .toEqual(true);
        });
    });

    
});
