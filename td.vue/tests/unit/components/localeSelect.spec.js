import { BDropdown, BDropdownItem, BootstrapVue } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';

import LocaleSelect from '@/components/LocaleSelect.vue';
import { LOCALE_SELECTED } from '@/store/actions/locale.js';

describe('components/LocaleSelect.vue', () => {
    let mockStore, wrapper;

    describe('default locale', () => {
        beforeEach(() => {
            const localVue = createLocalVue();
            localVue.use(Vuex);
            localVue.use(VueI18n);
            localVue.use(BootstrapVue);

            const i18n = new VueI18n({
                locale: 'eng',
                messages: {
                    eng: { hello: 'Hello World' },
                    deu: { hello: 'Hallo Welt' }
                }
            });

            mockStore = new Vuex.Store({
                state: { locale: { locale: 'eng' }},
                actions: { [LOCALE_SELECTED]: () => {} },
                dispatch: () => {}
            });

            wrapper = shallowMount(LocaleSelect, {
                localVue,
                i18n,
                store: mockStore
            });
        });

        it('renders the component', () => {
            expect(wrapper.findComponent(BDropdown).exists()).toEqual(true);
        });

        it('displays the current locale', () => {
            expect(wrapper.findComponent(BDropdown).attributes('text')).toEqual('English');
        });

        it('has an option for eng', () => {
            expect(wrapper.findAllComponents(BDropdownItem)
                .filter((c) => c.text() === 'English').exists()
            ).toEqual(true);
        });

        it('has an option for deu', () => {
            expect(wrapper.findAllComponents(BDropdownItem)
                .filter((c) => c.text() === 'Deutsch').exists()
            ).toEqual(true);
        });

        describe('updates', () => {
            beforeEach(() => {
                mockStore.dispatch = jest.fn();
            });

            it('updates the locale to deu', async () => {
                await wrapper.findAllComponents(BDropdownItem)
                    .filter(c => c.text() === 'Deutsch')
                    .at(0)
                    .trigger('click');

                expect(mockStore.dispatch).toHaveBeenCalledWith(LOCALE_SELECTED, 'deu');
            });

            it('updates the locale to eng', async () => {
                await wrapper.findAllComponents(BDropdownItem)
                    .filter(c => c.text() === 'English')
                    .at(0)
                    .trigger('click');

                expect(mockStore.dispatch).toHaveBeenCalledWith(LOCALE_SELECTED, 'eng');
            });

        });
    });

    describe('different locale', () => {
        let i18n;
        beforeEach(() => {
            const localVue = createLocalVue();
            localVue.use(Vuex);
            localVue.use(VueI18n);
            localVue.use(BootstrapVue);

            i18n = new VueI18n({
                locale: 'eng',
                messages: {
                    eng: { hello: 'Hello World' },
                    deu: { hello: 'Hallo Welt' }
                }
            });

            mockStore = new Vuex.Store({
                state: { locale: { locale: 'test' }},
                actions: { [LOCALE_SELECTED]: () => {} },
                dispatch: () => {}
            });

            wrapper = shallowMount(LocaleSelect, {
                localVue,
                i18n,
                store: mockStore
            });
        });

        it('sets the locale based on the state', () => {
            expect(i18n.locale).toEqual('test');
        });
    });
});
