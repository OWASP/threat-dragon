import homepageStrings from '../fixtures/homepage-strings.json';

const allSupported = [
    'ar', 'de', 'el', 'en', 'es', 'fi', 'fr',
    'hi', 'id', 'ja', 'ms', 'pt', 'pt-BR', 'zh'
];

const providers = [
    'github-login-btn',
    'bitbucket-login-btn',
    'gitlab-login-btn',
    'google-login-btn',
    'local-login-btn'
];

const defaultConfig = {
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
            data: { ...defaultConfig, ...overrides }
        }
    }).as(alias);

    cy.visit('/');
    cy.wait(`@${alias}`);
    cy.get('.spinner-border', { timeout: 10000 }).should('not.exist');
};

const verifyProviderButtons = (expected) => {
    providers.forEach((id) => {
        const shouldExist = expected.includes(id);
        cy.get(`#${id}`).should(shouldExist ? 'be.visible' : 'not.exist');
    });
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

        allSupported.forEach((locale) => {
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

            verifyProviderButtons(providers);
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

    describe('analytics opt-in', () => {
        it('does not post analytics when the server does not enable it', () => {
            cy.intercept('POST', '/api/analytics').as('analytics');
            loadWithConfig();
            cy.get('@analytics.all').should('have.length', 0);
            cy.get('#nav-analytics').should('not.exist');
        });

        it('shows the indicator and uses only the server endpoint when enabled', () => {
            cy.intercept('POST', '/api/analytics', { statusCode: 204 }).as('analytics');
            cy.intercept('POST', 'https://plausible.test/**').as('directPlausible');
            loadWithConfig({
                analytics: {
                    enabled: true,
                    dashboardUrl: 'https://plausible.test/share/threatdragon',
                    eventNames: ['PAGE_VIEW_HOME']
                }
            });
            cy.wait('@analytics').its('request.body').should('deep.equal', { event: 'PAGE_VIEW_HOME' });
            cy.get('#nav-analytics a')
                .should('have.attr', 'href', 'https://plausible.test/share/threatdragon')
                .and('have.attr', 'rel', 'noopener noreferrer');
            cy.get('@directPlausible.all').should('have.length', 0);
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

});
