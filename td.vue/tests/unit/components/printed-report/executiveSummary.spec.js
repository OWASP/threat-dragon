import { config } from '@vue/test-utils';

import TdExecutiveSummary from '@/components/printed-report/ExecutiveSummary.vue';
import { createWrapper } from '../../setup/test-utils';

// Disable Vue warnings for the tests
config.global.config.warnHandler = () => null;

/**
 * Vue 3 Migration Tests for ExecutiveSummary.vue
 * 
 * Changes from Vue 2:
 * - Using createWrapper helper for consistent test setup
 * - Added props validation tests for better component API testing
 * - Enhanced DOM element selection with more reliable selectors
 * - Added direct testing of computed properties
 * - Improved test organization with descriptive test groups
 */
describe('components/printed-report/ExecutiveSummary.vue', () => {
    let propsData, wrapper;

    const getData = () => ({
        summary: 'some summary',
        threats: [
            { status: 'Open', severity: 'High' },
            { status: 'Open', severity: 'Medium' },
            { status: 'NotApplicable', severity: 'Low' },
            { status: 'Open', severity: 'Low' },
            { status: 'Open', severity: '' },
            { status: 'Mitigated', severity: '' }
        ]
    });

    // Setup function to create wrapper with consistent configuration
    const setup = (data) => {
        wrapper = createWrapper(TdExecutiveSummary, {
            props: {
                summary: data.summary,
                threats: data.threats
            },
            shallow: true
        });
    };

    describe('Component Props', () => {
        beforeEach(() => {
            propsData = getData();
            setup(propsData);
        });

        it('has the correct props defined', () => {
            // Verify summary prop structure
            expect(TdExecutiveSummary.props.summary).toBeDefined();
            expect(TdExecutiveSummary.props.summary.type).toBe(String);
            expect(TdExecutiveSummary.props.summary.required).toBe(false);
            
            // Verify threats prop structure
            expect(TdExecutiveSummary.props.threats).toBeDefined();
            expect(TdExecutiveSummary.props.threats.type).toBe(Array);
            expect(TdExecutiveSummary.props.threats.required).toBe(true);
        });
    });

    describe('Component Structure', () => {
        beforeEach(() => {
            propsData = getData();
            setup(propsData);
        });

        it('displays the executive summary title', () => {
            const titleElement = wrapper.find('.page-title');
            expect(titleElement.exists()).toBe(true);
            expect(titleElement.text()).toEqual('report.executiveSummary');
        });

        it('displays the description title', () => {
            const descriptionElement = wrapper.find('.td-description');
            expect(descriptionElement.exists()).toBe(true);
            expect(descriptionElement.text()).toEqual('threatmodel.description');
        });

        it('displays the summary', () => {
            const summaryElement = wrapper.find('.td-summary');
            expect(summaryElement.exists()).toBe(true);
            expect(summaryElement.text()).toEqual(propsData.summary);
        });

        it('displays the report summary subtitle', () => {
            const reportSummaryElement = wrapper.find('.td-report-summary');
            expect(reportSummaryElement.exists()).toBe(true);
            expect(reportSummaryElement.text()).toEqual('report.summary');
        });
    });

    describe('Component Methods', () => {
        beforeEach(() => {
            propsData = getData();
            setup(propsData);
        });

        it('gets only the open threats', () => {
            // Test the method directly
            const openThreats = wrapper.vm.getOpenThreats();
            expect(openThreats).toHaveLength(4);
            expect(openThreats.every(threat => threat.status === 'Open')).toBe(true);
        });
    });

    describe('Computed Properties', () => {
        beforeEach(() => {
            propsData = getData();
            setup(propsData);
        });

        it('calculates the total threats correctly', () => {
            // Test computed property directly
            expect(wrapper.vm.total).toBe(6);
            
            // Also verify DOM element
            const totalElement = wrapper.find('.td-summary-total');
            expect(totalElement.exists()).toBe(true);
            expect(totalElement.text()).toBe('6');
        });

        it('calculates the mitigated threats correctly', () => {
            // Test computed property directly
            expect(wrapper.vm.mitigated).toBe(1);
            
            // Also verify DOM element
            const mitigatedElement = wrapper.find('.td-summary-mitigated');
            expect(mitigatedElement.exists()).toBe(true);
            expect(mitigatedElement.text()).toBe('1');
        });

        it('calculates the unmitigated threats correctly', () => {
            // Test computed property directly
            expect(wrapper.vm.notMitigated).toBe(5);
            
            // Also verify DOM element
            const notMitigatedElement = wrapper.find('.td-summary-not-mitigated');
            expect(notMitigatedElement.exists()).toBe(true);
            expect(notMitigatedElement.text()).toBe('5');
        });

        it('calculates the open high severity threats correctly', () => {
            // Test computed property directly
            expect(wrapper.vm.openHigh).toBe(1);
            
            // Also verify DOM element
            const openHighElement = wrapper.find('.td-summary-open-high');
            expect(openHighElement.exists()).toBe(true);
            expect(openHighElement.text()).toBe('1');
        });

        it('calculates the open medium severity threats correctly', () => {
            // Test computed property directly
            expect(wrapper.vm.openMedium).toBe(1);
            
            // Also verify DOM element
            const openMediumElement = wrapper.find('.td-summary-open-medium');
            expect(openMediumElement.exists()).toBe(true);
            expect(openMediumElement.text()).toBe('1');
        });

        it('calculates the open low severity threats correctly', () => {
            // Test computed property directly
            expect(wrapper.vm.openLow).toBe(1);
            
            // Also verify DOM element
            const openLowElement = wrapper.find('.td-summary-open-low');
            expect(openLowElement.exists()).toBe(true);
            expect(openLowElement.text()).toBe('1');
        });

        it('calculates the open unknown severity threats correctly', () => {
            // Test computed property directly
            expect(wrapper.vm.openUnknown).toBe(1);
            
            // Also verify DOM element
            const openUnknownElement = wrapper.find('.td-summary-open-unknown');
            expect(openUnknownElement.exists()).toBe(true);
            expect(openUnknownElement.text()).toBe('1');
        });
    });
});