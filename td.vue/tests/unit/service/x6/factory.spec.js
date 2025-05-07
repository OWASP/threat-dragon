// Mock X6 and X6 Stencil plugin
jest.mock('@antv/x6', () => {
    class Graph {
        constructor(config) {
            this.config = config;
        }
    }
    return { Graph };
});

jest.mock('@antv/x6-plugin-stencil', () => {
    class Stencil {
        constructor(config) {
            this.config = config;
        }
    }
    return { Stencil };
});

import factory from '@/service/x6/factory.js';
const { graph, stencil } = factory;
const { Graph } = require('@antv/x6');
const { Stencil } = require('@antv/x6-plugin-stencil');

describe('Module Exports', () => {
    describe('graph function', () => {
        it('should create a new Graph instance with the provided config', () => {
            const config = { container: 'graph-container' };
            const graphInstance = graph(config);

            expect(graphInstance).toBeInstanceOf(Graph);
            expect(graphInstance.config).toBe(config);
        });
    });

    describe('stencil function', () => {
        it('should create a new Stencil instance with the provided config', () => {
            const config = { target: 'stencil-container' };
            const stencilInstance = stencil(config);

            expect(stencilInstance).toBeInstanceOf(Stencil);
            expect(stencilInstance.config).toBe(config);
        });
    });
});

