import { BootstrapVue, BCard } from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import TdExecutiveSummary from '@/components/report/ExecutiveSummary.vue';

describe('components/report/ExecutiveSummary.vue', () => {
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
        localVue.use(BootstrapVue);
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
        const summary = wrapper.findComponent(BCard);
        expect(summary.attributes('header')).toEqual('report.executiveSummary');
    });

    it('displays the description title', () => {
        expect(wrapper.find('.td-description-title').text())
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
        expect(TdExecutiveSummary.computed.threatsTotal.call(propsData))
            .toEqual(11);
    });

    it('counts the mitigated threats', () => {
        expect(TdExecutiveSummary.computed.threatsClosed.call(propsData))
            .toEqual(2);
    });

    it('counts the unmitigated threats', () => {
        expect(TdExecutiveSummary.computed.threatsOpen.call(propsData))
            .toEqual(7);
    });

    it('counts the not applicable threats', () => {
        expect(TdExecutiveSummary.computed.threatsNa.call(propsData))
            .toEqual(2);
    });

    it('gets the data test id from the row item', () => {
        const item = { metric: 'foo' };
        const res = wrapper.vm.getDataTestId(item);
        expect(res['data-test-id']).toEqual(item.metric);
    });
});
