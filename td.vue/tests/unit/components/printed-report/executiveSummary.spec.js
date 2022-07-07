import { shallowMount, createLocalVue } from '@vue/test-utils';

import TdExecutiveSummary from '@/components/printed-report/ExecutiveSummary.vue';

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

    const setup = (data) => {
        const localVue = createLocalVue();
        wrapper = shallowMount(TdExecutiveSummary, {
            localVue,
            propsData: {
                summary: data.summary,
                threats: data.threats
            },
            mocks: {
                $t: t => t
            }
        });
    };

    beforeEach(() => {
        propsData = getData();
        setup(propsData);
    });

    it('displays the executive summary title', () => {
        expect(wrapper.find('.page-title').text())
            .toEqual('report.executiveSummary');
    });

    it('displays the description title', () => {
        expect(wrapper.find('.td-description').text())
            .toEqual('threatmodel.description');
    });

    it('displays the summary', () => {
        expect(wrapper.find('.td-summary').text())
            .toEqual(propsData.summary);
    });

    it('displays the report summary subtitle', () => {
        expect(wrapper.find('.td-report-summary').text())
            .toEqual('report.summary');
    });

    it('gets only the open threats', () => {
        expect(wrapper.vm.getOpenThreats()).toHaveLength(4);
    });

    it('counts the total threats', () => {
        expect(wrapper.find('.td-summary-total').text())
            .toEqual('6');
    });

    it('counts the mitigated threats', () => {
        expect(wrapper.find('.td-summary-mitigated').text())
            .toEqual('1');
    });

    it('counts the unmitigated threats', () => {
        expect(wrapper.find('.td-summary-not-mitigated').text())
            .toEqual('5');
    });

    it('counts the open high severity threats', () => {
        expect(wrapper.find('.td-summary-open-high').text())
            .toEqual('1');
    });

    it('counts the open medium severity threats', () => {
        expect(wrapper.find('.td-summary-open-medium').text())
            .toEqual('1');
    });

    it('counts the open low severity threats', () => {
        expect(wrapper.find('.td-summary-open-low').text())
            .toEqual('1');
    });

    it('counts the open unknown severity threats', () => {
        expect(wrapper.find('.td-summary-open-unknown').text())
            .toEqual('1');
    });
});
