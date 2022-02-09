import VuexPersistence from 'vuex-persist';

const session = new VuexPersistence({
    key: 'td.vuex',
    storage: window.sessionStorage
});

export default {
    session
};
