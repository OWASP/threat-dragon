import { BDropdown, BDropdownItem, createBootstrap } from 'bootstrap-vue-next';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import Vuex from 'vuex';

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
        localVue.use(createBootstrap());

        mockStore = new Vuex.Store({
            state: { locale: { locale: storeLocale }},
            actions: { [LOCALE_SELECTED]: () => {} },
            dispatch: jest.fn()
        });

        wrapper = shallowMount(LocaleSelect, {
            localVue,
            i18n,
            store: mockStore
        });
    };
    const findLocaleItem = (label) => wrapper.findAllComponents(BDropdownItem).filter((c) => c.text() === label).at(0);

    afterEach(() => {
        jest.clearAllMocks();
        wrapper = null;
        mockStore = null;
        i18n = null;
    });


    describe('default locale', () => {
        beforeEach(() => {
            mountComponent();
        });

        it('renders the component', () => {
            expect(wrapper.findComponent(BDropdown).exists()).toEqual(true);
        });

        it('displays the current locale', () => {
            expect(wrapper.findComponent(BDropdown).attributes('text')).toEqual(LOCALE_LABELS.en);
        });

        it.each([
            ['en', LOCALE_LABELS.en],
            ['de', LOCALE_LABELS.de]
        ])('has an option for %s', (_localeCode, localeLabel) => {
            expect(findLocaleItem(localeLabel).exists()).toEqual(true);
        });


        describe('updates', () => {
            beforeEach(() => {
                dispatchSpy = jest.spyOn(mockStore, 'dispatch');
            });

            it.each([
                ['de', LOCALE_LABELS.de],
                ['en', LOCALE_LABELS.en]
            ])('updates the locale to %s', async (localeCode) => {
                wrapper.vm.updateLocale(localeCode);

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
            expect(wrapper.findComponent(BDropdown).attributes('text')).toEqual('test');
        });
    });

});
