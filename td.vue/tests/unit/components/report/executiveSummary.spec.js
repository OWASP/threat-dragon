import { mount } from '@vue/test-utils';
import bootstrapVueNext from '@/plugins/bootstrap-vue-next';
import TdExecutiveSummary from '@/components/report/ExecutiveSummary.vue';

describe('components/report/ExecutiveSummary.vue', () => {
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

    beforeEach(() => {
        propsData = getData();
        wrapper = mount(TdExecutiveSummary, {
            global: {
                plugins: [bootstrapVueNext],
                mocks: {
                    $t: t => t
                }
            },
            props: {
                summary: propsData.summary,
                threats: propsData.threats
            }
        });
    });

    it('has the correct component name', () => {
        expect(wrapper.vm.$options.name).toEqual('TdExecutiveSummary');
    });

    it('renders the component', () => {
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.classes()).toContain('td-executive-summary');
    });

    it('displays the summary text', () => {
        const summary = wrapper.find('p');
        expect(summary.text()).toEqual(propsData.summary);
    });

    it('gets only the open threats', () => {
        expect(wrapper.vm.getOpenThreats()).toHaveLength(4);
    });

    it('counts the total threats', () => {
        expect(wrapper.vm.total).toEqual(6);
    });

    it('counts the mitigated threats', () => {
        expect(wrapper.vm.mitigated).toEqual(1);
    });

    it('counts the unmitigated threats', () => {
        expect(wrapper.vm.notMitigated).toEqual(5);
    });

    it('gets the data test id from the row item', () => {
        const item = { name: 'foo' };
        const res = wrapper.vm.getDataTestId(item);
        expect(res['data-test-id']).toEqual(item.name);
    });
});
