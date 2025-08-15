<template>
    <div class="locale-changer">
        <b-dropdown right :text="getLanguageName(locale)" variant="primary">
            <div class="px-2 py-2">
                <input type="text" v-model="searchQuery" class="form-control" placeholder="Search language..." @click.stop
                    @input="filterLocales" />
            </div>
            <div class="dropdown-items-container">
                <b-dropdown-item v-for="localeCode in filteredLocales" :key="`locale-${localeCode}`" :value="localeCode"
                    @click.native="updateLocale(localeCode)">
                    {{ getLanguageName(localeCode) }}
                </b-dropdown-item>
            </div>
        </b-dropdown>
    </div>
</template>
  
<script>
import { mapState } from 'vuex';
import { LOCALE_SELECTED } from '@/store/actions/locale.js';
import isElectron from 'is-electron';

export default {
    name: 'TdLocalSelect',
    data() {
        return {
            searchQuery: '',
            filteredLocales: []
        };
    },
    created() {
        // Initialize filteredLocales with all available locales
        this.filteredLocales = [...this.$i18n.availableLocales]; 
    },
    computed: {
        ...mapState({
            locale: function (state) {
                if (this.$i18n.locale !== state.locale.locale) {
                    this.$i18n.locale = state.locale.locale;
                }
                return state.locale.locale;
            }
        })
    },
    methods: {
        filterLocales() {
            const query = this.searchQuery.toLowerCase().trim();

            if (!query) {
                this.filteredLocales = this.$i18n.availableLocales;
                return;
            }

            // Sort and filter locales
            this.filteredLocales = this.$i18n.availableLocales
                .sort((a, b) => {
                    const nameA = this.getLanguageName(a).toLowerCase();
                    const nameB = this.getLanguageName(b).toLowerCase();

                    // If name starts with query, it should come first
                    const startsWithA = nameA.startsWith(query);
                    const startsWithB = nameB.startsWith(query);

                    if (startsWithA && !startsWithB) return -1;
                    if (!startsWithA && startsWithB) return 1;

                    // If neither or both start with query, sort alphabetically
                    return nameA.localeCompare(nameB);
                })
                .filter(locale => {
                    const name = this.getLanguageName(locale).toLowerCase();
                    const searchableText = this.getSearchableText(name);
                    return name.includes(query) ||
                        locale.toLowerCase().includes(query) ||
                        searchableText.includes(query);
                });
        },
        updateLocale(locale) {
            this.$store.dispatch(LOCALE_SELECTED, locale);
            if (isElectron()) {
                window.electronAPI.updateMenu(locale);
            }
            this.searchQuery = ''; // Clear search after selection
            this.filterLocales(); // Reset the filtered list
        },
        getLanguageName(locale) {
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
                return 'Malay'; // Malay
            case 'por':
                return 'Português'; // Portuguese
            case 'zho':
                return '中文'; // Chinese
            default:
                return locale;
            }
        },
        getSearchableText(name) {
            const searchMapping = {
                'العربية': 'arabic',
                'Ελληνικά': 'greek',
                'हिंदी': 'hindi',
                '日本語': 'japanese',
                '中文': 'chinese'
            };
            return searchMapping[name] || name;
        }
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