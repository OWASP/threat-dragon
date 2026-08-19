import i18n from '@/i18n';
import cornucopiaEN from '@/assets/downloads/cornucopia/cornucopia-webapp-en.json';
import cornucopiaES from '@/assets/downloads/cornucopia/cornucopia-webapp-es.json';
import cornucopiaFR from '@/assets/downloads/cornucopia/cornucopia-webapp-fr.json';
import cornucopiaRU from '@/assets/downloads/cornucopia/cornucopia-webapp-ru.json';

export default {

    id: 'cornucopia',
    name: 'OWASP Cornucopia',

    getData() {
        switch (i18n.get().locale) {
        case 'es':
            return cornucopiaES;
        case 'fr':
            return cornucopiaFR;
        case 'ru':
            return cornucopiaRU;
        case 'en':
        default:
            return cornucopiaEN;
        }
    },

    getSuits() {
        const data = this.getData();
        return [
            ...new Set(data.standards.map(card => card.section))
        ].map(section => ({
            value: section,
            text: section,
        }));
    },

    getCardsBySuit(suit) {
        if (!suit) return [];
        const data = this.getData();
        return data.standards
            .filter((card) => card.section === suit)
            .map((card) => ({
                value: card.sectionID,
                text: card.sectionID,
            }));
    },

    getCardCategory(cardNumber) {
        const data = this.getData();
        return cardNumber
            ? data.standards.find(
                card => card.sectionID === cardNumber).section
            : null;
    },

    getCardUrl(cardNumber) {
        const data = this.getData();
        return cardNumber
            ? data.standards.find(
                card => card.sectionID === cardNumber).hyperlink
            : 'https://cornucopia.owasp.org/cards';
    }
};