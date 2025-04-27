<template>
    <div class="locale-changer">
        <b-dropdown right :text="getLanguageName(locale)" variant="primary">
            <div class="px-2 py-2">
                <input
                    id="locale-search-field"
                    v-model="searchQuery"
                    type="text"
                    class="form-control"
                    placeholder="Search language..."
                    name="locale-search-field"
                    @click.stop
                    @input="filterLocales"
                >
            </div>
            <div class="dropdown-items-container">
                <b-dropdown-item
                    v-for="localeCode in filteredLocales"
                    :key="`locale-${localeCode}`"
                    :value="localeCode"
                    @click="updateLocale(localeCode)"
                >
                    {{ getLanguageName(localeCode) }}
                </b-dropdown-item>
            </div>
        </b-dropdown>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { LOCALE_SELECTED } from '@/store/actions/locale.js';
import isElectron from 'is-electron';
import logger from '@/utils/logger.js';

// Create a context-specific logger
const log = logger.getLogger('components:LocaleSelect');

export default {
    name: 'TdLocalSelect',
    setup() {
        const store = useStore();
        const i18n = useI18n();

        const searchQuery = ref('');
        const filteredLocales = ref([]);

        // Computed property for the current locale
        const locale = computed(() => {
            return store.state.locale.locale;
        });
        
        // Watch for locale changes and sync with i18n
        watch(() => store.state.locale.locale, (newLocale) => {
            // Sync i18n locale with store (with error handling for tests)
            try {
                if (i18n.locale && i18n.locale.value !== newLocale) {
                    i18n.locale.value = newLocale;
                }
            } catch (err) {
                log.warn('Error syncing locale:', err);
            }
        }, { immediate: true });

        // Helper to safely get available locales (handles both ref and direct array)
        const getAvailableLocales = () => {
            // If it's a ref (real implementation), access .value
            if (
                i18n.availableLocales &&
                    typeof i18n.availableLocales === 'object' &&
                    'value' in i18n.availableLocales
            ) {
                return i18n.availableLocales.value;
            }

            // For tests or when it's a direct array
            return Array.isArray(i18n.availableLocales) ? i18n.availableLocales : [];
        };

        // Initialize the filtered locales
        onMounted(() => {
            filteredLocales.value = [...getAvailableLocales()];
        });

        // Reset filtered locales when search query changes
        watch(searchQuery, () => {
            filterLocales();
        });

        // Methods
        const filterLocales = () => {
            const query = searchQuery.value.toLowerCase().trim();

            if (!query) {
                filteredLocales.value = getAvailableLocales();
                return;
            }

            // Sort and filter locales
            filteredLocales.value = getAvailableLocales()
                .sort((a, b) => {
                    const nameA = getLanguageName(a).toLowerCase();
                    const nameB = getLanguageName(b).toLowerCase();

                    // If name starts with query, it should come first
                    const startsWithA = nameA.startsWith(query);
                    const startsWithB = nameB.startsWith(query);

                    if (startsWithA && !startsWithB) return -1;
                    if (!startsWithA && startsWithB) return 1;

                    // If neither or both start with query, sort alphabetically
                    return nameA.localeCompare(nameB);
                })
                .filter((locale) => {
                    const name = getLanguageName(locale).toLowerCase();
                    const searchableText = getSearchableText(name);
                    return (
                        name.includes(query) ||
                            locale.toLowerCase().includes(query) ||
                            searchableText.includes(query)
                    );
                });
        };

        const updateLocale = (locale) => {
            store.dispatch(LOCALE_SELECTED, locale);
            if (isElectron()) {
                window.electronAPI.updateMenu(locale);
            }
            searchQuery.value = ''; // Clear search after selection
            filterLocales(); // Reset the filtered list
        };

        const getLanguageName = (locale) => {
            switch (locale) {
            case 'ara':
                return 'العربية'; // Arabic
            case 'deu':
                return 'Deutsch'; // German
            case 'ell':
                return 'Ελληνικά'; // Greek
            case 'eng':
                return 'English';
            case 'spa':
                return 'Español'; // Spanish
            case 'fin':
                return 'Suomi'; // Finnish
            case 'fra':
                return 'Français'; // French
            case 'hin':
                return 'हिंदी'; // Hindi
            case 'ind':
                return 'Bahasa Indonesia'; // Indonesia
            case 'jpn':
                return '日本語'; // Japanese
            case 'msa':
                return 'Bahasa Melayu'; // Malay
            case 'por':
                return 'Português'; // Portuguese
            case 'rus':
                return 'Русский'; // Russian
            case 'tha':
                return 'ไทย'; // Thai
            case 'ukr':
                return 'Українська'; // Ukrainian
            case 'heb':
                return 'עברית'; // Hebrew
            case 'zho':
                return '中文'; // Chinese
            default:
                return locale;
            }
        };

        const getSearchableText = (name) => {
            const searchMapping = {
                العربية: 'arabic',
                Ελληνικά: 'greek',
                हिंदी: 'hindi',
                日本語: 'japanese',
                Русский: 'russian',
                Українська: 'ukrainian',
                ไทย: 'thai',
                עברית: 'hebrew',
                中文: 'chinese'
            };
            return searchMapping[name] || name;
        };

        // Return everything needed for the template
        return {
            searchQuery,
            filteredLocales,
            locale,
            updateLocale,
            getLanguageName,
            getSearchableText,
            filterLocales
        };
    }
};
</script>

<style scoped>
    .locale-changer input {
        min-width: 200px;
        margin-bottom: 8px;
    }

    .dropdown-items-container {
        max-height: 300px;
        overflow-y: auto;
    }
</style>
