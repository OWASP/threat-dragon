import { BDropdown, BDropdownItem, BootstrapVue } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';

import LocaleSelect from '@/components/LocaleSelect.vue';
import { LOCALE_SELECTED } from '@/store/actions/locale.js';

describe('components/LocaleSelect.vue', () => {
    let mockStore, wrapper;

    beforeEach(() => {
        const localVue = createLocalVue();
        localVue.use(Vuex);
        localVue.use(VueI18n);
        localVue.use(BootstrapVue);

        const i18n = new VueI18n({
            locale: 'en',
            messages: {
                en: { hello: 'Hello World' },
                de: { hello: 'Hallo Welt' }
            }
        });

        mockStore = new Vuex.Store({
            state: { locale: { locale: 'en' }},
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
        expect(wrapper.findComponent(BDropdown).attributes('text')).toEqual('en');
    });

    it('has an option for en', () => {
        expect(wrapper.findAllComponents(BDropdownItem)
            .filter((c) => c.text() === 'en').exists()
        ).toEqual(true);
    });

    it('has an option for de', () => {
        expect(wrapper.findAllComponents(BDropdownItem)
            .filter((c) => c.text() === 'de').exists()
        ).toEqual(true);
    });

    describe('updates', () => {
        beforeEach(() => {
            mockStore.dispatch = jest.fn();
        });

        it('updates the locale to de', async () => {
            await wrapper.findAllComponents(BDropdownItem)
                .filter(c => c.text() === 'de')
                .at(0)
                .trigger('click');
            
            expect(mockStore.dispatch).toHaveBeenCalledWith(LOCALE_SELECTED, 'de');
        });

        it('updates the locale to en', async () => {
            await wrapper.findAllComponents(BDropdownItem)
                .filter(c => c.text() === 'en')
                .at(0)
                .trigger('click');
            
            expect(mockStore.dispatch).toHaveBeenCalledWith(LOCALE_SELECTED, 'en');
        });
    });
});
