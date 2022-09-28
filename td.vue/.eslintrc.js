module.exports = {
    env: {
        'node': true
    },
    'extends': [
        'plugin:vue/essential',
        'eslint:recommended'
    ],
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
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        semi: 2,
        quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
        indent: ['error', 4],
        'no-mixed-spaces-and-tabs': ['error', 'smart-tabs']
    },
    overrides: [
        {
            // over-ride for both .js and .ts files (and OK, any .Xs file)
            files: ['**/__tests__/*.?s', '**/tests/unit/**/*.spec.?s'],
            env: { jest: true },
            plugins: ['jest'],
            'extends': ['plugin:jest/recommended'],
            rules: {
                'jest/prefer-to-have-length': 'warn',
                'jest/no-done-callback': 'warn',
                'jest/valid-expect': 'warn'
            }
        }
    ],
};
