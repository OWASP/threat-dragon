const shared = require('../eslint.shared.js');

module.exports = {
    env: {
        'node': true
    },
    'extends': [
        'plugin:vue/vue3-essential',
        'plugin:@intlify/vue-i18n/base',
        'eslint:recommended'
    ],
    settings: {
        'vue-i18n': {
            localeDir: './src/i18n/*.json'
        }
    },
    globals: {
        __static: 'readonly',
    },
    parserOptions: {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    plugins: [
        'vue'
    ],
    rules: {
        ...shared.rules,
        '@intlify/vue-i18n/no-dynamic-keys': 'error',
        '@intlify/vue-i18n/no-missing-keys': 'error',
        '@intlify/vue-i18n/no-missing-keys-in-other-locales': 'error',
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    },
    overrides: [
        {
            // over-ride for both .js and .ts files (and OK, any .Xs file)
            files: ['**/__tests__/*.?s', '**/tests/unit/**/*.spec.?s', '**/tests/unit/**/helpers/*.js'],
            env: { jest: true },
            plugins: ['jest'],
            'extends': ['plugin:jest/recommended'],
            rules: {
                'jest/prefer-to-have-length': 'error',
                'jest/no-done-callback': 'error',
                'jest/valid-expect': 'error'
            }
        }
    ],
};
