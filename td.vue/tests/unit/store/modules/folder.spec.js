import {FOLDER_CLEAR/*, FOLDER_FETCH, FOLDER_SELECTED, FOLDER_NAVIGATE_BACK*/} from '@/store/actions/folder';
import repoModule, { clearState } from '@/store/modules/folder';
import { createStoreMocks } from '../../helpers/store';

describe('store/modules/folder.js', () => {

    const mocks = createStoreMocks();

    beforeEach(() => {
	    jest.spyOn(mocks, 'commit');
	    jest.spyOn(mocks, 'dispatch');
    });

    afterEach(() => {
	    clearState(repoModule.state);
    });

    describe('state', () => {
	    it('defines an all array', () => {
	        expect(repoModule.state.all).toBeInstanceOf(Array);
	    });

	    it('defines a selected string', () => {
	        expect(repoModule.state.selected).toBe('root');
	    });

	    it('defines pagination defaults', () => {
	        expect(repoModule.state.page).toBe(1);
            expect(repoModule.state.pageTokens).toBeInstanceOf(Array);
	        expect(repoModule.state.pageNext).toBe(false);
	        expect(repoModule.state.pagePrev).toBe(false);
	    });

        it('defines a parent', () => {
		    expect(repoModule.state.parentId).toBe('');
        });
    });

    describe('actions', () => {
	    it('commits the clear action', () => {
	        repoModule.actions[FOLDER_CLEAR](mocks);
	        expect(mocks.commit).toHaveBeenCalledWith(FOLDER_CLEAR);
	    });
    });
});
