import Vue from 'vue';

import save from '@/service/save.js';
import {
  THREATMODEL_CLEAR,
  THREATMODEL_CREATE,
  THREATMODEL_DIAGRAM_UPDATED,
  THREATMODEL_DIAGRAM_SELECTED,
  THREATMODEL_FETCH,
  THREATMODEL_FETCH_ALL,
  THREATMODEL_SAVE,
  THREATMODEL_SELECTED,
  THREATMODEL_SET_IMMUTABLE_COPY,
  THREATMODEL_UPDATE
} from '@/stores/actions/threatmodel.js';
import threatmodelModule, { clearState } from '@/stores/threatmodel.js';
import threatmodelApi from '@/service/api/threatmodelApi.js';
import { THREATMODEL_CONTRIBUTORS_UPDATED, THREATMODEL_RESTORE } from '@/stores/actions/threatmodel';

describe('stores/modules/threatmodel.js', () => {
  const getRootState = () => ({
    auth: {
      jwt: 'test'
    },
    repo: {
      selected: 'foobar'
    },
    branch: {
      selected: 'myBranch'
    },
    provider: {
      selected: 'github'
    }
  });
  const mocks = {
    commit: () => {},
    dispatch: () => {},
    rootState: getRootState(),
    state: {}
  };

  beforeEach(() => {
    jest.spyOn(mocks, 'commit');
    jest.spyOn(mocks, 'dispatch');
    mocks.rootState = getRootState();
  });

  afterEach(() => {
    clearState(threatmodelModule.state);
  });

  describe('state', () => {
    it('defines an all array', () => {
      expect(threatmodelModule.state.all).toBeInstanceOf(Array);
    });

    it('defines a data object', () => {
      expect(threatmodelModule.state.data).toBeInstanceOf(Object);
    });

    it('defines a selectedDiagram object', () => {
      expect(threatmodelModule.state.selectedDiagram).toBeInstanceOf(Object);
    });

    it('defines an immutableCopy string', () => {
      expect(threatmodelModule.state.immutableCopy).toEqual('');
    });
  });

  describe('actions', () => {
    it('commits the clear action', () => {
      threatmodelModule.actions[THREATMODEL_CLEAR](mocks);
      expect(mocks.commit).toHaveBeenCalledWith(THREATMODEL_CLEAR);
    });

    it('commits the diagram selected action', () => {
      const diagram = { foo: 'bar' };
      threatmodelModule.actions[THREATMODEL_DIAGRAM_SELECTED](mocks, diagram);
      expect(mocks.commit).toHaveBeenCalledWith(THREATMODEL_DIAGRAM_SELECTED, diagram);
    });

    describe('create action with the data', () => {
      const data = 'foobar';

      beforeEach(() => {
        Vue.$toast = {
          success: jest.fn(),
          error: jest.fn()
        };
        mocks.state.data = {
          summary: {
            title: 'New Threat Model'
          }
        };
      });

      describe('git provider', () => {
        describe('without error', () => {
          beforeEach(async () => {
            jest.spyOn(threatmodelApi, 'createAsync').mockResolvedValue({ data });
            await threatmodelModule.actions[THREATMODEL_CREATE](mocks, 'tm');
          });

          it('dispatches the set immutable copy event', () => {
            expect(mocks.dispatch).toHaveBeenCalledWith(THREATMODEL_SET_IMMUTABLE_COPY);
          });

          it('calls the createAsync api', () => {
            expect(threatmodelApi.createAsync).toHaveBeenCalledTimes(1);
          });

          it('shows a toast success message', () => {
            expect(Vue.$toast.success).toHaveBeenCalledTimes(1);
          });
        });

        describe('with API error', () => {
          beforeEach(async () => {
            jest.spyOn(threatmodelApi, 'createAsync').mockRejectedValue({ data });
            console.error = jest.fn();
            await threatmodelModule.actions[THREATMODEL_CREATE](mocks, 'tm');
          });

          it('logs the error', () => {
            expect(console.error).toHaveBeenCalledTimes(2);
          });

          it('shows a toast error message', () => {
            expect(Vue.$toast.error).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    it('commits the diagram updated action', () => {
      const diagram = { foo: 'bar' };
      threatmodelModule.actions[THREATMODEL_DIAGRAM_UPDATED](mocks, diagram);
      expect(mocks.commit).toHaveBeenCalledWith(THREATMODEL_DIAGRAM_UPDATED, diagram);
    });

    describe('fetch', () => {
      const data = 'foobar';

      beforeEach(async () => {
        jest.spyOn(threatmodelApi, 'modelAsync').mockResolvedValue({ data });
        await threatmodelModule.actions[THREATMODEL_FETCH](mocks, 'tm');
      });

      it('dispatches the clear event', () => {
        expect(mocks.dispatch).toHaveBeenCalledWith(THREATMODEL_CLEAR);
      });

      it('commits the fetch action', () => {
        expect(mocks.commit).toHaveBeenCalledWith(
          THREATMODEL_FETCH,
          data
        );
      });
    });

    it('commits the fetch all action', async () => {
      const data = 'foobar';
      jest.spyOn(threatmodelApi, 'modelsAsync').mockResolvedValue({ data });
      await threatmodelModule.actions[THREATMODEL_FETCH_ALL](mocks);
      expect(mocks.commit).toHaveBeenCalledWith(
        THREATMODEL_FETCH_ALL,
        data
      );
    });

    it('does not do a fetch all if using a local provider', async () => {
      jest.spyOn(threatmodelApi, 'modelsAsync');
      mocks.rootState.provider.selected = 'local';
      await threatmodelModule.actions[THREATMODEL_FETCH_ALL](mocks);
      expect(threatmodelApi.modelsAsync).not.toHaveBeenCalled();
    });

    it('commits the selected action', () => {
      const data = 'foobar';
      threatmodelModule.actions[THREATMODEL_SELECTED](mocks, data);
      expect(mocks.commit).toHaveBeenCalledWith(
        THREATMODEL_SELECTED,
        data
      );
    });

    it('commits the contributors updated action', () => {
      const contribs = [ 'test1' ];
      threatmodelModule.actions[THREATMODEL_CONTRIBUTORS_UPDATED](mocks, contribs);
      expect(mocks.commit).toHaveBeenCalledWith(
        THREATMODEL_CONTRIBUTORS_UPDATED,
        contribs
      );
    });

    describe('threatmodel restore', () => {
      const originalModel = { summary: { title: 'test' }};

      beforeEach(() => {
        threatmodelApi.modelAsync = jest.fn().mockReturnValue({ data: originalModel });
        mocks.state.immutableCopy = JSON.stringify(originalModel);
        mocks.state.data = { summary: { title: 'edited test', foo: 'bar' } };
      });

      describe('local provider', () => {
        beforeEach(async () => {
          mocks.rootState.provider.selected = 'local';
          await threatmodelModule.actions[THREATMODEL_RESTORE](mocks);
        });

        it('does not call the api', () => {
          expect(threatmodelApi.modelAsync).not.toHaveBeenCalled();
        });

        it('commits the restore action with the original model', () => {
          expect(mocks.commit).toHaveBeenCalledWith(THREATMODEL_RESTORE, originalModel);
        });
      });

      describe('git provider', () => {
        beforeEach(async () => {
          await threatmodelModule.actions[THREATMODEL_RESTORE](mocks);
        });

        it('calls the api to get the threat model based on the original title', () => {
          expect(threatmodelApi.modelAsync).toHaveBeenCalledWith(
            mocks.rootState.repo.selected,
            mocks.rootState.branch.selected,
            originalModel.summary.title
          );
        });

        it('commits the restore action with the original model', () => {
          expect(mocks.commit).toHaveBeenCalledWith(THREATMODEL_RESTORE, originalModel);
        });
      });

      it('commits the set immutable copy action', () => {
        threatmodelModule.actions[THREATMODEL_SET_IMMUTABLE_COPY](mocks);
        expect(mocks.commit).toHaveBeenCalledWith(
          THREATMODEL_SET_IMMUTABLE_COPY
        );
      });
    });


    describe('save', () => {
      const data = 'foobar';

      beforeEach(() => {
        Vue.$toast = {
          success: jest.fn(),
          error: jest.fn()
        };
      });

      describe('local provider', () => {
        beforeEach(async () => {
          save.local = jest.fn();
          mocks.rootState.provider.selected = 'local';
          await threatmodelModule.actions[THREATMODEL_SAVE](mocks, 'tm');
        });

        it('saves the file locally', () => {
          expect(save.local).toHaveBeenCalledTimes(1);
        });
      });

      describe('git provider', () => {
        describe('without error', () => {
          beforeEach(async () => {
            jest.spyOn(threatmodelApi, 'updateAsync').mockResolvedValue({ data });
            await threatmodelModule.actions[THREATMODEL_SAVE](mocks, 'tm');
          });

          it('dispatches the set immutable copy event', () => {
            expect(mocks.dispatch).toHaveBeenCalledWith(THREATMODEL_SET_IMMUTABLE_COPY);
          });

          it('calls the updateAsync api', () => {
            expect(threatmodelApi.updateAsync).toHaveBeenCalledTimes(1);
          });

          it('shows a toast success message', () => {
            expect(Vue.$toast.success).toHaveBeenCalledTimes(1);
          });
        });

        describe('with API error', () => {
          beforeEach(async () => {
            jest.spyOn(threatmodelApi, 'updateAsync').mockRejectedValue({ data });
            console.error = jest.fn();
            await threatmodelModule.actions[THREATMODEL_SAVE](mocks, 'tm');
          });

          it('logs the error', () => {
            expect(console.error).toHaveBeenCalledTimes(2);
          });

          it('shows a toast error message', () => {
            expect(Vue.$toast.error).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    it('commits the diagram update action', () => {
      const update = { foo: 'bar' };
      threatmodelModule.actions[THREATMODEL_UPDATE](mocks, update);
      expect(mocks.commit).toHaveBeenCalledWith(THREATMODEL_UPDATE, update);
    });
  });

  describe('mutations', () => {
    describe('clear', () => {
      beforeEach(() => {
        threatmodelModule.state.all.push('test1');
        threatmodelModule.state.all.push('test2');
        threatmodelModule.state.data = { foo: 'bar' };
        threatmodelModule.state.selectedDiagram = { bar: 'baz' };
        threatmodelModule.mutations[THREATMODEL_CLEAR](threatmodelModule.state);
      });

      it('empties the all array', () => {
        expect(threatmodelModule.state.all).toHaveLength(0);
      });

      it('resets the data property', () => {
        expect(threatmodelModule.state.data).toEqual({});
      });

      it('resets the selectedDiagram property', () => {
        expect(threatmodelModule.state.selectedDiagram).toEqual({});
      });
    });

    describe.skip('diagramUpdated', () => {
      let diagram;
      beforeEach(() => {
        threatmodelModule.state.data.detail = {
          diagrams: [
            { id: 1 },
            { id: 2}
          ]
        };
        threatmodelModule.state.selectedDiagram = { id: 2, foo: 'bar' };
        diagram = { id: 2, foo: 'baz' };
        threatmodelModule.mutations[THREATMODEL_DIAGRAM_UPDATED](threatmodelModule.state, diagram);
      });

      it('updates the selectedDiagram', () => {
        expect(threatmodelModule.state.selectedDiagram).toEqual(diagram);
      });

      it('updates the diagrams array', () => {
        expect(threatmodelModule.state.data.detail.diagrams[1]).toEqual(diagram);
      });
    });

    describe('diagramSelected', () => {
      const diagram = { foo: 'bar' };

      beforeEach(() => {
        threatmodelModule.mutations[THREATMODEL_DIAGRAM_SELECTED](threatmodelModule.state, diagram);
      });

      it('sets the selected diagram', () => {
        expect(threatmodelModule.state.selectedDiagram).toEqual(diagram);
      });
    });

    describe('fetch', () => {
      const model = { foo: 'bar' };
      beforeEach(() => {
        threatmodelModule.mutations[THREATMODEL_FETCH](threatmodelModule.state, model);
      });

      it('sets the data property', () => {
        expect(threatmodelModule.state.data).toEqual(model);
      });
    });

    describe.skip('fetch all', () => {
      const models = [ 'foo', 'bar' ];

      beforeEach(() => {
        threatmodelModule.mutations[THREATMODEL_FETCH_ALL](threatmodelModule.state, models);
      });

      it('sets the all array to the provided models', () => {
        expect(threatmodelModule.state.all).toEqual(models);
      });
    });

    describe('selected', () => {
      const model = 'test';

      beforeEach(() => {
        threatmodelModule.mutations[THREATMODEL_SELECTED](threatmodelModule.state, model);
      });

      it('sets the model prop', () => {
        expect(threatmodelModule.state.data).toEqual(model);
      });
    });

    describe.skip('contributors updated', () => {
      const contribs = [ 'test1', 'test2' ];
      beforeEach(() => {
        threatmodelModule.state.data = {
          detail: {
            contributors: []
          }
        };
        threatmodelModule.mutations[THREATMODEL_CONTRIBUTORS_UPDATED](threatmodelModule.state, contribs);
      });

      it('sets the contributors', () => {
        expect(threatmodelModule.state.data.detail.contributors).toEqual(contribs.map(x => ({ name: x })));
      });
    });

    describe('restore', () => {
      const orig = { foo: 'bar' };
      let state;

      beforeEach(() => {
        state = { data: { bar: 'foo' }, immutableCopy: 'test' };
        threatmodelModule.mutations[THREATMODEL_RESTORE](state, orig);
      });

      it('sets the data to the original model', () => {
        expect(state.data).toEqual(orig);
      });

      it('sets the immutable copy', () => {
        expect(state.immutableCopy).toEqual(JSON.stringify(orig));
      });
    });

    describe('update', () => {
      it('updates the threat model', () => {
        const update = { version: 'bar' };
        threatmodelModule.mutations[THREATMODEL_UPDATE](threatmodelModule.state, update);
        expect(threatmodelModule.state.data.version).toEqual('bar');
      });
    });

    it('sets the immutable copy from the data', () => {
      threatmodelModule.state.data = { foo: 'bar' };
      threatmodelModule.mutations[THREATMODEL_SET_IMMUTABLE_COPY](threatmodelModule.state);
      expect(threatmodelModule.state.immutableCopy)
        .toEqual(JSON.stringify(threatmodelModule.state.data));
    });
  });

  describe('getters', () => {

    describe('contributors', () => {
      let res;
      describe('with data', () => {
        beforeEach(() => {
          threatmodelModule.state.data = {
            detail: {
              contributors: [
                { name: 'contrib 1' },
                { name: 'contrib 2' }
              ]
            }
          };
          res = threatmodelModule.getters.contributors(threatmodelModule.state);
        });

        it('defines a getters object', () => {
          expect(threatmodelModule.getters).toBeInstanceOf(Object);
        });

        it('gets the contributors', () => {
          expect(res).toHaveLength(2);
        });
      });

      describe('without data', () => {
        beforeEach(() => {
          threatmodelModule.state.data = {};
        });

        it('returns an empty array', () => {
          expect(threatmodelModule.getters.contributors(threatmodelModule.state))
            .toEqual([]);
        });
      });
    });

    describe('modelChanged', () => {
      it('returns true when the model has changed', () => {
        const state = { data: { foo: 'bar' }, immutableCopy: JSON.stringify({ something: 'else' })};
        expect(threatmodelModule.getters.modelChanged(state)).toEqual(true);
      });

      it('returns false when the model has not changed', () => {
        const state = { data: { foo: 'bar' }, immutableCopy: JSON.stringify({ foo: 'bar' })};
        expect(threatmodelModule.getters.modelChanged(state)).toEqual(false);
      });
    });

    describe('isVV1Model', () => {
      it('returns false when data is not set', () => {
        const state = { data: {} };
        expect(threatmodelModule.getters.isV1Model(state)).toEqual(false);
      });

      it('returns false when the version is set to 2.0', () => {
        const state = { data: { version: '2.0' }};
        expect(threatmodelModule.getters.isV1Model(state)).toEqual(false);
      });

      it('returns true when the version is set to 1.6.1', () => {
        const state = { data: { version: '1.6.1' }};
        expect(threatmodelModule.getters.isV1Model(state)).toEqual(true);
      });

      it('returns true when the version is not set', () => {
        const state = { data: { foo: '2.0' }};
        expect(threatmodelModule.getters.isV1Model(state)).toEqual(true);
      });
    });
  });
});
