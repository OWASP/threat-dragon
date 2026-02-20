import i18n from '../../../../i18n';
import cornucopiaEN from '@/service/schema/api_json/cornucopia-mobileapp-en.json';

export default {
    id: 'cornucopia-mobileapp',
    name: 'OWASP Cornucopia Mobileapp',

// mobileapp currently only provides English data via the Cornucopia API.
    getData() {
    return cornucopiaEN;
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