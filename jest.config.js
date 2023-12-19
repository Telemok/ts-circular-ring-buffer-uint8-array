module.exports = {
    testEnvironment: 'node',
    testRegex: '/src/.*\\.test\\.(js|ts)$',
    moduleFileExtensions: ['js', 'ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};