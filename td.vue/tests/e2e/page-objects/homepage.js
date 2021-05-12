module.exports = {
    url: '/',
    
    elements: {
        welcome: '#welcome-jumbotron'
    },

    // Or a page objects can also have sections
    sections: {
        welcome: {
            selector: '#welcome-jumbotron',
            elements: {
                logo: '#home-td-logo',
                headline: '.display-3',
                description: '.td-description',
                githubLogin: '#github-login-btn',
                localLogin: '#local-login-btn'
            }
        }
    }
};
