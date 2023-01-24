module.exports = {
    preset: '@vue/cli-plugin-unit-jest',
    verbose: true,
    transform: {
        // process `*.js` files with `babel-jest`
        '.*\\.(js)$': 'babel-jest'
    },

    // support the same @ -> src alias mapping in source code
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^lodash-es$': 'lodash'
    },
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,vue}',
        '!src/service/demo/**',
        '!**/node_modules/**',
        '!**/coverage/**',
        '!src/main*.js', // Bootstrap code for web app and desktop app
        '!src/plugins/*.js' // Boostrap code
    ],
    resetMocks: true,
    restoreMocks: true,
    transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!lodash-es)'
    ]
};
