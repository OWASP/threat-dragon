import { BRANCH_CLEAR, BRANCH_FETCH, BRANCH_SELECTED } from '@/stores/actions/branch.js';
import branchModule, { clearState } from '@/stores/branch.js';
import threatmodelApi from '@/service/api/threatmodelApi.js';

describe('stores/modules/branch.js', () => {
  const mocks = {
    commit: () => {},
    dispatch: () => {},
    rootState: {
      auth: {
        jwt: 'test'
      },
      repo: {
        selected: 'foobar'
      }
    }
  };

  beforeEach(() => {
    jest.spyOn(mocks, 'commit');
    jest.spyOn(mocks, 'dispatch');
  });

  afterEach(() => {
    clearState(branchModule.state);
  });

  describe('state', () => {
    it('defines an all array', () => {
      expect(branchModule.state.all).toBeInstanceOf(Array);
    });

    it('defines a selected string', () => {
      expect(branchModule.state.selected).toEqual('');
    });
  });

  describe('actions', () => {
    it('commits the clear action', () => {
      branchModule.actions[BRANCH_CLEAR](mocks);
      expect(mocks.commit).toHaveBeenCalledWith(BRANCH_CLEAR);
    });

    describe('fetch', () => {
      const branches = [ 'foo', 'bar' ];

      beforeEach(async () => {
        jest.spyOn(threatmodelApi, 'branchesAsync').mockResolvedValue({ data: { branches }});
        await branchModule.actions[BRANCH_FETCH](mocks);
      });

      it('dispatches the clear event', () => {
        expect(mocks.dispatch).toHaveBeenCalledWith(BRANCH_CLEAR);
      });

      it('commits the fetch action', () => {
        expect(mocks.commit).toHaveBeenCalledWith(
          BRANCH_FETCH,
          branches
        );
      });
    });

    it('commits the selected branch', () => {
      const branch = 'branch';
      branchModule.actions[BRANCH_SELECTED](mocks, branch);
      expect(mocks.commit).toHaveBeenCalledWith(BRANCH_SELECTED, branch);
    });
  });

  describe('mutations', () => {
    describe('clear', () => {
      beforeEach(() => {
        branchModule.state.all.push('test1');
        branchModule.state.all.push('test2');
        branchModule.state.selected = 'test5';
        branchModule.mutations[BRANCH_CLEAR](branchModule.state);
      });

      it('empties the all array', () => {
        expect(branchModule.state.all).toHaveLength(0);
      });

      it('resets the selected property', () => {
        expect(branchModule.state.selected).toEqual('');
      });
    });

    describe('fetch', () => {
      const branches = [ 'foo', 'bar' ];

      beforeEach(() => {
        branchModule.mutations[BRANCH_FETCH](branchModule.state, branches);
      });

      // TODO skip test because it stumbles over Vue.set
      it.skip('sets the all array to the provided branches', () => {
        expect(branchModule.state.all).toEqual(branches);
      });
    });

    describe('selected', () => {
      const branch = 'test';

      beforeEach(() => {
        branchModule.mutations[BRANCH_SELECTED](branchModule.state, branch);
      });

      it('sets the branch prop', () => {
        expect(branchModule.state.selected).toEqual(branch);
      });
    });
  });

  it('defines a getters object', () => {
    expect(branchModule.getters).toBeInstanceOf(Object);
  });
});
