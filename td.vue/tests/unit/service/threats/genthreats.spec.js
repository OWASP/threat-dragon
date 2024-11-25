import { createLlmThreats } from '@/service/threats/genthreats.js';
import { generateThreats } from '@/service/api/threatGenerator.js';
import { translate_to_stride, get_cell_neighbours } from '@/service/threats/genthreats.js'; // Adjust the import path as necessary
import { tc } from '@/i18n/index.js';

jest.mock('@/service/api/threatGenerator.js');
jest.mock('@/service/threats/index.js', () => ({
    createNewTypedThreat: () => {
        return {
            id: `mockId`, // Unique ID for each threat
            title: `Mock Threat`, // Title based on threat number
            status: 'Open', // Default status
            severity: 'Medium', // Default severity
            description: 'Mock description', // Mock description
            mitigation: 'Mock mitigation', // Mock mitigation
            type: 'Tampering', // Use provided cellType or default to 'Tampering'
            modelType: 'STRIDE', // Include the diagram type
            new: true, // Indicate that this is a new threat
            number: 1, // Include the threat number
            score: '', // Default score (could be set to a number if needed)
        };
    },
}));


describe('createLlmThreats', () => {
    const mockThreatModel = {
        summary: {
            title: 'Mock Threat Model',
            description: 'This is a mock threat model description.',
        },
    };

    const mockDiagram = {
        title: 'Mock Diagram',
        description: 'This is a mock diagram description.',
        cells: [],
    };

    const mockCell = {
        shape: 'flow',
        data: {
            name: 'Mock Cell',
            description: 'This is a mock cell description.',
            type: 'Tampering',
        },
        source: { cell: 'sourceId' },
        target: { cell: 'targetId' },
    };

    const mockSession = {};

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should generate threats successfully', async () => {
        const mockResponse = {
            data: {
                status: 200,
                threats: [
                    {
                        title: 'Generated Threat 1',
                        description: 'Description of generated threat 1',
                        type: 'Spoofing',
                        severity: 'High',
                        mitigation: 'Mitigation for threat 1',
                        score: 5,
                    },
                ],
            },
        };

        generateThreats.mockResolvedValue(mockResponse);

        const result = await createLlmThreats(
            mockThreatModel,
            mockDiagram,
            mockCell,
            1,
            mockSession
        );

        expect(result.status).toBe(200);
        expect(result.threats).toHaveLength(1);
        expect(result.threats[0]).toEqual(
            expect.objectContaining({
                title: 'Generated Threat 1',
                description: 'Description of generated threat 1',
                type: 'Spoofing',
                severity: 'High',
                mitigation: 'Mitigation for threat 1',
            })
        );
    });

    it('should handle API errors gracefully', async () => {
        const mockErrorResponse = {
            response: {
                status: 500,
            },
        };

        generateThreats.mockRejectedValue(mockErrorResponse);

        const result = await createLlmThreats(
            mockThreatModel,
            mockDiagram,
            mockCell,
            1,
            mockSession
        );

        expect(result.status).toBe(500);
        expect(result.threats).toEqual([]);
    });

    it('should return empty threats and status 500 if an error occurs', async () => {
        const mockError = new Error('Network Error');
        generateThreats.mockRejectedValue(mockError);

        const result = await createLlmThreats(
            mockThreatModel,
            mockDiagram,
            mockCell,
            1,
            mockSession
        );

        expect(result).toEqual({
            threats: [],
            status: 500,
        });
    });
});


