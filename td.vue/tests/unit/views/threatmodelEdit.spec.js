import { BootstrapVue, BCard, BCardHeader, BFormTags } from 'bootstrap-vue';
import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';

import ThreatModelEdit from '@/views/ThreatModelEdit.vue';
import { THREATMODEL_CONTRIBUTORS_UPDATED, THREATMODEL_RESTORE, THREATMODEL_NOT_MODIFIED,  } from '@/store/actions/threatmodel.js';

describe('views/ThreatmodelEdit.vue', () => {
    const contributors = ['foo', 'bar' ];
    const owner = 'owner';
    const reviewer = 'reviewer';
    const title = 'title';
    const description = 'Something about a threat model';
    const diagrams = [
        { title: 'd1', description: 'd1 description', diagramType: 'CIA' },
        { title: 'd2', description: 'd2 description', diagramType: 'STRIDE' }
    ];
    const path = '/git/github/foo/bar/baz';

    let wrapper, localVue, mockRouter, mockStore, modelChanged;

    beforeEach(() => {
        console.log = jest.fn();
        modelChanged = false;
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);
        mockStore = new Vuex.Store({
            state: {
                provider: { selected: 'local' },
                threatmodel: {
                    data: {
                        summary: {
                            title,
                            owner,
                            description
                        },
                        detail: {
                            contributors: contributors.map(x =>  ({ name: x })),
                            diagrams,
                            reviewer
                        }
                    }
                }
            },
            actions: {
                [THREATMODEL_CONTRIBUTORS_UPDATED]: () => { },
                [THREATMODEL_RESTORE]: () => {}
            },
            getters: {
                modelChanged: () => modelChanged
            }
        });

        mockRouter = {
            push: jest.fn(),
            path
        };

        wrapper = mount(ThreatModelEdit, {
            localVue,
            store: mockStore,
            stubs: {
                'font-awesome-icon': { template: '<div />' }
            },
            mocks: {
                $t: key => key,
                $route: mockRouter,
                $router: mockRouter,
                $toast: { info: jest.fn() }
            }
        });
    });

    describe('layout', () => {
        it('displays the title in the header', () => {
            const header = wrapper.findComponent(BCard).findComponent(BCardHeader);
            expect(header.text()).toEqual(`threatmodel.editing: ${title}`);
        });

        it('has a title input', () => {
            expect(wrapper.find('#title').element.value).toEqual(title);
        });

        it('has an owner input', () => {
            expect(wrapper.find('#owner').element.value).toEqual(owner);
        });

        it('has a reviewer input', () => {
            expect(wrapper.find('#reviewer').element.value).toEqual(reviewer);
        });

        it('shows the description', () => {
            expect(wrapper.find('#description').element.value).toEqual(description);
        });

        it('shows the contributors', () => {
            expect(wrapper.findComponent(BFormTags).exists()).toEqual(true);
        });

        it('displays all diagrams', () => {
            expect(wrapper.findAll('.td-diagram')).toHaveLength(diagrams.length);
        });
    });

    describe('form actions', () => {
        const evt = { preventDefault: jest.fn() };

        describe('save', () => {
            beforeEach(async () => {
                mockRouter.push = jest.fn();
                mockStore.dispatch = jest.fn();
                await wrapper.find('#td-save-btn').trigger('click', evt);
            });

            it('prevents the default event', () => {
                expect(evt.preventDefault).toHaveBeenCalledTimes(1);
            });

            it('dispatches the save event', () => {
                expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_SAVE');
            });

            it('no longer routes back to the threat model page', () => {
                expect(mockRouter.push).not.toHaveBeenCalled();
            });
        });

        describe('reload', () => {

            beforeEach(() => {
                mockStore.dispatch = jest.fn();
            });

            describe('without changes', () => {
                beforeEach(async () => {
                    modelChanged = false;
                    await wrapper.find('#td-reload-btn').trigger('click', evt);
                });

                it('dispatches the restore action', () => {
                    expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_RESTORE);
                });
            });

            describe('with changes', () => {
                beforeEach(() => {
                    modelChanged = true;
                });

                describe('with confirmation', () => {
                    beforeEach(async () => {
                        wrapper.vm.getConfirmModal = jest.fn().mockResolvedValue(true);
                        await wrapper.find('#td-reload-btn').trigger('click', evt);
                    });

                    it('dispatches the restore action', () => {
                        expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_RESTORE);
                    });

                    it('dispatches the not-modified action', () => {
                        expect(mockStore.dispatch).toHaveBeenCalledWith(THREATMODEL_NOT_MODIFIED);
                    });
                });

                describe('without confirmation', () => {
                    beforeEach(async () => {
                        wrapper.vm.getConfirmModal = jest.fn().mockResolvedValue(false);
                        await wrapper.find('#td-reload-btn').trigger('click', evt);
                    });

                    it('dispatches the restore action', () => {
                        expect(mockStore.dispatch).not.toHaveBeenCalled();
                    });

                    it('prevents the default event', () => {
                        expect(evt.preventDefault).toHaveBeenCalledTimes(1);
                    });
                });
            });
        });

        describe('cancel', () => {
            describe('with confirmation', () => {
                beforeEach(async () => {
                    mockRouter.push = jest.fn();
                    wrapper.vm.restoreAsync = jest.fn().mockResolvedValue(true);
                    await wrapper.find('#td-close-btn').trigger('click', evt);
                });

                it('prevents the default event', () => {
                    expect(evt.preventDefault).toHaveBeenCalledTimes(1);
                });

                it('routes back to the threatmodel view', () => {
                    expect(mockRouter.push).toHaveBeenCalledWith({
                        name: 'localThreatModel',
                        params: mockRouter.params
                    });
                });
            });


            describe('without confirmation', () => {
                beforeEach(async () => {
                    mockRouter.push = jest.fn();
                    wrapper.vm.restoreAsync = jest.fn().mockResolvedValue(false);
                    await wrapper.find('#td-close-btn').trigger('click', evt);
                });

                it('calls the restoreAsync function', () => {
                    expect(wrapper.vm.restoreAsync).toHaveBeenCalledTimes(1);
                });

                it('does not route', () => {
                    expect(mockRouter.push).not.toHaveBeenCalled();
                });
            });
        });

        describe('add diagram', () => {
            let diagramCount, link;

            beforeEach(async () => {
                diagramCount = diagrams.length;
                link = wrapper.find('.add-diagram-link');
                await link.trigger('click', evt);
            });

            it('prevents the default action', () => {
                expect(evt.preventDefault).toHaveBeenCalledTimes(1);
            });

            it('adds a new diagram', () => {
                expect(mockStore.state.threatmodel.data.detail.diagrams).toHaveLength(diagramCount  + 1);
            });
        });

        describe('duplicate diagram', () => {
            let diagramCount, link;

            beforeEach(async () => {
                diagramCount = diagrams.length;
                link = wrapper.find('.td-duplicate-diagram');
                await link.trigger('click', evt);
            });

            it('duplicates the diagram', () => {
                expect(mockStore.state.threatmodel.data.detail.diagrams).toHaveLength(diagramCount + 1);
            });
        });

        describe('remove diagram', () => {
            let diagramCount, link;

            beforeEach(async () => {
                diagramCount = diagrams.length;
                link = wrapper.find('.td-remove-diagram');
                await link.trigger('click', evt);
            });

            it('removes the diagram', () => {
                expect(mockStore.state.threatmodel.data.detail.diagrams).toHaveLength(diagramCount  - 1);
            });
        });
    });

    describe('methods', () => {
        describe('onSubmit', () => {
            it('is a noop', () => {
                expect(() => wrapper.vm.onSubmit()).not.toThrow();
            });
        });

        describe('getConfirmModal', () => {
            beforeEach(() => {
                wrapper.vm.$bvModal.msgBoxConfirm = jest.fn();
                wrapper.vm.getConfirmModal();
            });

            it('sets the message', () => {
                expect(wrapper.vm.$bvModal.msgBoxConfirm).toHaveBeenCalledWith(
                    'forms.discardMessage',
                    expect.anything()
                );
            });

            it('sets the message box config', () => {
                expect(wrapper.vm.$bvModal.msgBoxConfirm).toHaveBeenCalledWith(
                    expect.anything(),
                    {
                        title: 'forms.discardTitle',
                        okVariant: 'danger',
                        okTitle: 'forms.ok',
                        cancelTitle: 'forms.cancel',
                        hideHeaderClose: true,
                        centered: true
                    }
                );
            });
        });

        describe('contributors setter', () => {
            const newContribs = [ '1a', '2b', '3c' ];
            beforeEach(() => {
                mockStore.dispatch = jest.fn();
                wrapper.setData({ contributors: newContribs });
            });

            it('dispatches the contributors updated event', () => {
                expect(mockStore.dispatch).toHaveBeenCalledWith(
                    THREATMODEL_CONTRIBUTORS_UPDATED,
                    newContribs
                );
            });
        });
    });
});
