import { mount } from '@vue/test-utils';

import TdFormRadioGroup from '@/components/FormRadioGroup.vue';

describe('components/FormRadioGroup.vue', () => {
    it('checks the radio matching the bound value', () => {
        const wrapper = mount(TdFormRadioGroup, {
            propsData: {
                id: 'status',
                value: 'Open',
                options: [
                    { value: 'Open', text: 'Open' },
                    { value: 'Mitigated', text: 'Mitigated' }
                ]
            }
        });

        expect(wrapper.find('input[value="Open"]').element.checked).toBe(true);
        expect(wrapper.find('input[value="Mitigated"]').element.checked).toBe(false);
    });

    it('renders button radios with stacked and disabled state', () => {
        const wrapper = mount(TdFormRadioGroup, {
            propsData: {
                buttons: true,
                disabled: true,
                stacked: true,
                value: 'Open',
                options: [
                    { value: 'Open', label: 'Open' },
                    { value: 'Mitigated', text: 'Mitigated', disabled: true }
                ]
            }
        });

        expect(wrapper.classes()).toContain('btn-group-toggle');
        expect(wrapper.classes()).toContain('btn-group-vertical');
        expect(wrapper.find('label').classes()).toContain('active');
        expect(wrapper.findAll('input').every(input => input.element.disabled)).toBe(true);
    });

    it('emits input and change when an option is selected', async () => {
        const wrapper = mount(TdFormRadioGroup, {
            propsData: {
                id: 'severity',
                value: 'Low',
                options: ['Low', 'High']
            }
        });

        await wrapper.find('input[value="High"]').setChecked();

        expect(wrapper.emitted('input').map(([payload]) => payload)).toContain('High');
        expect(wrapper.emitted('change').map(([payload]) => payload)).toContain('High');
    });
});
