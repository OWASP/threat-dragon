import {
    DATASOURCE_PROVIDER_SELECTED,
    DATASOURCE_PROVIDER_CLEAR,
    DATASOURCE_REPOSITORY_SELECTED,
    DATASOURCE_REPOSITORY_CLEAR,
    DATASOURCE_BRANCH_SELECTED,
    DATASOURCE_BRANCH_CLEAR,
    DATASOURCE_THREATMODEL_SELECTED,
    DATASOURCE_THREATMODEL_CLEAR
} from '@/store/actions/datasource.js';

describe('store/actions/datasource.js', () => {
    it('defines a provider selected action', () => {
        expect(DATASOURCE_PROVIDER_SELECTED).not.toBeUndefined();
    });

    it('defines a provider clear action', () => {
        expect(DATASOURCE_PROVIDER_CLEAR).not.toBeUndefined();
    });

    it('defines a repository selected action', () => {
        expect(DATASOURCE_REPOSITORY_SELECTED).not.toBeUndefined();
    });

    it('defines a repository clear action', () => {
        expect(DATASOURCE_REPOSITORY_CLEAR).not.toBeUndefined();
    });

    it('defines a brarnch selected action', () => {
        expect(DATASOURCE_BRANCH_SELECTED).not.toBeUndefined();
    });

    it('defines a brarnch clear action', () => {
        expect(DATASOURCE_BRANCH_CLEAR).not.toBeUndefined();
    });

    it('defines a threatmodel selected action', () => {
        expect(DATASOURCE_THREATMODEL_SELECTED).not.toBeUndefined();
    });

    it('defines a threatmodel clear action', () => {
        expect(DATASOURCE_THREATMODEL_CLEAR).not.toBeUndefined();
    });
});