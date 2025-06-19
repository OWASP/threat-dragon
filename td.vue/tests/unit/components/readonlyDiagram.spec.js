import { shallowMount, createLocalVue } from '@vue/test-utils';

import diagramService from '@/service/diagram/diagram.js';
import TdReadOnlyDiagram from '@/components/ReadOnlyDiagram.vue';

describe('components/ReadOnlyDiagram.vue', () => {
    let addEventListenerSpy, diagram, graphMock, removeEventListenerSpy, wrapper;

    beforeEach(() => {
        addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
        diagramService.dispose = jest.fn();
        graphMock = {
            resize: jest.fn(),
            scaleContentToFit: jest.fn(),
        };
        diagramService.draw = jest.fn().mockReturnValue(graphMock);
        diagram = { foo: 'bar' };
        const localVue = createLocalVue();
        wrapper = shallowMount(TdReadOnlyDiagram, {
            localVue,
            propsData: {
                diagram
            }
        });
    });

    it('has the diagram container', () => {
        expect(wrapper.findComponent({ ref: 'diagram_container' }).exists()).toEqual(true);
    });

    it('draws the graph', () => {
        expect(diagramService.draw).toHaveBeenCalledWith(expect.anything(), diagram);
    });

    it('resizes the graph', () => {
        expect(graphMock.resize).toHaveBeenCalledTimes(1);
    });

    it('scales the content to fit', () => {
        expect(graphMock.scaleContentToFit).toHaveBeenCalledTimes(1);
    });

    it('listens for resize events', () => {
        expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.anything());
    });
    
    it('removes the window event listener', () => {
        wrapper.destroy();
        expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.anything());
    });
    
    it('disposes the graph', () => {
        wrapper.destroy();
        expect(diagramService.dispose).toHaveBeenCalled();
    });
});
