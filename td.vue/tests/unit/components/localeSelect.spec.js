import { createLocalVue, mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import Vuex from 'vuex';

import TdDropdown from '@/components/Dropdown.vue';
import LocaleSelect from '@/components/LocaleSelect.vue';
import { LOCALE_SELECTED } from '@/store/actions/locale.js';

describe('components/LocaleSelect.vue', () => {
    let i18n, mockStore, wrapper, dispatchSpy;
    const MESSAGES = {
        en: { hello: 'Hello World' },
        de: { hello: 'Hallo Welt' }
    };
    const LOCALE_LABELS = {
        en: 'English',
        de: 'Deutsch'
    };
    const mountComponent = (storeLocale = 'en') => {
        const localVue = createLocalVue();
        i18n = createI18n({
            locale: 'en',
            messages: MESSAGES
        });

        localVue.use(Vuex);
        localVue.use(i18n);

        mockStore = new Vuex.Store({
            state: { locale: { locale: storeLocale }},
            actions: { [LOCALE_SELECTED]: () => {} },
            dispatch: jest.fn()
        });

        wrapper = mount(LocaleSelect, {
            localVue,
            i18n,
            store: mockStore
        });
    };
    const findToggle = () => wrapper.find('.td-dropdown-toggle');
    const openDropdown = async () => {
        await findToggle().trigger('click');
    };
    const findLocaleItem = (label) => wrapper.findAll('.td-dropdown-item').filter((c) => c.text() === label).at(0);

    afterEach(() => {
        jest.clearAllMocks();
        if (wrapper) {
            const dropdown = wrapper.findComponent(TdDropdown);
            if (dropdown.exists()) {
                document.removeEventListener('click', dropdown.vm.closeDropdownOnOutsideClick);
            }
        }
        wrapper = null;
        mockStore = null;
        i18n = null;
    });


    describe('default locale', () => {
        beforeEach(() => {
            mountComponent();
        });

        it('renders the component', () => {
            expect(wrapper.find('.td-locale-select').exists()).toEqual(true);
        });

        it('displays the current locale', () => {
            expect(findToggle().text()).toEqual(LOCALE_LABELS.en);
        });

        it.each([
            ['en', LOCALE_LABELS.en],
            ['de', LOCALE_LABELS.de]
        ])('has an option for %s', async (_localeCode, localeLabel) => {
            await openDropdown();

            expect(findLocaleItem(localeLabel).exists()).toEqual(true);
        });

        it('closes the options when clicking outside the dropdown', async () => {
            await openDropdown();
            document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            await wrapper.vm.$nextTick();

            expect(wrapper.find('.td-dropdown-menu').exists()).toEqual(false);
        });


        describe('updates', () => {
            beforeEach(() => {
                dispatchSpy = jest.spyOn(mockStore, 'dispatch');
            });

            it.each([
                ['de', LOCALE_LABELS.de],
                ['en', LOCALE_LABELS.en]
            ])('updates the locale to %s', async (localeCode, localeLabel) => {
                await openDropdown();
                await findLocaleItem(localeLabel).trigger('click');

                expect(dispatchSpy).toHaveBeenCalledTimes(1);
                expect(dispatchSpy).toHaveBeenCalledWith(LOCALE_SELECTED, localeCode);
            });
        });

    });

    describe('different locale', () => {
        beforeEach(() => {
            mountComponent('test');
        });

        it('sets the locale based on the state', () => {
            expect(i18n.locale).toEqual('test');
        });

        it('uses the locale code text for unknown locales', () => {
            expect(findToggle().text()).toEqual('test');
        });
    });

});
