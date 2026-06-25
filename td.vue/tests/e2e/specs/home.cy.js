import homepageStrings from '../fixtures/homepage-strings.json';

const ALL_SUPPORTED = [
    'ar', 'de', 'el', 'en', 'es', 'fi', 'fr',
    'hi', 'id', 'ja', 'ms', 'pt', 'pt-BR', 'zh'
];

const PROVIDERS = [
    'github-login-btn',
    'bitbucket-login-btn',
    'gitlab-login-btn',
    'google-login-btn',
    'local-login-btn'
];

const DEFAULT_CONFIG = {
    githubEnabled: false,
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
    cy.get('.spinner-border', { timeout: 10000 }).should('not.exist');
};

const verifyProviderButtons = (expected) => {
    PROVIDERS.forEach((id) => {
        const shouldExist = expected.includes(id);
        cy.get(`#${id}`).should(shouldExist ? 'be.visible' : 'not.exist');
    });
};

const expectErrorToast = (text = homepageStrings.en.configLoadFailed) => {
    cy.get('.Vue-Toastification__toast--error')
        .should('be.visible')
        .and('contain.text', text);
};

const verifyExternalUrl = (selector, url) => {
    cy.get(selector)
        .find('a')
        .should('have.attr', 'href', url)
        .and('have.attr', 'rel', 'noopener noreferrer');
};


describe('home', () => {

    describe('navbar', () => {
        beforeEach(() => {
            cy.launchThreatDragon();
        });

        it('has a link to the home page', () => {
            cy.get('.navbar-brand')
                .should('have.attr', 'href')
                .and('contain', '#/');
        });

        it('links to docs', () => {
            verifyExternalUrl(
                '#nav-docs',
                'https://www.threatdragon.com/docs/'
            );
        });

        it('links to cheat sheet', () => {
            verifyExternalUrl(
                '#nav-tm-cheat-sheet',
                'https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html'
            );
        });

        it('links to OWASP page', () => {
            verifyExternalUrl(
                '#nav-owasp-td',
                'https://owasp.org/www-project-threat-dragon/'
            );
        });
    });

    describe('locale — translated content', () => {
        afterEach(() => {
            cy.window().then((win) => win.sessionStorage.clear());
        });

        ALL_SUPPORTED.forEach((locale) => {
            it(`displays correct content for ${locale}`, () => {
                const isDefault = locale === 'en';

                loadWithConfig({
                    githubEnabled: true,
                    allowedLocales: isDefault ? [] : [locale],
                    defaultLocale: locale
                });

                const strings = homepageStrings[locale];
                if (!strings) {
                    cy.log(`Missing fixture for ${locale}`);
                    return;
                }

                cy.get('h1.display-3').should('contain.text', strings.title);
                cy.get('p.td-description').should('contain.text', strings.description);
                cy.get('#local-login-btn').should('contain.text', strings.loginButton);
                cy.get('.td-dropdown-toggle').should('contain.text', strings.dropdownLabel);
            });
        });
    });

    describe('provider buttons — config-driven visibility', () => {
        beforeEach(() => {
            cy.window().then((win) => win.sessionStorage.clear());
        });

        it('shows all providers when all enabled', () => {
            loadWithConfig({
                githubEnabled: true,
                bitbucketEnabled: true,
                gitlabEnabled: true,
                googleEnabled: true,
                localEnabled: true
            });

            verifyProviderButtons(PROVIDERS);
        });

        it('shows only github + local', () => {
            loadWithConfig({
                githubEnabled: true
            });

            verifyProviderButtons(['github-login-btn', 'local-login-btn']);
        });

        it('shows only bitbucket + local', () => {
            loadWithConfig({
                bitbucketEnabled: true
            });

            verifyProviderButtons(['bitbucket-login-btn', 'local-login-btn']);
        });

        it('shows only gitlab + local', () => {
            loadWithConfig({
                gitlabEnabled: true
            });

            verifyProviderButtons(['gitlab-login-btn', 'local-login-btn']);
        });

        it('shows only google + local', () => {
            loadWithConfig({
                googleEnabled: true
            });

            verifyProviderButtons(['google-login-btn', 'local-login-btn']);
        });

        it('shows only local when all disabled', () => {
            loadWithConfig({
                githubEnabled: false,
                bitbucketEnabled: false,
                gitlabEnabled: false,
                googleEnabled: false,
                localEnabled: true
            });

            verifyProviderButtons(['local-login-btn']);
        });

        it('falls back to local on network error', () => {
            cy.intercept('GET', '/api/config', {
                forceNetworkError: true
            }).as('getConfigFail');

            cy.visit('/');
            cy.wait('@getConfigFail');

            cy.get('.spinner-border').should('not.exist');
            verifyProviderButtons(['local-login-btn']);
        });

        it('falls back to local on empty config', () => {
            cy.intercept('GET', '/api/config', {
                statusCode: 200,
                body: { status: 200, data: {} }
            }).as('getConfig');

            cy.visit('/');
            cy.wait('@getConfig');

            cy.get('.spinner-border').should('not.exist');
            verifyProviderButtons(['local-login-btn']);
        });
    });

    describe('loading state', () => {
        it('shows spinner while loading config', () => {
            cy.intercept('GET', '/api/config', (req) => {
                req.on('response', (res) => {
                    res.setDelay(500);
                });
                req.continue();
            }).as('slowConfig');

            cy.visit('/');
            cy.get('.spinner-border').should('be.visible');

            cy.wait('@slowConfig');
            cy.get('.spinner-border').should('not.exist');
        });

        it('spinner disappears after success', () => {
            cy.launchThreatDragon();
            cy.get('.spinner-border').should('not.exist');
        });

        it('spinner disappears after error', () => {
            cy.intercept('GET', '/api/config', {
                statusCode: 500,
                body: { status: 500, error: 'Server error' }
            }).as('failConfig');

            cy.visit('/');
            cy.wait('@failConfig');

            cy.get('.spinner-border').should('not.exist');
        });
    });

    describe('config errors — toasts and fallback', () => {
        afterEach(() => {
            cy.window().then((win) => win.sessionStorage.clear());
        });

        it('shows toast on 500 error', () => {
            cy.intercept('GET', '/api/config', {
                statusCode: 500,
                body: { status: 500, error: 'Server error' }
            }).as('failConfig');

            cy.visit('/');
            cy.wait('@failConfig');

            cy.get('#local-login-btn').should('be.visible');
            expectErrorToast();
        });

        it('shows toast on network error', () => {
            cy.intercept('GET', '/api/config', {
                forceNetworkError: true
            }).as('failConfig');

            cy.visit('/');
            cy.wait('@failConfig');

            cy.get('#local-login-btn').should('be.visible');
            expectErrorToast();
        });

        it('shows toast on empty config', () => {
            cy.intercept('GET', '/api/config', {
                statusCode: 200,
                body: { status: 200, data: {} }
            }).as('getConfig');

            cy.visit('/');
            cy.wait('@getConfig');

            cy.get('#local-login-btn').should('be.visible');
            expectErrorToast();
        });

        it('does not show error toast on success', () => {
            cy.launchThreatDragon();
            cy.get('.Vue-Toastification__toast--error').should('not.exist');
        });
    });
});