/**
 * A Nightwatch page object. The page object name is the filename.
 *
 * Example usage:
 *   browser.page.homepage.navigate()
 *
 * For more information on working with page objects see:
 *   https://nightwatchjs.org/guide/working-with-page-objects/
 *
 */
const clickNavExternal = require('../custom-commands/layout/verifyLinkOpensNewTab.js');

module.exports = {
    url: '/',
    commands: [ clickNavExternal ],

    // A page object can have elements
    elements: {
        app: '#app',
        navbar: '#navbar'
    },

    // Or a page objects can also have sections
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

            elements: {
                logo: '#home-td-logo',
                headline: '.display-3',
                description: '.td-description',
                githubLogin: '#github-login-btn',
                localLogin: '#local-login-btn'
            },

            // - a page object section can also have sub-sections
            // - elements or sub-sections located here are retrieved using the "app" section as the base
            sections: {
                headline: {
                    selector: 'h1'
                },

                welcome: {
                    // the equivalent css selector for the "welcome" sub-section would be:
                    //  '#app div.hello'
                    selector: 'div.hello',

                    elements: {
                        cliPluginLinks: {
                            selector: 'ul',
                            index: 0
                        }
                    }
                }
            }
        }
    }
};
