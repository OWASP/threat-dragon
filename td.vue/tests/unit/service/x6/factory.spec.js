jest.mock('@antv/x6', () => {
    class Stencil {
        constructor(config) {
            this.config = config;
        }
    }
    class Graph {
        constructor(config) {
            this.config = config;
        }
    }
    const Addon = { Stencil };

    return { Addon, Graph };
});

import factory from '@/service/x6/factory.js';
const { graph, stencil } = factory;
const { Addon, Graph } = require('@antv/x6');

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
        it('should create a new Addon.Stencil instance with the provided config', () => {
            const config = { target: 'stencil-container' };
            const stencilInstance = stencil(config);

            expect(stencilInstance).toBeInstanceOf(Addon.Stencil);
            expect(stencilInstance.config).toBe(config);
        });
    });
});

