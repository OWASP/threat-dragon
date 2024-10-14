import shapes from '@/service/x6/shapes/index.js';
import stencilModule from '@/service/x6/stencil.js';

describe('service/x6/stencil.js', () => {
    let container, target;
    let stencilCfg, stencilInstance;

    beforeEach(() => {
        jest.clearAllMocks();

        shapes.ActorShape = jest.fn();
        shapes.ProcessShape = jest.fn();
        shapes.StoreShape = jest.fn();
        shapes.FlowStencil = jest.fn();
        shapes.TrustBoundaryBox = jest.fn();
        shapes.TrustBoundaryCurveStencil = jest.fn();
        shapes.TextBlock = jest.fn();

        container = { appendChild: jest.fn() };
        target = {};

        const MockStencil = jest.fn().mockImplementation((cfg) => {
            stencilCfg = cfg;
            stencilInstance = {
                load: jest.fn(),
                onSearch: jest.fn(),
                container: {},
            };
            return stencilInstance;
        });

        stencilModule.get(target, container, MockStencil);
    });

    it('passes the target', () => {
        expect(stencilCfg.target).toEqual(target);
    });

    it('has a width', () => {
        expect(stencilCfg.stencilGraphWidth).toEqual(500);
    });

    it('provides layout options', () => {
        expect(stencilCfg.layoutOptions).toEqual({
            columns: 1,
            center: true,
            resizeToFit: true,
        });
    });

    it('creates an instance of TrustBoundaryBox', () => {
        expect(shapes.TrustBoundaryBox).toHaveBeenCalledTimes(1);
    });

    it('creates an instance of ProcessShape', () => {
        expect(shapes.ProcessShape).toHaveBeenCalledTimes(1);
    });

    it('creates an instance of ActorShape', () => {
        expect(shapes.ActorShape).toHaveBeenCalledTimes(1);
    });

    it('creates an instance of StoreShape', () => {
        expect(shapes.StoreShape).toHaveBeenCalledTimes(1);
    });

    it('loads the entities', () => {
        expect(stencilInstance.load).toHaveBeenCalledWith(
            [
                expect.any(Object),
                expect.any(Object),
                expect.any(Object),
                expect.any(Object),
            ],
            'components'
        );
    });

    it('loads the trust boundaries', () => {
        expect(stencilInstance.load).toHaveBeenCalledWith(
            [
                expect.any(Object),
                expect.any(Object),
            ],
            'boundaries'
        );
    });

    it('loads the metadata', () => {
        expect(stencilInstance.load).toHaveBeenCalledWith(
            [expect.any(Object)],
            'metadata'
        );
    });

    it('calls onSearch twice', () => {
        expect(stencilInstance.onSearch).toHaveBeenCalledTimes(2);
    });

    it('adds the stencil to the DOM', () => {
        expect(container.appendChild).toHaveBeenCalledWith(stencilInstance.container);
    });
});

