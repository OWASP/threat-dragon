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
            { status: 'NotApplicable', severity: 'Critical' },
            { status: 'Open', severity: 'Critical' },
            { status: 'Open', severity: 'Critical' },
            { status: 'Open', severity: 'Low' },
            { status: 'Open', severity: '' },
            { status: 'Mitigated', severity: '' },
            { status: 'Mitigated', severity: 'TBD' },
            { status: 'Open', severity: 'TBD' }
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

    it('total of open threats', () => {
        expect(wrapper.vm.getOpenThreats()).toHaveLength(7);
    });

    it('counts the total threats', () => {
        expect(wrapper.find('.td-summary-total').text())
            .toEqual('11');
    });

    it('counts the mitigated threats', () => {
        expect(wrapper.find('.td-summary-mitigated').text())
            .toEqual('2');
    });

    it('counts the unmitigated threats', () => {
        expect(wrapper.find('.td-summary-not-mitigated').text())
            .toEqual('7');
    });

    it('counts the not applicable threats', () => {
        expect(wrapper.find('.td-summary-not-applicable').text())
            .toEqual('2');
    });

    it('counts the open critical severity threats', () => {
        expect(wrapper.find('.td-summary-open-critical').text())
            .toEqual('2');
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

    it('counts the open TBD severity threats', () => {
        expect(wrapper.find('.td-summary-open-tbd').text())
            .toEqual('1');
    });

    it('counts the open unknown severity threats', () => {
        expect(wrapper.find('.td-summary-open-unknown').text())
            .toEqual('1');
    });
});
