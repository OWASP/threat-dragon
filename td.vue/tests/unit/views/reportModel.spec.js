import BootstrapVue from 'bootstrap-vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';

import ReportModel from '@/views/ReportModel.vue';
import TdCoversheet from '@/components/report/Coversheet.vue';
import TdDiagramDetail from '@/components/report/DiagramDetail.vue';
import TdExecutiveSummary from '@/components/report/ExecutiveSummary.vue';

describe('views/ReportModel.vue', () => {
    let routerMock, storeMock, wrapper;

    beforeEach(() => {
        const localVue = createLocalVue();
        localVue.use(Vuex);
        localVue.use(BootstrapVue);

        routerMock = { push: jest.fn(), params: {} };
        storeMock = new Vuex.Store({
            state: {
                threatmodel: {
                    data: {
                        summary: {
                            title: 'My title',
                            owner: 'some owner',
                            description: 'Aweomse sauce'
                        },
                        detail: {
                            reviewer: 'Reviewer',
                            contributors: ['Contribs'],
                            diagrams: [
                                { cells: [{ threats: [{ foo: 'bar' }] }]}
                            ]
                        }
                    }
                },
                provider: {
                    selected: 'local'
                }
            },
            getters: {
                contributors: () => []
            }
        });
        wrapper = shallowMount(ReportModel, {
            localVue,
            store: storeMock,
            mocks: {
                $route: routerMock,
                $router: routerMock,
                $t: t => t
            }
        });
    });

    describe('report options', () => {
        it('has an option for showing out of scope entities', () => {
            expect(wrapper.find('#show_outofscope').exists())
                .toEqual(true);
        });
    
        it('has an option for showing out of mitigated threats', () => {
            expect(wrapper.find('#show_mitigated').exists())
                .toEqual(true);
        });
    
        it('has an option for showing out of the diagrams', () => {
            expect(wrapper.find('#show_models').exists())
                .toEqual(true);
        });
    
        it('has an option for showing Threat Dragon branding', () => {
            expect(wrapper.find('#show_branding').exists())
                .toEqual(true);
        });
    
        it('has a print button', () => {
            expect(wrapper.findComponent('#td-print-btn').exists())
                .toEqual(true);
        });
    
        it('has a return button', () => {
            expect(wrapper.findComponent('#td-return-btn').exists())
                .toEqual(true);
        });
    
        it('does not display the save pdf button', () => {
            expect(wrapper.findComponent('#td-save-pdf-btn').exists())
                .toEqual(false);
        });
    });

    it('shows the cover sheet', () => {
        expect(wrapper.findComponent(TdCoversheet).exists())
            .toEqual(true);
    });

    it('shows the executive summary', () => {
        expect(wrapper.findComponent(TdExecutiveSummary).exists())
            .toEqual(true);
    });

    it('shows the diagram detail', () => {
        expect(wrapper.findComponent(TdDiagramDetail).exists())
            .toEqual(true);
    });

    it('closes the report', () => {
        wrapper.vm.onCloseClick();
        expect(routerMock.push).toHaveBeenCalledWith({
            name: 'localThreatModel',
            params: routerMock.params
        });
    });

    it('opens the print dialogue', () => {
        jest.spyOn(window, 'print');
        window.print.mockImplementation(() => {});
        wrapper.vm.print();
        expect(window.print).toHaveBeenCalledTimes(1);
    });
});
