import i18n from '../../../i18n';
import cornucopiaEN from '@/service/schema/cornucopia-en.json';
import cornucopiaES from '@/service/schema/cornucopia-es.json';
import cornucopiaFR from '@/service/schema/cornucopia-fr.json';
import cornucopiaRU from '@/service/schema/cornucopia-ru.json';

export const eopCards = {
    getLang() {
        return i18n.get().locale;
    },

    getData() {
        switch (this.getLang()) {
        case 'spa':
            return cornucopiaES;
        case 'fra':
            return cornucopiaFR;
        case 'rus':
            return cornucopiaRU;
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
};