describe('translate_to_stride', () => {
    it('should translate Spoofing to the correct STRIDE category', () => {
        const result = translate_to_stride('Spoofing');
        expect(result).toEqual(tc('threats.model.stride.spoofing'));
    });

    it('should translate Tampering to the correct STRIDE category', () => {
        const result = translate_to_stride('Tampering');
        expect(result).toEqual(tc('threats.model.stride.tampering'));
    });

    it('should translate Repudiation to the correct STRIDE category', () => {
        const result = translate_to_stride('Repudiation');
        expect(result).toEqual(tc('threats.model.stride.repudiation'));
    });

    it('should translate Information disclosure to the correct STRIDE category', () => {
        const result = translate_to_stride('Information disclosure');
        expect(result).toEqual(tc('threats.model.stride.informationDisclosure'));
    });

    it('should translate Denial of service to the correct STRIDE category', () => {
        const result = translate_to_stride('Denial of service');
        expect(result).toEqual(tc('threats.model.stride.denialOfService'));
    });

    it('should translate Elevation of privilege to the correct STRIDE category', () => {
        const result = translate_to_stride('Elevation of privilege');
        expect(result).toEqual(tc('threats.model.stride.elevationOfPrivilege'));
    });

    it('should default to Spoofing for unknown threat types', () => {
        const result = translate_to_stride('Unknown Threat');
        expect(result).toEqual(tc('threats.model.stride.spoofing'));
    });
});


describe('get_cell_neighbours', () => {
    it('should return the correct cell and connections for a flow cell', () => {
        const cell = {
            shape: 'flow',
            data: {
                name: 'Flow Cell',
                description: 'This is a flow cell',
            },
            source: { cell: 'sourceId' },
            target: { cell: 'targetId' },
        };

        const diagram = {
            cells: [
                {
                    id: 'sourceId',
                    shape: 'rectangle',
                    data: {
                        name: 'Source Cell',
                        description: 'This is the source cell',
                        outOfScope: false,
                    },
                },
                {
                    id: 'targetId',
                    shape: 'rectangle',
                    data: {
                        name: 'Target Cell',
                        description: 'This is the target cell',
                        outOfScope: true,
                    },
                },
            ],
        };

        const result = get_cell_neighbours(cell, diagram);

        expect(result.cell).toEqual({
            type: 'flow',
            title: 'Flow Cell',
            description: 'This is a flow cell',
        });

        expect(result.connections).toHaveLength(2);
        expect(result.connections[0].connectedCell).toEqual({
            title: 'Source Cell',
            description: 'This is the source cell',
            isExternal: false,
        });
        expect(result.connections[1].connectedCell).toEqual({
            title: 'Target Cell',
            description: 'This is the target cell',
            type: 'rectangle',
            isExternal: true,
        });
    });

    it('should return connections for a non-flow cell', () => {
        const cell = {
            shape: 'rectangle',
            id: 'targetId',
            data: {
                name: 'Target Cell',
                description: 'This is the target cell',
            },
        };

        const diagram = {
            cells: [
                {
                    id: 'flowId',
                    shape: 'flow',
                    data: {
                        name: 'Flow Cell',
                        description: 'This is a flow cell',
                    },
                    source: { cell: 'sourceId' },
                    target: { cell: 'targetId' },
                },
                {
                    id: 'sourceId',
                    shape: 'rectangle',
                    data: {
                        name: 'Source Cell',
                        description: 'This is the source cell',
                    },
                },
                {
                    id: 'targetId',
                    shape: 'rectangle',
                    data: {
                        name: 'Target Cell',
                        description: 'This is the target cell',
                    },
                },
            ],
        };

        const result = get_cell_neighbours(cell, diagram);

        expect(result.cell).toEqual({
            type: 'rectangle',
            title: 'Target Cell',
            description: 'This is the target cell',
        });

        expect(result.connections).toHaveLength(1);
        expect(result.connections[0].connectedCell).toEqual({
            title: 'Source Cell',
            description: 'This is the source cell',
            type: 'rectangle',
            isExternal: undefined, // Assuming 'outOfScope' is not defined in the mock
        });
    });

    it('should return empty connections if there are no neighbors', () => {
        const cell = {
            shape: 'rectangle',
            id: 'nonExistentId',
            data: {
                name: 'Non-existent Cell',
                description: 'This cell does not exist in the diagram',
            },
        };

        const diagram = {
            cells: [],
        };

        const result = get_cell_neighbours(cell, diagram);

        expect(result.cell).toEqual({
            type: 'rectangle',
            title: 'Non-existent Cell',
            description: 'This cell does not exist in the diagram',
        });

        expect(result.connections).toHaveLength(0);
    });
});