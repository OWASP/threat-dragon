module.exports = {
    root: true, // This ensures ESLint doesn't look for config files in parent directories
    env: {
        node: true,
        browser: false,
        es2022: true,
        jest: true
    },
    extends: ['eslint:recommended'],
    globals: {
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
    },
    ignorePatterns: [
        'node_modules/',
        'dist/',
        'coverage/',
        '*.config.js',
        'babel.config.js'
    ],
    rules: {
        // Common rules
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
        'no-undef': 'warn',
        'semi': ['error', 'always'],
        'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
        'indent': ['warn', 4],
        'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
        'linebreak-style': ['warn', 'unix'],

        // Performance-related rules
        'prefer-const': 'warn',
        'no-var': 'warn',

        // Server-specific rules
        'sort-imports': 'off'
    },
    overrides: [
        // Test specific overrides
        {
            files: ['test/**/*.spec.js'],
            env: {
                jest: true,
                node: true
            },
            globals: {
                describe: true,
                it: true,
                expect: true,
                beforeEach: true,
                afterEach: true
            },
            plugins: ['jest'],
            extends: ['plugin:jest/recommended'],
            rules: {
                'jest/prefer-to-have-length': 'warn',
                'jest/no-done-callback': 'warn',
                'jest/valid-expect': 'warn',
                'jest/no-disabled-tests': 'warn',
                'jest/expect-expect': 'warn',
                'jest/no-conditional-expect': 'warn',
                'no-unused-vars': 'warn'
            }
        },
        // Specific file overrides to disable certain lint warnings
        {
            files: [
                'test/app.spec.js',
                'test/repositories/githubrepo.spec.js'
            ],
            rules: {
                'jest/no-disabled-tests': 'off'
            }
        },
        {
            files: [
                'test/config/routes.config.spec.js'
            ],
            rules: {
                'jest/no-commented-out-tests': 'off'
            }
        }
    ]
};