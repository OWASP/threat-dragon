import { mount } from '@vue/test-utils';
import { h } from 'vue';

import TdDropdown from '@/components/Dropdown.vue';

describe('components/Dropdown.vue', () => {
    let wrapper;

    const mountComponent = (propsData = {}, options = {}) => {
        wrapper = mount(TdDropdown, {
            propsData: {
                text: 'Actions',
                ...propsData
            },
            slots: {
                default: '<button type="button" class="dropdown-action">Action</button>',
                ...options.slots
            }
        });
    };

    const findToggle = () => wrapper.find('.td-dropdown-toggle');

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
        wrapper = null;
    });

    it('displays the toggle text', () => {
        mountComponent();

        expect(findToggle().text()).toEqual('Actions');
    });

    it('has an empty default text value', () => {
        wrapper = mount(TdDropdown);

        expect(findToggle().text()).toEqual('');
    });

    it('supports custom toggle content', () => {
        mountComponent({}, {
            slots: {
                'button-content': '<span class="custom-toggle">Custom</span>'
            }
        });

        expect(wrapper.find('.custom-toggle').text()).toEqual('Custom');
    });

    it('opens and closes the menu from the toggle', async () => {
        mountComponent();

        await findToggle().trigger('click');
        expect(wrapper.find('.td-dropdown-menu').exists()).toEqual(true);
        expect(findToggle().attributes('aria-expanded')).toEqual('true');

        await findToggle().trigger('click');
        expect(wrapper.find('.td-dropdown-menu').exists()).toEqual(false);
        expect(findToggle().attributes('aria-expanded')).toEqual('false');
    });

    it('keeps the menu open when clicking inside the dropdown', async () => {
        mountComponent();

        await findToggle().trigger('click');
        await wrapper.find('.dropdown-action').trigger('click');

        expect(wrapper.find('.td-dropdown-menu').exists()).toEqual(true);
    });

    it('ignores outside click handler events from inside the dropdown', async () => {
        mountComponent();

        await findToggle().trigger('click');
        wrapper.vm.closeDropdownOnOutsideClick({
            target: wrapper.find('.dropdown-action').element
        });
        await wrapper.vm.$nextTick();

        expect(wrapper.find('.td-dropdown-menu').exists()).toEqual(true);
    });

    it('closes the menu when clicking outside the dropdown', async () => {
        mountComponent();

        await findToggle().trigger('click');
        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await wrapper.vm.$nextTick();

        expect(wrapper.find('.td-dropdown-menu').exists()).toEqual(false);
    });

    it('closes the menu when pressing escape', async () => {
        mountComponent();

        await findToggle().trigger('click');
        await wrapper.trigger('keydown.escape');

        expect(wrapper.find('.td-dropdown-menu').exists()).toEqual(false);
    });

    it('passes a close callback to the default slot', async () => {
        mountComponent({}, {
            slots: {
                default: ({ close }) => h(
                    'button',
                    {
                        type: 'button',
                        class: 'slot-close',
                        onClick: close
                    },
                    'Close'
                )
            }
        });

        await findToggle().trigger('click');
        await wrapper.find('.slot-close').trigger('click');

        expect(wrapper.find('.td-dropdown-menu').exists()).toEqual(false);
    });

    it('supports right aligned menus', async () => {
        mountComponent({ right: true });

        await findToggle().trigger('click');

        expect(wrapper.find('.td-dropdown-menu-right').exists()).toEqual(true);
    });

    it('does not right align menus by default', async () => {
        mountComponent();

        await findToggle().trigger('click');

        expect(wrapper.find('.td-dropdown-menu-right').exists()).toEqual(false);
    });

    it('removes the outside click listener on unmount', () => {
        const removeEventListener = jest.spyOn(document, 'removeEventListener');
        mountComponent();
        const outsideClickHandler = wrapper.vm.closeDropdownOnOutsideClick;

        wrapper.destroy();
        wrapper = null;

        expect(removeEventListener).toHaveBeenCalledWith('click', outsideClickHandler);
        removeEventListener.mockRestore();
    });
});
