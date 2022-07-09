import BootstrapVue, { BButton, BJumbotron } from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vuex from 'vuex';

import TdReadOnlyDiagram from '@/components/ReadOnlyDiagram.vue';
import TdUpgradeModal from '@/components/UpgradeModal.vue';
import tmActions from '@/store/actions/threatmodel.js';
import UpgradeDiagram from '@/views/UpgradeDiagram.vue';

describe('views/UpgradeDiagram.vue', () => {
    let storeMock, modalStub, routerMock, wrapper;

    beforeEach(() => {
        const localVue = createLocalVue();
        localVue.use(BootstrapVue);
        localVue.component('font-awesome-icon', FontAwesomeIcon);
        localVue.use(Vuex);

        routerMock = {
            push: jest.fn(),
            params: {}
        };

        modalStub = {
            render: () => {},
            methods: {
                show: jest.fn()
            }
        };

        storeMock = new Vuex.Store({
            actions: {
                [tmActions.diagramSelected]: () => {}
            },
            state: {
                threatmodel: {
                    data: {
                        detail: {
                            diagrams: [
                                { title: 'hello' }
                            ]
                        }
                    }
                },
                provider: {
                    selected: 'github'
                }
            }
        });

        wrapper = shallowMount(UpgradeDiagram, {
            localVue,
            mocks: {
                $t: t => t,
                $route: routerMock,
                $router: routerMock
            },
            store: storeMock,
            stubs: {
                'td-upgrade-modal': modalStub
            }
        });
        jest.spyOn(storeMock, 'dispatch');
    });

    it('includes the upgrade modal', () => {
        expect(wrapper.findComponent(TdUpgradeModal).exists())
            .toEqual(true);
    });

    it('shows the upgrade modal', () => {
        expect(modalStub.methods.show).toHaveBeenCalled();
    });

    it('has a jumbotron', () => {
        expect(wrapper.findComponent(BJumbotron).exists())
            .toEqual(true);
    });

    it('shows the instructions', () => {
        expect(wrapper.find('.td-instructions').text())
            .toEqual('upgrade.instructions');
    });
    
    it('has a continue button', () => {
        expect(wrapper.findComponent(BButton).text())
            .toEqual('upgrade.continue');
    });

    it('shows the diagram title', () => {
        expect(wrapper.find('.td-diagram-title').text())
            .toEqual('hello');
    });

    it('shows the edit diagram button', () => {
        expect(wrapper.findComponent('.td-diagram-edit-btn').text())
            .toEqual('forms.edit');
    });

    it('shows the read only diagram', () => {
        expect(wrapper.findComponent(TdReadOnlyDiagram).exists())
            .toEqual(true);
    });

    describe('edit', () => {
        let diagram;

        beforeEach(() => {
            diagram = { title: 'foo' };
            wrapper.vm.edit(diagram);
        });

        it('dispatches the diagram selected event', () => {
            expect(storeMock.dispatch).toHaveBeenCalledWith(
                tmActions.diagramSelected,
                diagram
            );
        });

        it('routes to the edit diagram view', () => {
            const params = Object.assign({}, routerMock.params);
            params.diagram = diagram.title;
            expect(routerMock.push).toHaveBeenCalledWith({
                name: 'gitDiagramEdit',
                params
            });
        });
    });
    
    it('continues to the threat model page', () => {
        wrapper.vm.continueToModel();
        expect(routerMock.push).toHaveBeenCalledWith({
            name: 'gitThreatModel',
            params: routerMock.params
        });
    });
});
