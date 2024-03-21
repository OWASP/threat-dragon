const theme ={
    namespaced: true,
    state: () => ({
        theme: 'light',
    }),
    mutations: {
        toggleTheme(state){
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        }
    },
    getters: {
        currentTheme: (state) => state.theme
    }
};
export default theme;