module.exports = async () => {
    return {
        preset: '@vue/cli-plugin-unit-jest',
        verbose: true,
        testEnvironment: 'jsdom',
        transform: {
            // process `*.vue` files with vue3-jest
            '^.+\\.vue$': '@vue/vue3-jest',
            // process `*.js` files with `babel-jest`
            '.*\\.(js)$': 'babel-jest'
        },
        moduleNameMapper: {
            '^@/(.*)$': '<rootDir>/src/$1',
            '^lodash-es$': 'lodash',
            '\\.(css|less|scss|sass)$': '<rootDir>/tests/unit/setup/styleMock.js',
            '^electron$': '<rootDir>/tests/unit/setup/electronMock.js',
            '^bootstrap-vue-next$': '<rootDir>/tests/unit/setup/bootstrap-vue-next.js'
        },
        collectCoverage: true,
        collectCoverageFrom: [
            'src/**/*.{js,vue}',
            '!src/service/demo/**',
            '!**/.vue2-backup/**', // Exclude Vue 2 backup files
            '!**/*.vue2-backup.*', // Exclude Vue 2 backup files with extension suffix
            '!**/node_modules/**',
            '!**/coverage/**',
            '!src/main*.js', // Bootstrap code for web app and desktop app
            '!src/plugins/*.js' // Bootstrap code
        ],
        resetMocks: true,
        restoreMocks: true,
        transformIgnorePatterns: [
            '<rootDir>/node_modules/(?!lodash-es|axios|passive-events-support)'
        ],
        setupFiles: [
            '<rootDir>/tests/unit/setup/setupTests.js'
        ],
        // Configure Jest to suppress specific warnings
        setupFilesAfterEnv: [
            '<rootDir>/tests/unit/setup/setupAfterEnv.js'
        ]
    };
};