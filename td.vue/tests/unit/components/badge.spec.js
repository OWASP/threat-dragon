import { shallowMount } from '@vue/test-utils';

import TdBadge from '@/components/Badge.vue';

describe('components/Badge.vue', () => {
    it('renders its content in a native span', () => {
        const wrapper = shallowMount(TdBadge, {
            slots: {
                default: 'CIA'
            }
        });

        expect(wrapper.element.tagName).toBe('SPAN');
        expect(wrapper.text()).toBe('CIA');
    });

    it('uses the Threat Dragon badge style', () => {
        const wrapper = shallowMount(TdBadge);

        expect(wrapper.classes()).toContain('td-badge');
    });

    it('passes attributes through to the native span', () => {
        const wrapper = shallowMount(TdBadge, {
            attrs: {
                id: 'model-type',
                class: 'model-type-badge'
            }
        });

        expect(wrapper.attributes('id')).toBe('model-type');
        expect(wrapper.classes()).toContain('model-type-badge');
    });
});
