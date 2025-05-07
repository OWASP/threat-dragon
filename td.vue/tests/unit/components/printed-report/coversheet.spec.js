import { shallowMount as _shallowMount, config } from '@vue/test-utils';

import TdCoverSheet from '@/components/printed-report/Coversheet.vue';
import { createWrapper } from '../../setup/test-utils';

// Disable Vue warnings for the tests
config.global.config.warnHandler = () => null;

/**
 * Vue 3 Migration Tests for Coversheet.vue
 * 
 * Changes from Vue 2:
 * - Using createWrapper helper for consistent test setup
 * - Improved props testing with direct validation
 * - Enhanced DOM element selection with more reliable selectors
 * - Better testing organization with descriptive test groups
 */
describe('components/printed-report/Coversheet.vue', () => {
    let summary, wrapper;

    const getSummary = () => ({
        title: 'My Awesome Model',
        owner: 'Bob',
        reviewer: 'Marley',
        contributors: ['Alice', 'Babs'],
        branding: true
    });

    // Setup helper function to create wrapper with consistent configuration
    const setup = (data) => {
        wrapper = createWrapper(TdCoverSheet, {
            props: {
                title: data.title,
                owner: data.owner,
                reviewer: data.reviewer,
                contributors: data.contributors,
                branding: data.branding
            },
            shallow: true
        });
    };

    describe('Component Props', () => {
        it('has required props defined correctly', () => {
            // Verify props are defined as expected
            expect(TdCoverSheet.props.title).toBeDefined();
            expect(TdCoverSheet.props.owner).toBeDefined();
            expect(TdCoverSheet.props.reviewer).toBeDefined();
            expect(TdCoverSheet.props.contributors).toBeDefined();
            expect(TdCoverSheet.props.branding).toBeDefined();
            
            // Check default value for branding prop
            expect(TdCoverSheet.props.branding.default).toBe(true);
        });
    });

    describe('with branding enabled', () => {
        beforeEach(() => {
            summary = getSummary();
            setup(summary);
        });

        it('displays the title', () => {
            const titleElement = wrapper.find('h1.td-report-title');
            expect(titleElement.exists()).toBe(true);
            expect(titleElement.text()).toEqual(summary.title);
        });

        it('displays the owner', () => {
            const ownerElement = wrapper.find('.td-owner');
            expect(ownerElement.exists()).toBe(true);
            expect(ownerElement.text()).toEqual(`threatmodel.owner: ${summary.owner}`);
        });

        it('displays the reviewer', () => {
            const reviewerElement = wrapper.find('.td-reviewer');
            expect(reviewerElement.exists()).toBe(true);
            expect(reviewerElement.text()).toEqual(`threatmodel.reviewer: ${summary.reviewer}`);
        });

        it('displays the contributors', () => {
            const contributorsElement = wrapper.find('.td-contributors');
            expect(contributorsElement.exists()).toBe(true);
            expect(contributorsElement.text())
                .toEqual(`threatmodel.contributors: ${summary.contributors.join(', ')}`);
        });

        it('displays the date generated', () => {
            const dateElement = wrapper.find('.td-date-generated');
            expect(dateElement.exists()).toBe(true);
            expect(dateElement.text()).toContain(`report.dateGenerated: `);
        });

        it('displays the brand image', () => {
            const logoElement = wrapper.find('.td-brand-logo');
            expect(logoElement.exists()).toBe(true);
        });

        it('displays the brand text', () => {
            const brandTextElement = wrapper.find('.td-brand-text');
            expect(brandTextElement.exists()).toBe(true);
            expect(brandTextElement.text()).toEqual('OWASP Threat Dragon');
        });
    });

    describe('with branding disabled', () => {
        beforeEach(() => {
            summary = getSummary();
            summary.branding = false;
            setup(summary);            
        });

        it('hides the brand image', () => {
            const logoElement = wrapper.find('.td-brand-logo');
            expect(logoElement.exists()).toBe(false);
        });

        it('hides the brand text', () => {
            const brandTextElement = wrapper.find('.td-brand-text');
            expect(brandTextElement.exists()).toBe(false);
        });
    });
});