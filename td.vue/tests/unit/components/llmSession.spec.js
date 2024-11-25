import { createLocalVue, mount } from '@vue/test-utils';
import { BModal, BootstrapVue } from 'bootstrap-vue';
import Vuex from 'vuex';
import TdLlmSession from '@/components/LlmSession.vue';
import diagramService from '@/service/migration/diagram.js';

jest.mock('@/service/threats/genthreats.js'); // Mock the service

describe('TdLlmSession.vue', () => {
    let graphMock, storeMock, actions, localVue, wrapper, modal;

    beforeEach(() => {
        localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.use(Vuex);
        actions = {
            LOADER_STARTED: jest.fn(),
            LOADER_FINISHED: jest.fn(),
            THREATMODEL_UPDATE: jest.fn(),
            CELL_DATA_UPDATED: jest.fn(),
            THREATMODEL_DIAGRAM_MODIFIED: jest.fn(),
            THREATMODEL_DIAGRAM_APPLIED: jest.fn(),
            THREATMODEL_MODIFIED: jest.fn(),
        };

        graphMock = {
            toJSON: jest.fn().mockReturnValue({ cells: [] }),
            history: {
                on: jest.fn()
            },
            getPlugin: jest.fn().mockReturnValue({ on: jest.fn() })
        };

        diagramService.edit = jest.fn().mockReturnValue(graphMock);
        diagramService.dispose = jest.fn();

        storeMock = new Vuex.Store({
            state: {
                provider: {
                    selected: 'github'
                },
                locale: {
                    locale: 'eng'
                },
                threatmodel: {
                    selectedDiagram: {
                        title: 'foo',
                        cells: []
                    }
                }
            },
            actions: actions
        });

        wrapper = mount(TdLlmSession, {
            localVue,
            store: storeMock,
            mocks: {
                $t: (t) => t,
                $toast: { info: jest.fn() }
            },
            data() {
                return {
                    session: {
                        provider: 'openai',
                        count: 5,
                        context: '',
                    },
                    isProcessing: false,
                };
            },
        });

        modal = wrapper.findComponent(BModal);
    });

    it('renders the modal when session exists', () => {
        expect(modal.exists()).toBe(true);
    });

    it('shows the modal when showModal is called', () => {
        wrapper.vm.showModal(); // Call the method to show modal
        expect(wrapper.vm.isProcessing).toBe(false); // Check if processing is false
        expect(wrapper.vm.progressStatus).toBe(''); // Check if progress status is reset
        expect(wrapper.vm.progress).toBe(0); // Check if progress is reset
    });

    it('hides the modal and resets state when hideModal is called', () => {
        wrapper.vm.hideModal(); // Call the method to hide modal
        expect(wrapper.vm.isProcessing).toBe(false); // Check if processing is false
        expect(wrapper.vm.progressStatus).toBe(''); // Check if progress status is reset
        expect(wrapper.vm.progress).toBe(0); // Check if progress is reset
    });
});
