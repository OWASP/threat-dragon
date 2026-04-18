import { mount } from '@vue/test-utils';

import TdFormSelect from '@/components/FormSelect.vue';

describe('components/FormSelect.vue', () => {
    it('selects the option matching the bound value', () => {
        const wrapper = mount(TdFormSelect, {
            propsData: {
                id: 'selector',
                value: 'second',
                options: [
                    { value: 'first', text: 'First' },
                    { value: 'second', text: 'Second' }
                ]
            }
        });

        expect(wrapper.find('select').element.value).toBe('1');
    });

    it('normalizes primitive options and selected values that are not present', () => {
        const wrapper = mount(TdFormSelect, {
            propsData: {
                id: 'selector',
                value: 'missing',
                options: ['First', 'Second']
            }
        });

        const options = wrapper.findAll('option');
        expect(wrapper.find('select').element.value).toBe('');
        expect(options.at(0).text()).toBe('First');
        expect(options.at(1).attributes('value')).toBe('1');
    });

    it('uses labels, disabled options, and blank text for nullish object values', () => {
        const wrapper = mount(TdFormSelect, {
            propsData: {
                options: [
                    { value: null },
                    { value: 'second', label: 'Second', disabled: true }
                ]
            }
        });

        const options = wrapper.findAll('option');
        expect(options.at(0).text()).toBe('');
        expect(options.at(1).text()).toBe('Second');
        expect(options.at(1).element.disabled).toBe(true);
    });

    it('emits the original option value when changed', async () => {
        const value = 'second';
        const wrapper = mount(TdFormSelect, {
            propsData: {
                value: null,
                options: [
                    { value: 'first', text: 'First' },
                    { value, text: 'Second' }
                ]
            }
        });

        await wrapper.find('select').setValue('1');

        expect(wrapper.emitted('input').map(([payload]) => payload)).toContain(value);
        expect(wrapper.emitted('change').map(([payload]) => payload)).toContain(value);
    });
});
