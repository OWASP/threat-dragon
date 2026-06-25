import homepageStrings from '../fixtures/homepage-strings.json';

const ALL_SUPPORTED = [
    'ar', 'de', 'el', 'en', 'es', 'fi', 'fr',
    'hi', 'id', 'ja', 'ms', 'pt', 'pt-BR', 'zh'
];

const DEFAULT_CONFIG = {
    githubEnabled: true,
    bitbucketEnabled: false,
    gitlabEnabled: false,
    googleEnabled: false,
    localEnabled: true,
    allowedLocales: [],
    defaultLocale: 'en'
};

const loadWithConfig = (overrides = {}, alias = 'getConfig') => {
    cy.intercept('GET', '/api/config', {
        statusCode: 200,
        body: {
            status: 200,
            data: { ...DEFAULT_CONFIG, ...overrides }
        }
    }).as(alias);

    cy.visit('/');
    cy.wait(`@${alias}`);
    cy.get('.spinner-border').should('not.exist');
    cy.get('#local-login-btn').should('be.visible');
};

const openLocaleDropdown = () => {
    cy.get('.td-locale-select .td-dropdown-toggle').click();
};

const getDropdownItems = () =>
    cy.get('.td-dropdown-scroll button');

const expectLocales = (count) =>
    getDropdownItems().should('have.length', count);

const expectLocaleTexts = (texts) => {
    getDropdownItems().each((el, index) => {
        cy.wrap(el).should('contain.text', texts[index]);
    });
};

describe('locale — dropdown filtering by server config', () => {
    beforeEach(() => {
        cy.window().then((win) => win.sessionStorage.clear());
    });

    it('shows all locales when allowedLocales is empty', () => {
        loadWithConfig();
        openLocaleDropdown();
        expectLocales(ALL_SUPPORTED.length);
    });

    it('shows single locale when only one allowed', () => {
        loadWithConfig({
            allowedLocales: ['pt'],
            defaultLocale: 'pt'
        });

        openLocaleDropdown();
        expectLocales(1);
        getDropdownItems().should('contain.text', 'Português');
    });

    it('shows subset of locales when limited by server', () => {
        loadWithConfig({
            allowedLocales: ['en', 'es', 'fr', 'pt-BR']
        });

        openLocaleDropdown();
        expectLocales(4);

        expectLocaleTexts([
            'English',
            'Español',
            'Français',
            'Português (Brasil)'
        ]);
    });

    it('shows only allowed locales when restricted set is provided', () => {
        loadWithConfig({
            allowedLocales: ['en', 'de']
        });

        openLocaleDropdown();
        expectLocales(2);
        getDropdownItems().should('contain.text', 'English');
        getDropdownItems().should('contain.text', 'Deutsch');
    });
});

describe('locale — server-policy-driven resolution', () => {
    beforeEach(() => {
        cy.window().then((win) => win.sessionStorage.clear());

        cy.intercept('GET', '/api/config', {
            statusCode: 200,
            body: {
                status: 200,
                data: {
                    githubEnabled: true,
                    bitbucketEnabled: false,
                    gitlabEnabled: false,
                    googleEnabled: false,
                    localEnabled: true,
                    allowedLocales: ['de', 'en'],
                    defaultLocale: 'de'
                }
            }
        }).as('getConfig');
    });

    it('uses server default locale when no persisted preference', () => {
        cy.visit('/');
        cy.wait('@getConfig');

        cy.get('.td-locale-select .td-dropdown-toggle')
            .should('contain.text', 'English');
    });

    it('falls back when persisted locale is not allowed', () => {
        cy.visit('/', {
            onBeforeLoad: (win) => {
                win.sessionStorage.setItem(
                    'td.vuex',
                    JSON.stringify({ locale: { locale: 'fr' } })
                );
            }
        });

        cy.wait('@getConfig');

        cy.get('.td-locale-select .td-dropdown-toggle')
            .should('contain.text', 'English');
    });

    it('uses persisted locale when allowed', () => {
        cy.intercept('GET', '/api/config', {
            statusCode: 200,
            body: {
                status: 200,
                data: {
                    allowedLocales: ['es', 'en'],
                    defaultLocale: 'en'
                }
            }
        }).as('getConfig2');

        cy.visit('/', {
            onBeforeLoad: (win) => {
                win.sessionStorage.setItem(
                    'td.vuex',
                    JSON.stringify({ locale: { locale: 'es' } })
                );
            }
        });

        cy.wait('@getConfig2');

        cy.get('.td-locale-select .td-dropdown-toggle')
            .should('contain.text', 'Español');
    });

    it('falls back to English when server default is invalid', () => {
        cy.intercept('GET', '/api/config', {
            statusCode: 200,
            body: {
                status: 200,
                data: {
                    allowedLocales: ['en'],
                    defaultLocale: 'fr'
                }
            }
        }).as('getConfig3');

        cy.visit('/');
        cy.wait('@getConfig3');

        cy.get('.td-locale-select .td-dropdown-toggle')
            .should('contain.text', 'English');
    });

    it('shows all locales when config request fails', () => {
        cy.intercept('GET', '/api/config', {
            forceNetworkError: true
        }).as('getConfigFail');

        cy.visit('/');
        cy.wait('@getConfigFail');

        cy.get('.td-locale-select .td-dropdown-toggle').click();
        expectLocales(ALL_SUPPORTED.length);
    });
});

describe('locale — user selecting', () => {
    beforeEach(() => {
        cy.window().then((win) => win.sessionStorage.clear());

        loadWithConfig();
    });

    const switchLocale = (name) => {
        openLocaleDropdown();
        getDropdownItems().contains(name).click();
        cy.get('.td-locale-select .td-dropdown-toggle')
            .should('contain.text', name);
    };

    it('switches from en to es', () => {
        switchLocale('Español');
        cy.get('#local-login-btn')
            .should('contain.text', homepageStrings.es.loginButton);
    });

    it('switches from en to pt-BR', () => {
        switchLocale('Português (Brasil)');
        cy.get('#local-login-btn')
            .should('contain.text', homepageStrings['pt-BR'].loginButton);
    });

    it('switches to Japanese', () => {
        switchLocale('日本語');
        cy.get('#local-login-btn')
            .should('contain.text', homepageStrings.ja.loginButton);
    });

    it('switches back to English after selecting another locale', () => {
        switchLocale('Español');
        switchLocale('English');

        cy.get('#local-login-btn')
            .should('contain.text', homepageStrings.en.loginButton);
    });

    it('persists locale after reload', () => {
        switchLocale('Français');

        cy.reload();
        cy.wait('@getConfig');

        cy.get('.td-locale-select .td-dropdown-toggle')
            .should('contain.text', 'Français');
    });
});