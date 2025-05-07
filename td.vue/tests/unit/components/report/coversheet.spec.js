import { mount } from '@vue/test-utils';
import TdCoverSheet from '@/components/report/Coversheet.vue';

// Simple implementation of the TdThreatModelSummaryCard component
const TdThreatModelSummaryCard = {
    template: '<div data-testid="threat-model-summary"></div>',
    props: ['titlePrefix']
};

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
        wrapper = mount(TdCoverSheet, {
            props: {
                title: data.title,
                owner: data.owner,
                reviewer: data.reviewer,
                contributors: data.contributors,
                branding: data.branding
            },
            global: {
                stubs: {},
                components: {
                    // Only register components that aren't already registered globally
                    'td-threat-model-summary-card': TdThreatModelSummaryCard
                },
                mocks: {
                    $t: (key) => key
                }
            }
        });
        return { wrapper };
    };

    describe('with branding', () => {
        beforeEach(() => {
            summary = getSummary();
            setup(summary);
        });

        it('displays the branding when branding is true', () => {
            expect(wrapper.find('[data-testid="brand-text"]').exists()).toBe(true);
        });

        it('displays the summary card', () => {
            expect(wrapper.find('[data-testid="threat-model-summary"]').exists()).toBe(true);
        });
    });

    describe('without branding', () => {
        beforeEach(() => {
            summary = getSummary();
            summary.branding = false;
            setup(summary);            
        });

        it('hides the brand text when branding is false', () => {
            expect(wrapper.find('[data-testid="brand-text"]').exists()).toBe(false);
        });

        it('displays the summary card', () => {
            expect(wrapper.find('[data-testid="threat-model-summary"]').exists()).toBe(true);
        });
    });
});
