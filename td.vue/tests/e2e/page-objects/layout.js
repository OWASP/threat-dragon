const clickNavExternal = require('../custom-commands/layout/verifyLinkOpensNewTab.js');

module.exports = {
    url: '/',
    commands: [ clickNavExternal ],
    elements: {
        navbar: '#navbar',
        app: '#app'
    },
    sections: {
        navbar: {
            selector: '#navbar',
            elements: {
                brand: '.navbar-brand img',
                brandLink: 'a.navbar-brand',
                docsLink: '#nav-docs',
                cheatSheetLink: '#nav-tm-cheat-sheet',
                projectLink: '#nav-owasp-td'
            }
        },
        app: {
            selector: '#app',
            elements: {},
        }
    }
};
