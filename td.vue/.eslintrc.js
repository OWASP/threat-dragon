module.exports = {
    env: {
        'node': true
    },
    'extends': [
        'plugin:vue/essential',
        'eslint:recommended'
    ],
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
    //    'ignorePatterns': [
    //        '**/__tests__/*.{j,t}s',
    //        '**/tests/unit/**/*.spec.{j,t}s',
    //        '**/tests/unit/**/*.spec.js'
    //    ]
    overrides: [
        {
            files: ['**/__tests__/*.js', '**/tests/unit/**/*.spec.js'],
            env: { jest: true },
            plugins: ['jest'],
            rules: {
                'jest/no-disabled-tests': 'off',
                'jest/no-focused-tests': 'error',
                'jest/no-identical-title': 'error',
                'jest/prefer-to-have-length': 'warn',
                'jest/valid-expect': 'warn'
            }
        }
    ],
};
