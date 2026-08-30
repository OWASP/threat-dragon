import { mount } from '@vue/test-utils';

import TdSpinner from '@/components/Spinner.vue';

describe('components/Spinner.vue', () => {
    it('identifies itself as a status indicator', () => {
        const wrapper = mount(TdSpinner);

        expect(wrapper.attributes('role')).toBe('status');
    });

    it('uses the default loading label', () => {
        const wrapper = mount(TdSpinner);

        expect(wrapper.attributes('aria-label')).toBe('Loading');
    });

    it('accepts a custom loading label', () => {
        const wrapper = mount(TdSpinner, {
            propsData: {
                label: 'Saving'
            }
        });

        expect(wrapper.attributes('aria-label')).toBe('Saving');
    });

    it('renders three animated dots', () => {
        const wrapper = mount(TdSpinner);

        expect(wrapper.findAll('.td-spinner-dot')).toHaveLength(3);
    });
});
