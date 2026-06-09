import { mount, shallowMount } from '@vue/test-utils';

import TdDropdown from '@/components/Dropdown.vue';
import TdFormRadioGroup from '@/components/FormRadioGroup.vue';
import TdThreatStatusSelector from '@/components/ThreatStatusSelector.vue';

describe('components/ThreatStatusSelector.vue', () => {
    const getWrapper = (value, propsData = {}) => shallowMount(TdThreatStatusSelector, {
        propsData: {
            value,
            ...propsData
        },
        mocks: {
            $t: key => key
        }
    });

    it('renders primary statuses as radio buttons', () => {
        const radioGroup = getWrapper('Open').findComponent(TdFormRadioGroup);
        expect(radioGroup.props('options')).toEqual([
            { value: 'NotApplicable', text: 'threats.status.notApplicable' },
            { value: 'Open', text: 'threats.status.open' }
        ]);
    });

    it('renders treatments in a dropdown', () => {
        const dropdown = getWrapper('Open').findComponent(TdDropdown);
        expect(dropdown.exists()).toEqual(true);
    });

    it('shows Mitigated as the default treatment text', () => {
        expect(getWrapper('Open').findComponent(TdDropdown).props('text'))
            .toEqual('threats.status.mitigated');
    });

    it('shows the selected treatment text', () => {
        expect(getWrapper('Eliminated').findComponent(TdDropdown).props('text'))
            .toEqual('threats.status.eliminated');
    });

    it('marks the treatment dropdown active for resolved statuses', () => {
        expect(getWrapper('Accepted').findComponent(TdDropdown).classes()).toContain('active');
    });

    it('does not mark the treatment dropdown active for primary statuses', () => {
        expect(getWrapper('Open').findComponent(TdDropdown).classes()).not.toContain('active');
    });

    it('uses status as the default id', () => {
        expect(getWrapper('Open').attributes('id')).toEqual('status');
    });

    it('supports a custom id', () => {
        expect(getWrapper('Open', { id: 'suggested-status' }).attributes('id')).toEqual('suggested-status');
    });

    it('emits input when a primary status is selected', () => {
        const wrapper = getWrapper('Mitigated');
        wrapper.findComponent(TdFormRadioGroup).vm.$emit('input', 'Open');
        expect(wrapper.emitted('input')[0]).toEqual(['Open']);
    });

    it('emits input and change when a status is selected', () => {
        const wrapper = getWrapper('Open');
        wrapper.vm.selectStatus('Avoided');
        expect(wrapper.emitted('input')[0]).toEqual(['Avoided']);
        expect(wrapper.emitted('change')[0]).toEqual(['Avoided']);
    });

    it('selects a treatment from the dropdown menu', async () => {
        const wrapper = mount(TdThreatStatusSelector, {
            propsData: { value: 'Open' },
            mocks: { $t: key => key }
        });

        await wrapper.find('.td-dropdown-toggle').trigger('click');
        await wrapper.findAll('.td-dropdown-item').at(4).trigger('click');

        expect(wrapper.emitted('input')[0]).toEqual(['Eliminated']);
    });
});
