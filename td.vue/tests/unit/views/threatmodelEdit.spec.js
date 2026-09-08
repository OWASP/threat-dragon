import { BootstrapVue, BCard } from 'bootstrap-vue';
import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';

import ThreatModelEdit from '@/views/ThreatModelEdit.vue';
import TdDropdown from '@/components/Dropdown.vue';
import TdFormTags from '@/components/FormTags.vue';
import TdInputGroup from '@/components/InputGroup.vue';
import { threatmodelContributorsUpdated, threatmodelRestore, threatmodelNotModified, } from '@/store/actions/threatmodel.js';
import analytics from '@/service/analytics.js';

jest.mock('@/service/analytics.js', () => ({
    startEditing: jest.fn(),
    finishEditing: jest.fn(),
    track: jest.fn(),
    methodologyForDiagramType: jest.fn((diagramType) => diagramType)
}));

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
        jest.clearAllMocks();
        analytics.methodologyForDiagramType.mockImplementation((diagramType) => diagramType);
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
                            contributors: contributors.map(x => ({ name: x })),
                            diagrams,
                            diagramTop: 2,
                            reviewer
                        }
                    }
                }
            },
            actions: {
                [threatmodelContributorsUpdated]: () => { },
                [threatmodelRestore]: () => {}
            },
            getters: {
                modelChanged: () => modelChanged
            }
        });

        mockRouter = {
            push: jest.fn(),
            replace: jest.fn(),
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
                $toast: { error: jest.fn(), info: jest.fn() }
            }
        });
    });

    it('starts an editing session', () => {
        expect(analytics.startEditing).toHaveBeenCalledWith('threat_model');
    });

    describe('layout', () => {
        it('displays the title in the header', () => {
            const header = wrapper.findComponent(BCard);
            expect(header.attributes('header')).toEqual(`threatmodel.editing: ${title}`);
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
            expect(wrapper.findComponent(TdFormTags).exists()).toEqual(true);
        });

        it('displays all diagrams', () => {
            expect(wrapper.findAll('.td-diagram')).toHaveLength(diagrams.length);
        });

        it('uses input groups for diagram rows', () => {
            expect(wrapper.findAllComponents(TdInputGroup)).toHaveLength(diagrams.length);
        });

        it('has a release version input', () => {
            expect(wrapper.find('#release-version').exists()).toEqual(true);
        });

        it('has a release date input', () => {
            expect(wrapper.find('#released-at').exists()).toEqual(true);
        });

        it('selects each diagram type from the dropdown', async () => {
            const dropdown = wrapper.findComponent(TdDropdown);
            const types = ['CIA', 'CIADIE', 'LINDDUN', 'PLOT4ai', 'STRIDE', 'EOP', 'Generic'];

            for (const index of types.keys()) {
                await dropdown.find('.td-dropdown-toggle').trigger('click');
                await dropdown.findAll('.td-dropdown-item').at(index).trigger('click');
            }

            expect(wrapper.vm.model.detail.diagrams[0].diagramType).toEqual('threatmodel.diagram.generic.select');
        });

        it('marks the model modified when form fields change', async () => {
            mockStore.dispatch = jest.fn();
            const inputs = [
                wrapper.find('#title'),
                wrapper.find('#owner'),
                wrapper.find('#reviewer'),
                wrapper.find('#release-version'),
                wrapper.find('#released-at'),
                wrapper.find('#description'),
                wrapper.find('.td-diagram'),
                wrapper.find('.td-diagram-description')
            ];

            for (const input of inputs) {
                await input.setValue('changed');
            }
            await wrapper.findComponent(TdFormTags).vm.$emit('input', ['changed']);

            expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_MODIFIED');
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
                    expect(mockStore.dispatch).toHaveBeenCalledWith(threatmodelRestore);
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
                        expect(mockStore.dispatch).toHaveBeenCalledWith(threatmodelRestore);
                    });

                    it('dispatches the not-modified action', () => {
                        expect(mockStore.dispatch).toHaveBeenCalledWith(threatmodelNotModified);
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
                expect(mockStore.state.threatmodel.data.detail.diagrams).toHaveLength(diagramCount + 1);
            });

            it('does not track diagram creation before the model is saved', () => {
                expect(analytics.track).not.toHaveBeenCalled();
            });
        });

        it('tracks a created diagram with its selected methodology after a successful save', async () => {
            mockStore.state.threatmodel.data.detail.diagramTop = 3;
            const diagramIndex = wrapper.vm.model.detail.diagrams.length;
            wrapper.vm.onAddDiagramClick();
            wrapper.vm.onDiagramTypeClick(diagramIndex, 'CIA');
            const dispatch = mockStore.dispatch;
            mockStore.dispatch = jest.fn().mockResolvedValue(true);
            analytics.track.mockClear();

            await wrapper.vm.onSaveClick({ preventDefault: jest.fn() });

            expect(analytics.track).toHaveBeenCalledWith('DIAGRAM_CREATED', { methodology: 'CIA' });
            mockStore.dispatch = dispatch;
        });

        it('does not track a created diagram when saving fails', async () => {
            wrapper.vm.onAddDiagramClick();
            const dispatch = mockStore.dispatch;
            mockStore.dispatch = jest.fn();
            modelChanged = true;
            analytics.track.mockClear();

            await wrapper.vm.onSaveClick({ preventDefault: jest.fn() });

            expect(analytics.track).not.toHaveBeenCalled();
            mockStore.dispatch = dispatch;
        });

        it('does not save a model without a title', async () => {
            wrapper.vm.model.summary.title = ' ';
            mockStore.dispatch = jest.fn();

            await wrapper.vm.onSaveClick({ preventDefault: jest.fn() });

            expect(wrapper.vm.$toast.error).toHaveBeenCalledWith('Threat model must have a title');
        });

        it('tracks created diagrams after creating a model', async () => {
            mockRouter.name = 'gitThreatModelCreate';
            wrapper.vm.onAddDiagramClick();
            mockStore.dispatch = jest.fn().mockResolvedValue(true);
            analytics.track.mockClear();

            await wrapper.vm.onSaveClick({ preventDefault: jest.fn() });

            expect(analytics.track).toHaveBeenCalledWith('DIAGRAM_CREATED', { methodology: 'STRIDE' });
        });

        it('does not track created diagrams when model creation fails', async () => {
            mockRouter.name = 'gitThreatModelCreate';
            wrapper.vm.onAddDiagramClick();
            mockStore.dispatch = jest.fn().mockResolvedValue(false);
            analytics.track.mockClear();

            await wrapper.vm.onSaveClick({ preventDefault: jest.fn() });

            expect(analytics.track).not.toHaveBeenCalled();
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
                expect(mockStore.state.threatmodel.data.detail.diagrams).toHaveLength(diagramCount - 1);
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
            beforeEach(async () => {
                mockStore.dispatch = jest.fn();
                wrapper.vm.contributors = newContribs;
                await wrapper.vm.$nextTick();
            });

            it('dispatches the contributors updated event', () => {
                expect(mockStore.dispatch).toHaveBeenCalledWith(
                    threatmodelContributorsUpdated,
                    newContribs
                );
            });
        });

        it('does not track a diagram that was removed before saving', () => {
            wrapper.vm.createdDiagramIds = [999];

            wrapper.vm.trackCreatedDiagrams();

            expect(analytics.track).not.toHaveBeenCalled();
        });

        it('marks the model as modified after model metadata changes', () => {
            mockStore.dispatch = jest.fn();

            wrapper.vm.onModifyModel();

            expect(mockStore.dispatch).toHaveBeenCalledWith('THREATMODEL_MODIFIED');
        });

        it.each([
            ['CIA', 'threatmodel.diagram.stride.defaultTitle', 'CIA', 'threatmodel.diagram.cia.defaultTitle'],
            ['DIE', 'threatmodel.diagram.cia.defaultTitle', 'DIE', 'threatmodel.diagram.die.defaultTitle'],
            ['CIADIE', 'threatmodel.diagram.die.defaultTitle', 'CIADIE', 'threatmodel.diagram.die.defaultTitle'],
            ['LINDDUN', 'threatmodel.diagram.die.defaultTitle', 'LINDDUN', 'threatmodel.diagram.linddun.defaultTitle'],
            ['PLOT4ai', 'threatmodel.diagram.linddun.defaultTitle', 'PLOT4ai', 'threatmodel.diagram.plot4ai.defaultTitle'],
            ['STRIDE', 'threatmodel.diagram.plot4ai.defaultTitle', 'STRIDE', 'threatmodel.diagram.stride.defaultTitle'],
            ['EOP', 'threatmodel.diagram.stride.defaultTitle', 'EOP', 'threatmodel.diagram.eop.defaultTitle'],
            ['unknown', 'threatmodel.diagram.eop.defaultTitle', 'threatmodel.diagram.generic.select', 'threatmodel.diagram.generic.defaultTitle']
        ])('updates a default diagram title when changing to %s', (type, currentTitle, expectedType, expectedTitle) => {
            const diagram = wrapper.vm.model.detail.diagrams[0];
            diagram.title = currentTitle;

            wrapper.vm.onDiagramTypeClick(0, type);

            expect(diagram).toMatchObject({ diagramType: expectedType, title: expectedTitle });
        });

        it('preserves a custom diagram title when changing diagram type', () => {
            const diagram = wrapper.vm.model.detail.diagrams[0];
            diagram.title = 'Custom title';

            wrapper.vm.onDiagramTypeClick(0, 'CIA');

            expect(diagram.title).toBe('Custom title');
        });
    });

    it('finishes the editing session when the view unmounts', () => {
        analytics.finishEditing.mockClear();
        wrapper.destroy();
        expect(analytics.finishEditing).toHaveBeenCalledTimes(1);
    });
});
