module.exports = async () => {
    return {
        preset: '@vue/cli-plugin-unit-jest',
        verbose: true,
        transform: {
            // process `*.js` files with `babel-jest`
            '.*\\.(js)$': 'babel-jest'
        },
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
            '!src/plugins/*.js' // Bootstrap code
        ],
        resetMocks: true,
        restoreMocks: true,
        transformIgnorePatterns: [
            '<rootDir>/node_modules/(?!lodash-es|axios|passive-events-support)'
        ]
    };
};

