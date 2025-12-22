import i18n from '../../../../i18n';
import cornucopiaEN from '@/service/schema/api_json/cornucopia-webapp-en.json';
import cornucopiaES from '@/service/schema/api_json/cornucopia-webapp-es.json';
import cornucopiaFR from '@/service/schema/api_json/cornucopia-webapp-fr.json';
import cornucopiaRU from '@/service/schema/api_json/cornucopia-webapp-ru.json';

export default {

    id: 'cornucopia',
    name: 'OWASP Cornucopia',

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