import { reactive } from "vue";
import i18n from "../../../i18n";
import cornucopiaEN from '@/service/schema/cornucopia-en.json';
import cornucopiaES from '@/service/schema/cornucopia-es.json';

export const eopCards = reactive({
    get lang() {
        return i18n.get().locale;
    },

    getData() {
        switch (this.lang) {
            case 'spa':
                return cornucopiaES;
            case 'eng':
            default:
                return cornucopiaEN;
        }
    },

    getDecks() {
        const data = this.getData();
        return [
            ...new Set(data.standards.map(card => card.section))
        ].map(section => ({
            value: section,
            text: section,
        }));
    },

    getCardsByDeck(deck) {
        if (!deck) return [];
        const data = this.getData();
        return data.standards
            .filter((card) => card.section === deck)
            .map((card) => ({
                value: card.sectionID,
                text: card.sectionID,
            }));
    },

    getCardDetails(sectionID) {
        const data = this.getData();
        return sectionID
            ? data.standards.find(
                card => card.sectionID === sectionID)
            : null;
    },
});