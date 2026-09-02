import { folderSelected } from '@/store/actions/folder';
import {
    threatmodelClear,
    threatmodelContributorsUpdated,
    threatmodelCreate,
    threatmodelDiagramClosed,
    threatmodelDiagramModified,
    threatmodelDiagramSaved,
    threatmodelDiagramSelected,
    threatmodelFetch,
    threatmodelFetchAll,
    threatmodelLoadDemos,
    threatmodelModified,
    threatmodelNotModified,
    threatmodelRestore,
    threatmodelSave,
    threatmodelSelected,
    threatmodelStash,
    //THREATMODEL_TEMPLATE_DOWNLOAD,
    threatmodelUpdate
} from '@/store/actions/threatmodel.js';
import save from '@/service/save.js';
import threatmodelModule, { clearState } from '@/store/modules/threatmodel.js';
import googleDriveApi from '@/service/api/googleDriveApi';
import threatmodelApi from '@/service/api/threatmodelApi.js';
import tmbom from '@/service/migration/tmBom/tmBom';
import analytics from '@/service/analytics.js';

jest.mock('@/service/analytics.js', () => ({
    track: jest.fn()
}));

describe('store/modules/threatmodel.js', () => {
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

    describe('state', () => {
        it('defines an all array', () => {
            expect(threatmodelModule.state.all).toBeInstanceOf(Array);
        });

        it('defines a data object', () => {
            expect(threatmodelModule.state.data).toBeInstanceOf(Object);
        });

        it('defines a fileName', () => {
            expect(threatmodelModule.state.fileName).toEqual('');
        });

        it('defines a stash string', () => {
            expect(threatmodelModule.state.stash).toEqual('');
        });

        it('keeps track of the diagram state', () => {
            expect(threatmodelModule.state.modified).toEqual(false);
            expect(threatmodelModule.state.modifiedDiagram).toBeInstanceOf(Object);
            expect(threatmodelModule.state.selectedDiagram).toBeInstanceOf(Object);
        });
    });

    describe('actions', () => {

        beforeEach(() => {
            analytics.track.mockClear();
            jest.spyOn(mocks, 'commit');
            jest.spyOn(mocks, 'dispatch');
            mocks.rootState = getRootState();
            window.electronAPI = {
                modelClosed: jest.fn()
            };
        });

        afterEach(() => {
            clearState(threatmodelModule.state);
        });

        describe('commits the clear action', () => {
            it('clear action', () => {
                threatmodelModule.actions[threatmodelClear](mocks);
                expect(mocks.commit).toHaveBeenCalledWith(threatmodelClear);
            });
    
            it('clear action with desktop', () => {
                mocks.rootState.provider.selected = 'desktop';
                threatmodelModule.actions[threatmodelClear](mocks);
                expect(window.electronAPI.modelClosed).toHaveBeenCalledTimes(1);
            });
        });

        it('commits the contributors updated action', () => {
            const contribs = [ 'test1' ];
            threatmodelModule.actions[threatmodelContributorsUpdated](mocks, contribs);
            expect(mocks.commit).toHaveBeenCalledWith(threatmodelContributorsUpdated, contribs);
        });

        describe('create action with the data', () => {

            beforeEach(() => {
                mocks.state.data = {
                    summary: {
                        title: 'New Blank Model'
                    }
                };
            });

            describe('desktop provider', () => {
                beforeEach(async () => {
                    mocks.rootState.provider.selected = 'desktop';
                    save.desktop = jest.fn().mockReturnValue(true);
                    await threatmodelModule.actions[threatmodelCreate](mocks, 'tm');
                });

                it('creates file on desktop filesystem', () => {
                    expect(save.desktop).toHaveBeenCalledTimes(1);
                });

                it('skips the rollback event', () => {
                    expect(mocks.dispatch).not.toHaveBeenCalledWith(threatmodelStash);
                    expect(mocks.commit).not.toHaveBeenCalledWith(threatmodelNotModified);
                });
            });

            describe('git provider', () => {
                describe('without error', () => {
                    beforeEach(async () => {
                        save.repoCreate = jest.fn().mockReturnValue(true);
                        await threatmodelModule.actions[threatmodelCreate](mocks, 'tm');
                    });

                    it('creates file in the repo', () => {
                        expect(save.repoCreate).toHaveBeenCalledTimes(1);
                    });

                    it('dispatches the set rollback copy event', () => {
                        expect(mocks.dispatch).toHaveBeenCalledWith(threatmodelStash);
                    });

                    it('commits the threat model as not modified', () => {
                        expect(mocks.commit).toHaveBeenCalledWith(threatmodelNotModified);
                    });

                    it('tracks the provider only after the model is created', () => {
                        expect(analytics.track).toHaveBeenCalledWith('THREAT_MODEL_CREATED', { provider: 'github' });
                    });
                });

                describe('with API error', () => {
                    beforeEach(async () => {
                        save.repoCreate = jest.fn().mockReturnValue(false);
                        await threatmodelModule.actions[threatmodelCreate](mocks, 'tm');
                    });

                    it('attempts to create file', () => {
                        expect(save.repoCreate).toHaveBeenCalledTimes(1);
                    });

                    it('skips the set rollback copy event', () => {
                        expect(mocks.dispatch).not.toHaveBeenCalledWith(threatmodelStash);
                        expect(mocks.commit).not.toHaveBeenCalledWith(threatmodelNotModified);
                    });

                    it('does not track a failed create', () => {
                        expect(analytics.track).not.toHaveBeenCalled();
                    });
                });
            });

            describe('google provider', () => {
                describe('without error', () => {
                    const data = 'foobar';
    
                    beforeEach(async () => {
                        mocks.rootState.provider.selected = 'google';
                        save.googleCreate = jest.fn().mockReturnValue({data});
                        await threatmodelModule.actions[threatmodelCreate](mocks, 'tm');
                    });
    
                    it('dispatches the folder event', () => {
                        expect(mocks.dispatch).toHaveBeenCalledWith(folderSelected, data);
                    });
    
                    it('dispatches the set rollback copy event', () => {
                        expect(mocks.dispatch).toHaveBeenCalledWith(threatmodelStash);
                        expect(mocks.commit).toHaveBeenCalledWith(threatmodelNotModified);
                    });

                    it('tracks the provider only after the model is created', () => {
                        expect(analytics.track).toHaveBeenCalledWith('THREAT_MODEL_CREATED', { provider: 'google' });
                    });
                });
    
                describe('with missing folder', () => {
                    beforeEach(async () => {
                        mocks.rootState.provider.selected = 'google';
                        save.googleCreate = jest.fn();
                        await threatmodelModule.actions[threatmodelCreate](mocks, 'tm');
                    });
    
                    it('skips the folder event', () => {
                        expect(mocks.dispatch).not.toHaveBeenCalledWith(folderSelected, expect.anything());
                    });
    
                    it('skips the rollback event', () => {
                        expect(mocks.dispatch).not.toHaveBeenCalledWith(threatmodelStash);
                        expect(mocks.commit).not.toHaveBeenCalledWith(threatmodelNotModified);
                    });
                });
            });

            describe('local provider', () => {
                beforeEach(async () => {
                    mocks.rootState.provider.selected = 'local';
                    save.local = jest.fn().mockReturnValue(true);
                    await threatmodelModule.actions[threatmodelCreate](mocks, 'tm');
                });

                it('saves the file to local filesystem', () => {
                    expect(save.local).toHaveBeenCalledTimes(1);
                });

                it('dispatches the set rollback copy event', () => {
                    expect(mocks.dispatch).toHaveBeenCalledWith(threatmodelStash);
                    expect(mocks.commit).toHaveBeenCalledWith(threatmodelNotModified);
                });
            });
        });

        it('commits the diagram closed action', () => {
            threatmodelModule.actions[threatmodelDiagramClosed](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(threatmodelDiagramClosed);
        });

        it('commits the diagram modified action', () => {
            const diagram = { foo: 'bar' };
            threatmodelModule.actions[threatmodelDiagramModified](mocks, diagram);
            expect(mocks.commit).toHaveBeenCalledWith(threatmodelDiagramModified, diagram);
        });

        it('commits the diagram updated action', () => {
            const diagram = { foo: 'bar' };
            threatmodelModule.actions[threatmodelDiagramSaved](mocks, diagram);
            expect(mocks.commit).toHaveBeenCalledWith(threatmodelDiagramSaved, diagram);
        });

        it('commits the diagram selected action', () => {
            const diagram = { foo: 'bar' };
            threatmodelModule.actions[threatmodelDiagramSelected](mocks, diagram);
            expect(mocks.commit).toHaveBeenCalledWith(threatmodelDiagramSelected, diagram);
        });

        describe('commits the fetch action', () => {
            const data = 'foobar';

            describe('git provider', () => {
                beforeEach(async () => {
                    jest.spyOn(threatmodelApi, 'modelAsync').mockResolvedValue({ data });
                    await threatmodelModule.actions[threatmodelFetch](mocks, 'tm');
                });

                it('dispatches the clear event', () => {
                    expect(mocks.dispatch).toHaveBeenCalledWith(threatmodelClear);
                });

                it('commits the fetch action', () => {
                    expect(mocks.commit).toHaveBeenCalledWith(threatmodelFetch, data);
                });
            });

            describe('google provider', () => {
                beforeEach(async () => {
                    mocks.rootState.provider.selected = 'google';
                    jest.spyOn(googleDriveApi, 'modelAsync').mockResolvedValue({ data });
                    await threatmodelModule.actions[threatmodelFetch](mocks, 'tm');
                });

                it('dispatches the clear event', () => {
                    expect(mocks.dispatch).toHaveBeenCalledWith(threatmodelClear);
                });
    
                it('commits the fetch action', () => {
                    expect(mocks.commit).toHaveBeenCalledWith(threatmodelFetch, data);
                });
            });
        });

        it('commits the fetch all action', async () => {
            const data = 'foobar';
            jest.spyOn(threatmodelApi, 'modelsAsync').mockResolvedValue({ data });
            await threatmodelModule.actions[threatmodelFetchAll](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(threatmodelFetchAll, data);
        });

        it('commits the load demos action without calling the API', async () => {
            jest.spyOn(threatmodelApi, 'modelsAsync');
            await threatmodelModule.actions[threatmodelLoadDemos](mocks);
            expect(threatmodelApi.modelsAsync).not.toHaveBeenCalled();
            expect(mocks.commit).toHaveBeenCalledWith(
                threatmodelFetchAll,
                expect.arrayContaining([
                    expect.objectContaining({ name: expect.any(String) })
                ])
            );
        });

        it('commits the action for threat model modified', () => {
            threatmodelModule.actions[threatmodelModified](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(threatmodelModified);
        });

        describe('threatmodel restore', () => {
            const originalModel = { summary: { title: 'test' }};

            beforeEach(() => {
                threatmodelApi.modelAsync = jest.fn().mockReturnValue({ data: originalModel });
                mocks.state.stash = JSON.stringify(originalModel);
                mocks.state.data = { summary: { title: 'edited test', foo: 'bar' } };
            });

            describe('local provider', () => {
                beforeEach(async () => {
                    mocks.rootState.provider.selected = 'local';
                    await threatmodelModule.actions[threatmodelRestore](mocks);
                });

                it('does not call the api', () => {
                    expect(threatmodelApi.modelAsync).not.toHaveBeenCalled();
                });

                it('commits the restore action with the original model', () => {
                    expect(mocks.commit).toHaveBeenCalledWith(threatmodelRestore, originalModel);
                });
            });

            it('commits the diagram modified action', () => {
                threatmodelModule.actions[threatmodelNotModified](mocks);
                expect(mocks.commit).toHaveBeenCalledWith(threatmodelNotModified);
            });

            describe('git provider', () => {
                beforeEach(async () => {
                    await threatmodelModule.actions[threatmodelRestore](mocks);
                });

                it('calls the api to get the threat model based on the original title', () => {
                    expect(threatmodelApi.modelAsync).toHaveBeenCalledWith(
                        mocks.rootState.repo.selected,
                        mocks.rootState.branch.selected,
                        originalModel.summary.title
                    );
                });

                it('commits the restore action with the original model', () => {
                    expect(mocks.commit).toHaveBeenCalledWith(threatmodelRestore, originalModel);
                });
            });

            it('commits the set rollback copy action', () => {
                threatmodelModule.actions[threatmodelStash](mocks);
                expect(mocks.commit).toHaveBeenCalledWith(
                    threatmodelStash
                );
            });
        });

        describe('threatmodel save', () => {
            describe('desktop provider', () => {
                beforeEach(async () => {
                    mocks.rootState.provider.selected = 'desktop';
                    mocks.state.data = { summary: { title: 'Desktop model' } };
                    mocks.state.fileName = 'desktop-model.json';
                    await threatmodelModule.actions[threatmodelSave](mocks, 'tm');
                });

                it('saves to desktop filesystem', () => {
                    expect(save.desktop).toHaveBeenCalledWith(mocks.state.data, mocks.state.fileName);
                });

                it('defers setting stash and modified flag', () => {
                    expect(mocks.commit).not.toHaveBeenCalledWith(threatmodelStash);
                    expect(mocks.commit).not.toHaveBeenCalledWith(threatmodelNotModified);
                });
            });

            describe('git provider', () => {

                describe('without error', () => {
                    beforeEach(async () => {
                        save.repo = jest.fn().mockReturnValue(true);
                        await threatmodelModule.actions[threatmodelSave](mocks, 'tm');
                    });

                    it('saves the file to the repo', () => {
                        expect(save.repo).toHaveBeenCalledTimes(1);
                    });

                    it('dispatches the set rollback copy event', () => {
                        expect(mocks.dispatch).toHaveBeenCalledWith(threatmodelStash);
                        expect(mocks.commit).toHaveBeenCalledWith(threatmodelNotModified);
                    });

                    it('tracks the provider only after the model is saved', () => {
                        expect(analytics.track).toHaveBeenCalledWith('THREAT_MODEL_SAVED', { provider: 'github' });
                    });
                });

                describe('with API error', () => {
                    beforeEach(async () => {
                        save.repo = jest.fn().mockReturnValue(false);
                        await threatmodelModule.actions[threatmodelSave](mocks, 'tm');
                    });

                    it('calls repo', () => {
                        expect(save.repo).toHaveBeenCalledTimes(1);
                    });

                    it('skips the set rollback copy event', () => {
                        expect(mocks.dispatch).not.toHaveBeenCalledWith(threatmodelStash);
                        expect(mocks.commit).not.toHaveBeenCalledWith(threatmodelNotModified);
                    });

                    it('does not track a failed save', () => {
                        expect(analytics.track).not.toHaveBeenCalled();
                    });
                });
            });

            describe('google provider', () => {
                beforeEach(async () => {
                    save.google = jest.fn();
                    mocks.rootState.provider.selected = 'google';
                    await threatmodelModule.actions[threatmodelSave](mocks, 'tm');
                });

                it('saves the file to google drive', () => {
                    expect(save.google).toHaveBeenCalledTimes(1);
                });
            });

            describe('local provider', () => {
                beforeEach(async () => {
                    save.local = jest.fn();
                    mocks.rootState.provider.selected = 'local';
                    await threatmodelModule.actions[threatmodelSave](mocks, 'tm');
                });

                it('saves the file locally', () => {
                    expect(save.local).toHaveBeenCalledTimes(1);
                });
            });
        });

        it('commits the selected action', () => {
            const data = 'foobar';
            threatmodelModule.actions[threatmodelSelected](mocks, data);
            expect(mocks.commit).toHaveBeenCalledWith(
                threatmodelSelected,
                data
            );
        });

        it('commits the stash action', () => {
            threatmodelModule.actions[threatmodelStash](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(threatmodelStash);
        });

        it('commits the not modified / clean action', () => {
            threatmodelModule.actions[threatmodelNotModified](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(threatmodelNotModified);
        });

        it('commits the diagram update action', () => {
            const update = { foo: 'bar' };
            threatmodelModule.actions[threatmodelUpdate](mocks, update);
            expect(mocks.commit).toHaveBeenCalledWith(threatmodelUpdate, update);
        });
    });

    describe('mutations', () => {

        beforeEach(() => {
            jest.spyOn(mocks, 'commit');
            jest.spyOn(mocks, 'dispatch');
            mocks.rootState = getRootState();
        });

        afterEach(() => {
            clearState(threatmodelModule.state);
        });

        describe('threat model clear', () => {
            beforeEach(() => {
                threatmodelModule.state.all.push('test1');
                threatmodelModule.state.all.push('test2');
                threatmodelModule.state.data = { foo: 'bar' };
                threatmodelModule.state.modified = true;
                threatmodelModule.state.selectedDiagram = { bar: 'baz' };
                threatmodelModule.mutations[threatmodelClear](threatmodelModule.state);
            });

            it('empties the all array', () => {
                expect(threatmodelModule.state.all).toHaveLength(0);
            });

            it('resets the data property', () => {
                expect(threatmodelModule.state.data).toEqual({});
            });

            it('sets the modified property', () => {
                expect(threatmodelModule.state.modified).toEqual(false);
            });

            it('resets the selectedDiagram property', () => {
                expect(threatmodelModule.state.selectedDiagram).toEqual({});
            });
        });

        describe('threat model contributors updated', () => {
            beforeEach(() => {
                threatmodelModule.state.data.detail = {contributors: []};
            });

            it('copies contributors array', () => {
                const contributors = [{name: 'foo'}, {name: 'bar'}, {name: 'baz'}];
                threatmodelModule.mutations[threatmodelContributorsUpdated](threatmodelModule.state, contributors);
                expect(threatmodelModule.state.data.detail.contributors).toBeInstanceOf(Array);
                expect(threatmodelModule.state.data.detail.contributors).toHaveLength(3);
            });

            it('copies contributor object', () => {
                const contributors = {name: 'foo'};
                threatmodelModule.mutations[threatmodelContributorsUpdated](threatmodelModule.state, contributors);
                expect(threatmodelModule.state.data.detail.contributors).toBeInstanceOf(Array);
                expect(threatmodelModule.state.data.detail.contributors).toHaveLength(1);
            });

            it('handles empty contributors', () => {
                threatmodelModule.mutations[threatmodelContributorsUpdated](threatmodelModule.state, null);
                expect(threatmodelModule.state.data.detail.contributors).toBeInstanceOf(Array);
                expect(threatmodelModule.state.data.detail.contributors).toHaveLength(0);
            });
        });

        describe('threat model diagram closed', () => {
            beforeEach(() => {
                threatmodelModule.state.modified = true;
                threatmodelModule.state.modifiedDiagram = {foo: 'bar' };
                threatmodelModule.mutations[threatmodelDiagramClosed](threatmodelModule.state);
            });

            it('resets the modified diagram', () => {
                expect(threatmodelModule.state.modifiedDiagram).toEqual({});
            });

            it('sets the modified flag', () => {
                expect(threatmodelModule.state.modified).toEqual(false);
            });
        });

        describe('threat model diagram modified', () => {
            const modifiedDiagram = {foo: 'bar'};
            beforeEach(() => {
                threatmodelModule.state.modified = false;
            });

            it('copies modified diagram', () => {
                const diagram = {foo: 'baz'};
                threatmodelModule.state.modifiedDiagram = modifiedDiagram;
                threatmodelModule.mutations[threatmodelDiagramModified](threatmodelModule.state, diagram);
                expect(threatmodelModule.state.modified).toEqual(true);
                expect(threatmodelModule.state.modifiedDiagram).toEqual(diagram);
            });

            it('rejects empty diagram', () => {
                threatmodelModule.state.modifiedDiagram = modifiedDiagram;
                threatmodelModule.mutations[threatmodelDiagramModified](threatmodelModule.state, null);
                expect(threatmodelModule.state.modified).toEqual(false);
                expect(threatmodelModule.state.modifiedDiagram).toEqual(modifiedDiagram);
            });

            it('handles absent modified diagram key', () => {
                const diagram = {foo: 'bar'};
                threatmodelModule.state.modifiedDiagram = {};
                threatmodelModule.mutations[threatmodelDiagramModified](threatmodelModule.state, diagram);
                expect(threatmodelModule.state.modified).toEqual(false);
            });
        });

        describe('threat model diagram saved', () => {
            const diagrams = [
                {id: 'foo', title: 'title foo'},
                {id: 'bar', title: 'title bar'},
                {id: 'test', title: 'title test'}
            ];
            const newDiagram = {id: 'test', title: 'new test title', version: 'new test version'};
            const unknownDiagram = {id: 'unknown', title: 'unknown title', version: 'unknown version'};

            beforeEach(() => {
                threatmodelModule.state.data = {version: 'version test', detail: {diagrams: diagrams}};
                threatmodelModule.state.selectedDiagram = {};
                threatmodelModule.state.stash = '';
            });

            it('saves the modified diagram', () => {
                threatmodelModule.mutations[threatmodelDiagramSaved](threatmodelModule.state, newDiagram);
                expect(threatmodelModule.state.selectedDiagram).toEqual(newDiagram);
                expect(threatmodelModule.state.data.detail.diagrams.at(-1)).toEqual(newDiagram);
            });

            it('sets the overall version', () => {
                threatmodelModule.mutations[threatmodelDiagramSaved](threatmodelModule.state, newDiagram);
                expect(threatmodelModule.state.data.version).toEqual(newDiagram.version);
            });

            it('stashes the diagram', () => {
                threatmodelModule.mutations[threatmodelDiagramSaved](threatmodelModule.state, newDiagram);
                expect(threatmodelModule.state.stash).toEqual(JSON.stringify(threatmodelModule.state.data));
            });

            it('ignores an unknown diagram', () => {
                threatmodelModule.mutations[threatmodelDiagramSaved](threatmodelModule.state, unknownDiagram);
                expect(threatmodelModule.state.selectedDiagram).toEqual(unknownDiagram);
                expect(threatmodelModule.state.data.detail.diagrams).toEqual(diagrams);
                expect(threatmodelModule.state.data.version).toEqual(unknownDiagram.version);
                expect(threatmodelModule.state.stash).toEqual(JSON.stringify(threatmodelModule.state.data));
            });
        });

        describe('threat model diagram selected', () => {
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
                threatmodelModule.mutations[threatmodelDiagramSelected](threatmodelModule.state, diagram);
            });

            it('sets the selected diagram', () => {
                expect(threatmodelModule.state.selectedDiagram).toEqual(diagram);
            });
        });

        describe('threat model fetch', () => {
            const model = { foo: 'bar' };
            beforeEach(() => {
                threatmodelModule.mutations[threatmodelFetch](threatmodelModule.state, model);
            });

            it('sets the data property', () => {
                expect(threatmodelModule.state.data).toEqual(model);
            });
        });

        describe('fetch all threat models', () => {
            const models = [{ foo: 'bar' }, { foo: 'baz' }];
            beforeEach(() => {
                threatmodelModule.state.all = [];
                threatmodelModule.mutations[threatmodelFetchAll](threatmodelModule.state, models);
            });

            it('sets the models', () => {
                expect(threatmodelModule.state.all).toHaveLength(2);
                expect(threatmodelModule.state.all).toStrictEqual(models);
            });
        });

        describe('modified threat model', () => {
            beforeEach(() => {
                threatmodelModule.state.modified = false;
                threatmodelModule.mutations[threatmodelModified](threatmodelModule.state);
            });

            it('sets the modified flag', () => {
                expect(threatmodelModule.state.modified).toEqual(true);
            });
        });

        describe('restore threat model', () => {
            const orig = { foo: 'bar' };
            let state;

            beforeEach(() => {
                state = { data: { bar: 'foo' }, stash: 'test' };
                threatmodelModule.mutations[threatmodelRestore](state, orig);
            });

            it('sets the data to the original model', () => {
                expect(state.data).toEqual(orig);
            });

            it('sets the immutable copy', () => {
                expect(state.stash).toEqual(JSON.stringify(orig));
            });
        });

        describe('threat model selected', () => {
            const model = 'test';

            beforeEach(() => {
                threatmodelModule.mutations[threatmodelSelected](threatmodelModule.state, model);
            });

            it('sets the model prop', () => {
                expect(threatmodelModule.state.data).toEqual(model);
            });
        });

        describe('stash threat model', () => {
            it('sets the rollback copy from the data', () => {
                threatmodelModule.state.data = { foo: 'bar' };
                threatmodelModule.mutations[threatmodelStash](threatmodelModule.state);
                expect(threatmodelModule.state.stash)
                    .toEqual(JSON.stringify(threatmodelModule.state.data));
            });
        });

        describe('threat model not modified', () => {
            it('resets the modified flag', () => {
                threatmodelModule.state.modified = true;
                threatmodelModule.mutations[threatmodelNotModified](threatmodelModule.state);
                expect(threatmodelModule.state.modified).toEqual(false);
            });
        });

        describe('threat model updated', () => {
            const update = { version: 'foo', fileName: 'bar', diagramTop: 11, threatTop: 22, unknown: 'test'};
            const initialData = { version: 'bar', detail: {diagramTop: 0, threatTop: 0} };

            beforeEach(() => {
                threatmodelModule.state.fileName = 'foo';
                threatmodelModule.state.data = initialData;
            });

            it('updates the threat model', () => {
                threatmodelModule.mutations[threatmodelUpdate](threatmodelModule.state, update);
                expect(threatmodelModule.state.data.version).toEqual(update.version);
                expect(threatmodelModule.state.fileName).toEqual(update.fileName);
                expect(threatmodelModule.state.data.detail.diagramTop).toBe(update.diagramTop);
                expect(threatmodelModule.state.data.detail.threatTop).toBe(update.threatTop);
            });

            it('ignores unknown threat model keys', () => {
                threatmodelModule.mutations[threatmodelUpdate](threatmodelModule.state, {test_key: 'test'});
                expect(threatmodelModule.state.data.version).toEqual(initialData.version);
                expect(threatmodelModule.state.data.detail.diagramTop).toBe(initialData.detail.diagramTop);
                expect(threatmodelModule.state.data.detail.threatTop).toBe(initialData.detail.threatTop);
            });
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

            describe('without detail', () => {
                beforeEach(() => {
                    threatmodelModule.state.data.detail = {};
                });

                it('returns an empty array', () => {
                    expect(threatmodelModule.getters.contributors(threatmodelModule.state))
                        .toEqual([]);
                });
            });
        });

        describe('modelChanged', () => {
            it('returns true when the model has changed', () => {
                const state = { modified: true};
                expect(threatmodelModule.getters.modelChanged(state)).toEqual(true);
            });

            it('returns false when the model has not changed', () => {
                const state = { modified: false};
                expect(threatmodelModule.getters.modelChanged(state)).toEqual(false);
            });
        });

        describe('isV1Model', () => {
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

        describe('tmBomExport', () => {
            const state = { data: {} };

            beforeEach(async () => {
                tmbom.exportAsTmbom = jest.fn().mockReturnValue({trust_boundaries: []});
            });

            it('returns a threat model', () => {
                expect(threatmodelModule.getters.tmBomExport(state)).toBeInstanceOf(Object);
                expect(tmbom.exportAsTmbom).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('clearState', () => {
        beforeEach(() => {
            clearState(threatmodelModule.state);
        });

        it('defines an all array', () => {
            expect(threatmodelModule.state.all).toHaveLength(0);
        });
    
        it('defines a data object', () => {
            expect(threatmodelModule.state.data).toEqual({});
        });
    
        it('defines an empty fileName', () => {
            expect(threatmodelModule.state.fileName).toEqual('');
        });
    
        it('defines an empty stash string', () => {
            expect(threatmodelModule.state.stash).toEqual('');
        });
    
        it('keeps track of the diagram state', () => {
            expect(threatmodelModule.state.modified).toEqual(false);
            expect(threatmodelModule.state.modifiedDiagram).toEqual({});
            expect(threatmodelModule.state.selectedDiagram).toEqual({});
        });
    });
});
