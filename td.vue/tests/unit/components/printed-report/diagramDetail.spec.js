import { shallowMount, createLocalVue } from '@vue/test-utils';

import TdDiagramDetail from '@/components/printed-report/DiagramDetail.vue';
import TdReadOnlyDiagram from '@/components/ReadOnlyDiagram.vue';
import TdReportEntity from '@/components/printed-report/ReportEntity.vue';

describe('components/printed-report/DiagramDetail.vue', () => {
    let propsData, wrapper;

    const getData = () => ({
        diagram: {
            title: 'foo',
            cells: []
        },
        showOutOfScope: true,
        showMitigated: true,
        showDiagram: true
    });

    const setup = (data) => {
        const localVue = createLocalVue();
        wrapper = shallowMount(TdDiagramDetail, {
            localVue,
            propsData: {
                diagram: data.diagram,
                showOutOfScope: data.showOutOfScope,
                showMitigated: data.showMitigated,
                showDiagram: data.showDiagram
            }
        });
    };

    describe('with diagram', () => {
        beforeEach(() => {
            propsData = getData();
            setup(propsData);
        });

        it('displays the diagram title', () => {
            expect(wrapper.find('.diagram-page-title').text())
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

    describe('threats', () => {
        beforeEach(() => {
            propsData = getData();
            setup(propsData);
        });

        it('displays the diagram title', () => {
            expect(wrapper.find('.td-threats-title').text())
                .toEqual(propsData.diagram.title);
        });
    });

    describe('entitiesWithThreats', () => {
        let cells;

        it('shows out of scope enties', () => {
            cells = [
                { outOfScope: true, data: { threats: [ {} ] } }
            ];
            propsData = getData();
            propsData.diagram.cells = cells;
            setup(propsData);
            expect(wrapper.findAllComponents(TdReportEntity).length).toEqual(1);
        });

        it('shows mitigated threats', () => {
            cells = [
                { outOfScope: true, data: { threats: [ { status: 'Mitigated' } ] } }
            ];
            propsData = getData();
            propsData.diagram.cells = cells;
            setup(propsData);
            expect(wrapper.findAllComponents(TdReportEntity).exists()).toEqual(true);
        });

        it('hides mitigated threats', () => {
            cells = [
                { data: { threats: [ { status: 'Mitigated' } ] } }
            ];
            propsData = getData();
            propsData.diagram.cells = cells;
            propsData.showMitigated = false;
            setup(propsData);
            expect(wrapper.findAllComponents(TdReportEntity).exists()).toEqual(false);
        });
    });
});
