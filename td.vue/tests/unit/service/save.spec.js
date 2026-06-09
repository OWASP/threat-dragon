import Vue from 'vue';

import googleDriveApi from '@/service/api/googleDriveApi';
import i18n from '@/i18n/index.js';
import threatmodelApi from '@/service/api/threatmodelApi.js';

import save from '@/service/save.js';

describe('service/save.js', () => {
    const state = { data: { foo: 'bar', summary: { title: 'test title '}}};
    const rootState = {
        folder: {
            selected: 'myFolder'
        },
        branch: {
            selected: 'myBranch'
        },
        provider: {
            selected: 'github'
        },
        repo: {
            selected: 'foobar'
        }
    };

    describe('desktop', () => {
        const fileName = 'test';
        let returnValue = undefined;

        beforeEach(() => {
            window.electronAPI = {
                modelSave: jest.fn()
            };
            returnValue = save.desktop(state.data, fileName);
        });

        it('calls the electron API', () => {
            expect(window.electronAPI.modelSave).toHaveBeenCalledTimes(1);
        });

        it('returns result', () => {
            expect(window.electronAPI.modelSave).toHaveBeenCalledWith(state.data, fileName);
            expect(returnValue).toBe(true);
        });
    });
    
    describe('google', () => {
        const data = 'foobar';
        let returnValue = undefined;

        beforeEach(() => {
            Vue.$toast = {
                success: jest.fn(),
                warning: jest.fn()
            };
        });

        describe('without error', () => {
            beforeEach(async () => {
                jest.spyOn(googleDriveApi, 'updateAsync').mockResolvedValue({ data });
                returnValue = await save.google(rootState, state);
            });

            it('calls the updateAsync api', () => {
                expect(googleDriveApi.updateAsync).toHaveBeenCalledTimes(1);
            });

            it('shows a toast success message', () => {
                expect(Vue.$toast.success).toHaveBeenCalled();
            });

            it('reports success', () => {
                expect(returnValue).toBe(true);
            });
        });

        describe('with API error', () => {
            beforeEach(async () => {
                jest.spyOn(googleDriveApi, 'updateAsync').mockRejectedValue({ data });
                console.error = jest.fn();
                returnValue = await save.google(rootState, state);
            });

            it('calls the updateAsync api', () => {
                expect(googleDriveApi.updateAsync).toHaveBeenCalledTimes(1);
            });

            it('logs the error', () => {
                expect(console.error).toHaveBeenCalled();
            });

            it('shows a toast warning message', () => {
                expect(Vue.$toast.warning).toHaveBeenCalled();
            });

            it('reports fail', () => {
                expect(returnValue).toBe(false);
            });
        });
    });

    describe('googleCreate', () => {
        const data = 'foobar';
        let returnValue = '';

        beforeEach(() => {
            Vue.$toast = {
                success: jest.fn(),
                warning: jest.fn()
            };
        });

        describe('without error', () => {
            beforeEach(async () => {
                jest.spyOn(googleDriveApi, 'createAsync').mockResolvedValue(rootState.folder.selected);
                returnValue = await save.googleCreate(rootState, state);
            });

            it('calls the createAsync api', () => {
                expect(googleDriveApi.createAsync).toHaveBeenCalledTimes(1);
            });

            it('shows a toast success message', () => {
                expect(Vue.$toast.success).toHaveBeenCalled();
            });

            it('returns folder', () => {
                expect(returnValue).toEqual(rootState.folder.selected);
            });
        });

        describe('with API error', () => {
            beforeEach(async () => {
                jest.spyOn(googleDriveApi, 'createAsync').mockRejectedValue({ data });
                console.error = jest.fn();
                returnValue = await save.googleCreate(rootState, state);
            });

            it('calls the createAsync api', () => {
                expect(googleDriveApi.createAsync).toHaveBeenCalledTimes(1);
            });

            it('logs the error', () => {
                expect(console.error).toHaveBeenCalled();
            });

            it('shows a toast warning message', () => {
                expect(Vue.$toast.warning).toHaveBeenCalled();
            });

            it('returns an undefined folder', () => {
                expect(returnValue).toBeUndefined();
            });
        });
    });

    describe('local', () => {
        let mockAnchor;
        beforeEach(() => {
            Vue.$toast = {
                success: jest.fn(),
                error: jest.fn(),
                warning: jest.fn()
            };
            mockAnchor = {
                click: jest.fn(),
                remove: jest.fn()
            };
            window.URL = {
                createObjectURL: jest.fn()
            };
            document.createElement = jest.fn().mockReturnValue(mockAnchor);
            save.local(state);
        });

        it('creates the object url', () => {
            expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
        });

        it('clicks the link', () => {
            expect(mockAnchor.click).toHaveBeenCalledTimes(1);
        });

        it('removes the anchor', () => {
            expect(mockAnchor.remove).toHaveBeenCalledTimes(1);
        });
    });

    describe('repo', () => {
        const data = 'foobar';
        let returnValue = undefined;

        beforeEach(() => {
            Vue.$toast = {
                success: jest.fn(),
                error: jest.fn()
            };
        });

        describe('without error', () => {
            beforeEach(async () => {
                jest.spyOn(threatmodelApi, 'updateAsync').mockResolvedValue({ data });
                returnValue = await save.repo(rootState, state);
            });

            it('calls the updateAsync api', () => {
                expect(threatmodelApi.updateAsync).toHaveBeenCalledTimes(1);
            });

            it('shows a toast success message', () => {
                expect(Vue.$toast.success).toHaveBeenCalled();
            });

            it('reports success', () => {
                expect(returnValue).toBe(true);
            });
        });

        describe('with API error', () => {
            beforeEach(async () => {
                jest.spyOn(threatmodelApi, 'updateAsync').mockRejectedValue({ data });
                console.error = jest.fn();
                returnValue = await save.repo(rootState, state);
            });

            it('calls the updateAsync api', () => {
                expect(threatmodelApi.updateAsync).toHaveBeenCalledTimes(1);
            });

            it('logs the error', () => {
                expect(console.error).toHaveBeenCalled();
            });

            it('shows a toast error message', () => {
                expect(Vue.$toast.error).toHaveBeenCalled();
            });

            it('reports fail', () => {
                expect(returnValue).toBe(false);
            });
        });
    });

    describe('repoCreate', () => {
        const data = 'foobar';
        let returnValue = undefined;

        beforeEach(() => {
            Vue.$toast = {
                success: jest.fn(),
                error: jest.fn()
            };
        });

        describe('without error', () => {
            beforeEach(async () => {
                jest.spyOn(threatmodelApi, 'createAsync').mockResolvedValue({ data });
                returnValue = await save.repoCreate(rootState, state);
            });

            it('calls the createAsync api', () => {
                expect(threatmodelApi.createAsync).toHaveBeenCalledTimes(1);
            });

            it('shows a toast success message', () => {
                expect(Vue.$toast.success).toHaveBeenCalledTimes(1);
            });

            it('reports success', () => {
                expect(returnValue).toBe(true);
            });
        });

        describe('with API error', () => {
            beforeEach(async () => {
                jest.spyOn(threatmodelApi, 'createAsync').mockRejectedValue({ data });
                console.error = jest.fn();
                returnValue = await save.repoCreate(rootState, state);
            });

            it('calls the createAsync api', () => {
                expect(threatmodelApi.createAsync).toHaveBeenCalledTimes(1);
            });

            it('logs the error', () => {
                expect(console.error).toHaveBeenCalled();
            });

            it('shows a toast error message', () => {
                expect(Vue.$toast.error).toHaveBeenCalledWith(i18n.get().t('threatmodel.errors.create'));
            });

            it('reports fail', () => {
                expect(returnValue).toBe(false);
            });
        });

        describe('response handling', () => {

            describe('filter on status', () => {
                beforeEach(async () => {
                    const responseData = {response: {status: 422}};
                    jest.spyOn(threatmodelApi, 'createAsync').mockRejectedValue(responseData);
                    await save.repoCreate(rootState, state);
                });
    
                it('reports conflict', () => {
                    expect(Vue.$toast.error).toHaveBeenCalledWith(i18n.get().t('threatmodel.errors.createConflict'));
                });
            });

            describe('filter on message body', () => {
                beforeEach(async () => {
                    const responseData = {response: {data: {body: {message: 'test sha256'}}}};
                    responseData.response.status = 200;
                    jest.spyOn(threatmodelApi, 'createAsync').mockRejectedValue(responseData);
                    await save.repoCreate(rootState, state);
                });

                it('reports conflict', () => {
                    expect(Vue.$toast.error).toHaveBeenCalledWith(i18n.get().t('threatmodel.errors.createConflict'));
                });
            });
        });
    });

});
