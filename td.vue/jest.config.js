module.exports = {
    preset: '@vue/cli-plugin-unit-jest',
    'transform': {
        // process `*.js` files with `babel-jest`
        '.*\\.(js)$': 'babel-jest'
    },

    // support the same @ -> src alias mapping in source code
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,vue}',
        '!**/node_modules/**',
        '!**/coverage/**',
        '!src/main.js'
    ]
};
