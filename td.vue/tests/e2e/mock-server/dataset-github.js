/**
 * GitHub dataset for the mock server and pagination E2E tests.
 * Centralises magic numbers so specs and the mock server stay in sync.
 * Provider-specific: add dataset-bitbucket.js, dataset-gitlab.js etc for other providers.
 */
const dataset = Object.freeze({
    repos: {
        total: 75,
        perPage: 30,
        orgs: ['owasp', 'my-company', 'open-source-org', 'owasp', 'owasp'],
        names: [
            'threat-dragon', 'web-app', 'api-gateway', 'mobile-backend', 'auth-service',
            'data-pipeline', 'frontend-app', 'payment-processor', 'notification-service',
            'search-engine',
        ],
    },
    branches: {
        total: 35,
        perPage: 15,
        names: [
            'main', 'develop', 'feature/auth-overhaul', 'feature/new-dashboard', 'fix/login-bug',
            'release/v2.1.0', 'chore/dependency-update', 'hotfix/security-patch',
            'feature/search-refactor', 'fix/input-validation', 'release/v2.2.0',
            'chore/ci-upgrade', 'feature/oauth-flow', 'fix/rate-limiting', 'docs/api-reference',
            'feature/mobile-support', 'fix/cors-headers', 'release/v3.0.0-beta',
            'chore/docker-compose', 'feature/webhook-integration', 'fix/session-timeout',
            'release/v2.3.0', 'chore/eslint-upgrade', 'feature/graphql-api', 'fix/null-pointer',
            'release/v2.0.1', 'chore/readme-update', 'feature/caching-layer', 'fix/db-migration',
            'docs/architecture', 'feature/rbac', 'fix/unicode-escape', 'release/v3.1.0-rc1',
            'chore/terraform', 'feature/audit-log', 'fix/thread-safety', 'release/v1.9.0',
            'chore/webpack5', 'feature/service-mesh', 'fix/config-encoding', 'docs/deployment',
            'feature/rate-limiter-v2', 'fix/oauth-refresh', 'release/v4.0.0-alpha',
            'chore/github-actions', 'feature/event-sourcing',
        ],
    },
});

module.exports = dataset;
