module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        'eslint:recommended'
    ],
    parserOptions: {
        parser: 'babel-eslint'
    },
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
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)'
            ],
            env: {
                jest: true,
                'jest/globals': true
            },
            plugins: ['jest']
        }
    ]
};
