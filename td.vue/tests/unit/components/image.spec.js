import { shallowMount } from '@vue/test-utils';

import TdImage from '@/components/Image.vue';

describe('components/Image.vue', () => {
    it('renders a native image with src and alt text', () => {
        const wrapper = shallowMount(TdImage, {
            propsData: {
                src: 'logo.svg',
                alt: 'Threat Dragon'
            }
        });

        expect(wrapper.element.tagName).toBe('IMG');
        expect(wrapper.attributes('src')).toBe('logo.svg');
        expect(wrapper.attributes('alt')).toBe('Threat Dragon');
    });

    it('does not lazy load by default', () => {
        const wrapper = shallowMount(TdImage, {
            propsData: {
                src: 'logo.svg'
            }
        });

        expect(wrapper.attributes('loading')).toBeUndefined();
    });

    it('uses native lazy loading when requested', () => {
        const wrapper = shallowMount(TdImage, {
            propsData: {
                src: 'thumbnail.jpg',
                lazy: true
            }
        });

        expect(wrapper.attributes('loading')).toBe('lazy');
    });

    it('passes attributes through to the image', () => {
        const wrapper = shallowMount(TdImage, {
            propsData: {
                src: 'thumbnail.jpg'
            },
            attrs: {
                id: 'thumbnail',
                class: 'td-thumbnail'
            }
        });

        expect(wrapper.attributes('id')).toBe('thumbnail');
        expect(wrapper.classes()).toContain('td-thumbnail');
    });
});
