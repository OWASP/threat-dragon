import { shallowMount } from '@vue/test-utils';

import TdHero from '@/components/Hero.vue';

describe('components/Hero.vue', () => {
    it('renders the default slot', () => {
        const wrapper = shallowMount(TdHero, {
            slots: {
                default: '<p>Hello, world!</p>'
            }
        });

        expect(wrapper.find('p').text()).toBe('Hello, world!');
    });

    it('renders an optional header', () => {
        const wrapper = shallowMount(TdHero, {
            propsData: {
                header: 'Welcome'
            }
        });

        expect(wrapper.find('h1.td-hero-title').text()).toBe('Welcome');
    });

    it('passes id and class through to the semantic wrapper', () => {
        const wrapper = shallowMount(TdHero, {
            propsData: {
                id: 'welcome-jumbotron'
            },
            attrs: {
                class: 'text-center'
            }
        });

        expect(wrapper.element.tagName).toBe('SECTION');
        expect(wrapper.attributes('id')).toBe('welcome-jumbotron');
        expect(wrapper.classes()).toContain('td-hero');
        expect(wrapper.classes()).toContain('text-center');
    });
});
