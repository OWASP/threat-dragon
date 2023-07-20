import BootstrapVue from 'bootstrap-vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import TdDiagramDetail from '@/components/report/DiagramDetail.vue';
import TdReadOnlyDiagram from '@/components/ReadOnlyDiagram.vue';
import TdReportEntity from '@/components/report/ReportEntity.vue';

describe('components/report/DiagramDetail.vue', () => {
    let propsData, wrapper;

    const getData = () => ({
        diagram: {
            title: 'foo',
            cells: []
        },
        showDiagram: true,
        showMitigated: true,
        showOutOfScope: true,
        showEmpty: true
    });

    const setup = (data) => {
        const localVue = createLocalVue();
        localVue.use(BootstrapVue);
        wrapper = shallowMount(TdDiagramDetail, {
            localVue,
            propsData: {
                diagram: data.diagram,
                showDiagram: data.showDiagram,
                showMitigated: data.showMitigated,
                showOutOfScope: data.showOutOfScope,
                showEmpty: data.showEmpty
            }
        });
    };

    describe('with diagram', () => {
        beforeEach(() => {
            propsData = getData();
            setup(propsData);
        });

        it('displays the diagram title', () => {
            expect(wrapper.find('.td-diagram-title').text())
                .toEqual(propsData.diagram.title);
        });

        it('shows the diagram', () => {
            expect(wrapper.findComponent(TdReadOnlyDiagram).exists())
                .toEqual(true);
        });
    });

    describe('without diagram', () => {
        beforeEach(() => {
            propsData = getData();
            propsData.showDiagram = false;
            setup(propsData);
        });

        it('displays the diagram title', () => {
            expect(wrapper.find('.diagram-page-title').exists())
                .toEqual(false);
        });

        it('shows the diagram', () => {
            expect(wrapper.findComponent(TdReadOnlyDiagram).exists())
                .toEqual(false);
        });
    });

    describe('entitiesWithThreats', () => {
        let cells;

        it('shows empty elements', () => {
            cells = [
                { data: { threats: [] } },
                { data: { threats: [ {} ] } },
            ];
            propsData = getData();
            propsData.diagram.cells = cells;
            setup(propsData);
            expect(wrapper.findAllComponents(TdReportEntity)).toHaveLength(2);
        });

        it('hides empty elements', () => {
            cells = [
                { data: { threats: [] } },
                { data: { threats: [ {} ] } },
            ];
            propsData = getData();
            propsData.diagram.cells = cells;
            propsData.showEmpty = false;
            setup(propsData);
            expect(wrapper.findAllComponents(TdReportEntity)).toHaveLength(1);
        });

        it('shows out of scope elements', () => {
            cells = [
                { data: { outOfScope: false, threats: [ {} ] } },
                { data: { outOfScope: true, threats: [ {} ] } },
            ];
            propsData = getData();
            propsData.diagram.cells = cells;
            propsData.showEmpty = false;
            setup(propsData);
            expect(wrapper.findAllComponents(TdReportEntity)).toHaveLength(2);
        });

        it('hides out of scope elements', () => {
            cells = [
                { data: { outOfScope: false, threats: [ {} ] } },
                { data: { outOfScope: true, threats: [ {} ] } },
            ];
            propsData = getData();
            propsData.diagram.cells = cells;
            propsData.showEmpty = false;
            propsData.showOutOfScope = false;
            setup(propsData);
            expect(wrapper.findAllComponents(TdReportEntity)).toHaveLength(1);
        });

        it('shows mitigated threats', () => {
            cells = [
                { data: { threats: [ { status: 'Open' } ] } },
                { data: { threats: [ { status: 'Mitigated' } ] } },
                { data: { threats: [ { status: 'Mitigated'}, { status: 'Open' } ] } }
            ];
            propsData = getData();
            propsData.diagram.cells = cells;
            propsData.showEmpty = false;
            setup(propsData);
            expect(wrapper.findAllComponents(TdReportEntity)).toHaveLength(3);
        });

        it('hides mitigated threats', () => {
            cells = [
                { data: { threats: [ { status: 'Open' } ] } },
                { data: { threats: [ { status: 'Mitigated' } ] } },
                { data: { threats: [ { status: 'Mitigated'}, { status: 'Open' } ] } }
            ];
            propsData = getData();
            propsData.diagram.cells = cells;
            propsData.showEmpty = false;
            propsData.showMitigated = false;
            setup(propsData);
            expect(wrapper.findAllComponents(TdReportEntity)).toHaveLength(2);
        });
    });
});
