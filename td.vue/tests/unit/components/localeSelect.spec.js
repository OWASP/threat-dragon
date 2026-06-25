import { createLocalVue, mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import Vuex from 'vuex';

import TdDropdown from '@/components/Dropdown.vue';
import LocaleSelect from '@/components/LocaleSelect.vue';
import { LOCALE_SELECTED } from '@/store/actions/locale.js';
import { isDesktopApp } from '@/service/environment';

jest.mock('@/service/environment');

const ALL_LOCALE_LABELS = {
    ar: 'العربية',
    de: 'Deutsch',
    el: 'Ελληνικά',
    en: 'English',
    es: 'Español',
    fi: 'Suomi',
    fr: 'Français',
    hi: 'हिंदी',
    id: 'Bahasa Indonesia',
    ja: '日本語',
    ms: 'Malay',
    pt: 'Português',
    'pt-BR': 'Português (Brasil)',
    zh: '中文'
};

const ALL_LOCALES = Object.keys(ALL_LOCALE_LABELS);

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
    const mountComponent = (storeLocale = 'en', availableLocales = ['en', 'de']) => {
        const localVue = createLocalVue();
        i18n = createI18n({
            locale: 'en',
            messages: MESSAGES
        });

        localVue.use(Vuex);
        localVue.use(i18n);

        mockStore = new Vuex.Store({
            state: { locale: { locale: storeLocale }, config: { config: null } },
            getters: { availableLocales: () => availableLocales },
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
        delete window.electronAPI;
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

        it('uses the locale code text for unknown locales', () => {
            expect(findToggle().text()).toEqual('test');
        });
    });

    describe('availableLocales computed', () => {
        it('initializes filteredLocales from availableLocales on creation', () => {
            mountComponent('en', ['en', 'de', 'fr']);
            expect(wrapper.vm.filteredLocales).toEqual(['en', 'de', 'fr']);
        });

        it('falls back to i18n.availableLocales when store getter returns falsy', () => {
            mountComponent('en', null);
            expect(wrapper.vm.availableLocales).toEqual(expect.arrayContaining(['en', 'de']));
        });
    });

    describe('getLanguageName — all supported locales', () => {
        beforeEach(() => {
            mountComponent('en', ALL_LOCALES);
        });

        it.each(
            ALL_LOCALES.map(code => [code, ALL_LOCALE_LABELS[code]])
        )('returns correct display name for %s', (_code, label) => {
            expect(wrapper.vm.getLanguageName(_code)).toBe(label);
        });

        it('returns locale code for unknown locale', () => {
            expect(wrapper.vm.getLanguageName('unknown')).toBe('unknown');
        });
    });

    describe('getSearchableText', () => {
        beforeEach(() => {
            mountComponent('en', ALL_LOCALES);
        });

        it('maps non-latin script names to latin search terms', () => {
            const vm = wrapper.vm;
            expect(vm.getSearchableText('العربية')).toBe('arabic');
            expect(vm.getSearchableText('ελληνικά')).toBe('greek');
            expect(vm.getSearchableText('हिंदी')).toBe('hindi');
            expect(vm.getSearchableText('日本語')).toBe('japanese');
            expect(vm.getSearchableText('中文')).toBe('chinese');
        });

        it('returns the name as-is for latin script names', () => {
            const vm = wrapper.vm;
            expect(vm.getSearchableText('English')).toBe('English');
            expect(vm.getSearchableText('Deutsch')).toBe('Deutsch');
        });
    });

    describe('filterLocales', () => {
        beforeEach(() => {
            mountComponent('en', ALL_LOCALES);
        });

        it('shows all locales when search query is empty', () => {
            wrapper.vm.searchQuery = '';
            wrapper.vm.filterLocales();
            expect(wrapper.vm.filteredLocales).toEqual(ALL_LOCALES);
        });

        it('filters by locale code', () => {
            wrapper.vm.searchQuery = 'pt';
            wrapper.vm.filterLocales();
            expect(wrapper.vm.filteredLocales).toEqual(['pt', 'pt-BR']);
        });

        it('filters by language name', () => {
            wrapper.vm.searchQuery = 'english';
            wrapper.vm.filterLocales();
            expect(wrapper.vm.filteredLocales).toEqual(['en']);
        });

        it('prioritises locales whose name starts with query', () => {
            wrapper.vm.searchQuery = 'po';
            wrapper.vm.filterLocales();
            expect(wrapper.vm.filteredLocales[0]).toBe('pt');
            expect(wrapper.vm.filteredLocales).toContain('pt-BR');
        });

        it('returns empty array when no locales match query', () => {
            wrapper.vm.searchQuery = 'x';
            wrapper.vm.filterLocales();
            expect(wrapper.vm.filteredLocales).toEqual([]);
        });

        it('filters by searchable text for non-latin scripts', () => {
            wrapper.vm.searchQuery = 'japanese';
            wrapper.vm.filterLocales();
            expect(wrapper.vm.filteredLocales).toEqual(['ja']);
        });

        it('filters by native script name', () => {
            wrapper.vm.searchQuery = '日本語';
            wrapper.vm.filterLocales();
            expect(wrapper.vm.filteredLocales).toEqual(['ja']);
        });

        it('resets to all when query is cleared', () => {
            wrapper.vm.searchQuery = 'english';
            wrapper.vm.filterLocales();
            expect(wrapper.vm.filteredLocales).not.toEqual(ALL_LOCALES);

            wrapper.vm.searchQuery = '';
            wrapper.vm.filterLocales();
            expect(wrapper.vm.filteredLocales).toEqual(ALL_LOCALES);
        });
    });

    describe('updateLocale edge cases', () => {
        beforeEach(() => {
            mountComponent('en', ['en', 'de']);
            dispatchSpy = jest.spyOn(mockStore, 'dispatch');
        });

        it('does not dispatch when locale is not in available set', () => {
            wrapper.vm.updateLocale('fr', jest.fn());
            expect(dispatchSpy).not.toHaveBeenCalled();
        });

        it('clears search query after selection', async () => {
            wrapper.vm.searchQuery = 'test';
            await openDropdown();
            await findLocaleItem('Deutsch').trigger('click');
            expect(wrapper.vm.searchQuery).toBe('');
        });
    });

    describe('Electron IPC', () => {
        beforeEach(() => {
            mountComponent('en', ['en', 'de']);
            dispatchSpy = jest.spyOn(mockStore, 'dispatch');
            isDesktopApp.mockReturnValue(true);
        });

        afterEach(() => {
            isDesktopApp.mockReturnValue(false);
        });

        it('calls electronAPI.updateMenu when in Electron and locale is supported', () => {
            window.electronAPI = { updateMenu: jest.fn() };

            wrapper.vm.updateLocale('de', jest.fn());

            expect(window.electronAPI.updateMenu).toHaveBeenCalledWith('de');
        });

        it('skips IPC when locale is not supported', () => {
            window.electronAPI = { updateMenu: jest.fn() };

            wrapper.vm.updateLocale('zz', jest.fn());

            expect(window.electronAPI.updateMenu).not.toHaveBeenCalled();
        });

        it('does not call electronAPI when not in Electron', () => {
            isDesktopApp.mockReturnValue(false);
            window.electronAPI = { updateMenu: jest.fn() };

            wrapper.vm.updateLocale('de', jest.fn());

            expect(window.electronAPI.updateMenu).not.toHaveBeenCalled();
        });
    });

    describe('watch: availableLocales', () => {
        beforeEach(() => {
            mountComponent('en', ['en', 'de']);
        });

        it('initializes filteredLocales from created hook', () => {
            expect(wrapper.vm.filteredLocales).toEqual(['en', 'de']);
        });
    });
});
