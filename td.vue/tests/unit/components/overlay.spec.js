import { mount } from '@vue/test-utils';

import TdOverlay from '@/components/Overlay.vue';

describe('components/Overlay.vue', () => {
    it('renders the default slot', () => {
        const wrapper = mount(TdOverlay, {
            slots: {
                default: '<button>Save</button>'
            }
        });

        expect(wrapper.find('button').text()).toBe('Save');
    });

    it('marks content as busy when shown', () => {
        const wrapper = mount(TdOverlay, {
            propsData: {
                show: true
            }
        });

        expect(wrapper.attributes('aria-busy')).toBe('true');
    });

    it('does not render the spinner when hidden', () => {
        const wrapper = mount(TdOverlay);

        expect(wrapper.find('[role="status"]').exists()).toBe(false);
    });

    it('uses the small spinner style when requested', () => {
        const wrapper = mount(TdOverlay, {
            propsData: {
                show: true,
                small: true
            }
        });

        expect(wrapper.find('.td-overlay-spinner-small').exists()).toBe(true);
    });
});
