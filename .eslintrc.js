module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2022: true,
        'vue/setup-compiler-macros': true,
        jest: true
    },
    extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'prettier'],
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
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
    },
    plugins: ['vue', 'prettier'],
    ignorePatterns: [
        'node_modules/',
        'dist/',
        'dist-electron/',
        'td.vue/dist-desktop/',
        '*.config.js',
        'babel.config.js',
        'archive/**',
        'td.vue/tests/unit/setup/vue3-test-template.js',
        'td.vue/tests/unit/setup/bootstrap-vue-next.js'
    ],
    rules: {
        // Common rules for both server and client
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
        'no-undef': 'warn',
        semi: ['error', 'always'],
        quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
        indent: ['warn', 4],
        'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
        'linebreak-style': ['warn', 'unix'],
        'prettier/prettier': 'warn',

        // Performance-related rules
        'prefer-const': 'warn',
        'no-var': 'warn',

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
    overrides: [
        // Server specific overrides
        {
            files: ['td.server/src/**/*.js'],
            env: {
                node: true,
                browser: false
            },
            plugins: [],
            rules: {
                // Add any server-specific rules here
                'sort-imports': 'off'
            }
        },
        // Vue specific overrides
        {
            files: ['td.vue/src/**/*.{js,vue}'],
            env: {
                node: true,
                browser: true
            },
            plugins: ['vue'],
            rules: {
                // Vue Essential Rules (Error Prevention)
                'vue/no-arrow-functions-in-watch': 'error',
                'vue/no-async-in-computed-properties': 'error',
                'vue/no-child-content': 'error',
                'vue/no-computed-properties-in-data': 'error',
                'vue/no-custom-modifiers-on-v-model': 'error',
                'vue/no-dupe-keys': 'error',
                'vue/no-dupe-v-else-if': 'error',
                'vue/no-duplicate-attributes': 'error',
                'vue/no-multiple-template-root': 'error',
                'vue/no-mutating-props': 'error',
                'vue/no-parsing-error': 'error',
                'vue/no-reserved-keys': 'error',
                'vue/no-reserved-props': 'error',
                'vue/no-shared-component-data': 'error',
                'vue/no-side-effects-in-computed-properties': 'error',
                'vue/no-template-key': 'error',
                'vue/no-textarea-mustache': 'error',
                'vue/no-unused-components': 'warn',
                'vue/no-unused-vars': 'warn',
                'vue/no-use-computed-property-like-method': 'error',
                'vue/no-use-v-if-with-v-for': 'error',
                'vue/no-useless-template-attributes': 'error',
                'vue/no-v-for-template-key': 'error',
                'vue/no-v-model-argument': 'error',
                'vue/require-component-is': 'error',
                'vue/require-prop-type-constructor': 'error',
                'vue/require-render-return': 'error',
                'vue/require-v-for-key': 'error',
                'vue/require-valid-default-prop': 'error',
                'vue/return-in-computed-property': 'error',
                'vue/use-v-on-exact': 'error',
                'vue/valid-attribute-name': 'error',
                'vue/valid-define-emits': 'error',
                'vue/valid-define-props': 'error',
                'vue/valid-next-tick': 'error',
                'vue/valid-template-root': 'error',
                'vue/valid-v-bind': 'error',
                'vue/valid-v-cloak': 'error',
                'vue/valid-v-else-if': 'error',
                'vue/valid-v-else': 'error',
                'vue/valid-v-for': 'error',
                'vue/valid-v-html': 'error',
                'vue/valid-v-if': 'error',
                'vue/valid-v-is': 'error',
                'vue/valid-v-memo': 'error',
                'vue/valid-v-model': 'error',
                'vue/valid-v-on': 'error',
                'vue/valid-v-once': 'error',
                'vue/valid-v-pre': 'error',
                'vue/valid-v-show': 'error',
                'vue/valid-v-slot': 'error',
                'vue/valid-v-text': 'error',

                // Vue Strongly Recommended Rules (Improving Readability)
                'vue/attribute-hyphenation': 'warn',
                'vue/component-definition-name-casing': 'warn',
                'vue/first-attribute-linebreak': 'warn',
                'vue/html-closing-bracket-newline': 'warn',
                'vue/html-closing-bracket-spacing': 'warn',
                'vue/html-end-tags': 'warn',
                'vue/html-indent': ['error', 4],
                'vue/html-quotes': 'warn',
                'vue/html-self-closing': 'warn',
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
                ],
                'vue/multiline-html-element-content-newline': 'warn',
                'vue/mustache-interpolation-spacing': 'warn',
                'vue/no-multi-spaces': 'warn',
                'vue/no-spaces-around-equal-signs-in-attribute': 'warn',
                'vue/no-template-shadow': 'warn',
                'vue/one-component-per-file': 'warn',
                'vue/prop-name-casing': 'warn',
                'vue/require-default-prop': 'warn',
                'vue/require-explicit-emits': 'warn',
                'vue/require-prop-types': 'warn',
                'vue/singleline-html-element-content-newline': 'warn',
                'vue/v-bind-style': 'warn',
                'vue/v-on-style': 'warn',
                'vue/v-slot-style': 'warn',

                // Vue Recommended Rules (Minimizing Arbitrary Choices)
                'vue/attributes-order': 'warn',
                'vue/component-tags-order': 'warn',
                'vue/no-lone-template': 'warn',
                'vue/no-multiple-slot-args': 'warn',
                'vue/no-v-html': 'warn',
                'vue/order-in-components': 'warn',
                'vue/this-in-template': 'warn'
            }
        },
        // Test specific overrides
        {
            files: ['**/__tests__/*.{js,jsx,ts,tsx}', '**/tests/unit/**/*.spec.{js,jsx,ts,tsx}'],
            env: {
                jest: true,
                node: true
            },
            globals: {
                vi: true,
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
        // E2E test specific overrides
        {
            files: ['**/tests/e2e/**/*.{js,jsx,ts,tsx}'],
            env: {
                node: true,
                browser: true,
                'cypress/globals': true
            },
            plugins: ['cypress'],
            extends: ['plugin:cypress/recommended'],
            rules: {
                // Cypress specific rules
                'cypress/no-unnecessary-waiting': 'warn',
                'cypress/unsafe-to-chain-command': 'warn'
            }
        }
    ]
};
