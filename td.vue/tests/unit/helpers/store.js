export const createStoreMocks = (overrides = {}) => ({
    commit: jest.fn(),
    dispatch: jest.fn(),
    rootState: {
        auth: { jwt: 'test' },
        repo: { selected: 'foobar' },
        ...overrides,
    },
});
