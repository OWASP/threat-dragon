module.exports = {
    // Create a standalone configuration
    root: true,
    env: {
        node: true,
        browser: true,
        es2022: true,
        jest: true
    },
    plugins: ['vue'],
    extends: ['eslint:recommended', 'plugin:vue/essential'],
    globals: {
        __static: 'readonly',
        vi: 'readonly',
        google: 'readonly',
        gapi: 'readonly',
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        Component: 'readonly'
    },
    ignorePatterns: [
        'node_modules/',
        'dist/',
        'dist-electron/',
        'dist-desktop/',
        '*.config.js',
        'babel.config.js',
        'context/**',
        'td.vue/tests/unit/setup/vue3-test-template.js',
        'td.vue/tests/unit/setup/bootstrap-vue-next.js'
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
    },
    rules: {
        // Common rules
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
        'no-undef': 'warn',
        semi: ['error', 'always'],
        quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
        indent: ['warn', 4],
        'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
        'linebreak-style': ['warn', 'unix'],
        
        // Vue specific rules
        'vue/no-unused-components': 'warn',
        'vue/html-indent': ['error', 4],
        'vue/max-attributes-per-line': [
            'warn',
            {
                singleline: {
                    max: 3
                },
                multiline: {
                    max: 1
                }
            }
        ]
    },
    // Add overrides for test files
    overrides: [
        {
            files: ['tests/**/*.js', 'tests/**/*.cy.js', 'tests/**/*.spec.js'],
            env: {
                jest: true,
                'cypress/globals': true
            },
            plugins: ['cypress'],
            globals: {
                cy: 'readonly',
                Cypress: 'readonly',
                expect: 'readonly',
                assert: 'readonly',
                chai: 'readonly'
            },
            rules: {
                'no-undef': 'off' // Turn off no-undef for test files
            }
        }
    ]
};