import { convert as convertOTMtoTD } from '@/service/otm/OTMtoTD';

describe('service/otm/OTMtoTD.js', () => {
    let tdModel;
    let mockOTM = new Object();

    describe('convert OTM project', () => {
        beforeEach(() => {
            mockOTM.otmVersion = '0.2.0';
            mockOTM.project = new Object();
            mockOTM.project.name = 'Test project';
            mockOTM.project.id = 'test-project';
            mockOTM.project.description = 'This is a test project for the OTM development';
            mockOTM.project.owner = 'John Doe';
            mockOTM.project.ownerContact = 'john.doe@example.com';
            mockOTM.project.tags = [ 'test tag 1', 'test tag 2' ];
            mockOTM.project.attributes = { 'cmdbId': 'MyApp123' };
            tdModel = convertOTMtoTD(mockOTM);
            console.log(mockOTM);
        });

        it('converts otm version', () => {
            expect(tdModel.otmVersion).toEqual('0.2.0');
        });

        it('converts otm project name', () => {
            expect(tdModel.summary.title).toEqual('Test project');
        });

        it('converts otm project id', () => {
            expect(tdModel.summary.id).toEqual('test-project');
        });

        it('converts otm project description', () => {
            expect(tdModel.summary.description).toMatch(new RegExp('This is a test project for the OTM development'));
        });

        it('converts otm project owner', () => {
            expect(tdModel.summary.owner).toEqual('John Doe');
        });

        it('reserves otm project owner contact', () => {
            expect(tdModel.summary.ownerContact).toEqual('john.doe@example.com');
        });

        it('reserves otm project tags', () => {
            expect(tdModel.summary.tags).toEqual([ 'test tag 1', 'test tag 2' ]);
        });

        it('reserves otm project attributes', () => {
            expect(tdModel.summary.attributes).toEqual({ 'cmdbId': 'MyApp123' });
        });

    });

    describe('convert OTM representations', () => {
        beforeEach(() => {
            mockOTM.otmVersion = '0.2.0';
            mockOTM.representations = [
                {
                    'name': 'Architecture Diagram',
                    'id': 'architecture-diagram',
                    'type': 'diagram',
                    'size': {
                        'width': 1000,
                        'height': 1100
                    },
                    'attributes': null
                },
                {
                    'name': 'Application Code',
                    'id': 'application-code',
                    'type': 'code',
                    'description': 'the Application Code description',
                    'repository': {
                        'url': 'https://github.com/my-project'
                    },
                    'attributes': null
                },
                {
                    'name': 'Empty Diagram',
                    'id': '578b5170-74f1-401d-a72f-c06ccc966ca0',
                    'type': 'diagram',
                    'description': 'a description of the Empty Diagram',
                    'size': {
                        'width': 500,
                        'height': 300
                    },
                    'attributes': {
                        'diagramType': 'LINDDUN'
                    }
                }
            ];
            tdModel = convertOTMtoTD(mockOTM);
        });

        it('converts otm version', () => {
            expect(tdModel.otmVersion).toBe('0.2.0');
        });

        it('counts the diagrams', () => {
            expect(tdModel.detail.diagramTop).toBe(2);
        });

        it('provides the diagram id', () => {
            expect(tdModel.detail.diagrams[0].id).toBe(0);
            expect(tdModel.detail.diagrams[1].id).toBe(1);
        });

        it('reserves the representation id', () => {
            expect(tdModel.detail.diagrams[0].otmId).toBe('architecture-diagram');
            expect(tdModel.detail.diagrams[1].otmId).toBe('578b5170-74f1-401d-a72f-c06ccc966ca0');
        });

        it('converts the representation name', () => {
            expect(tdModel.detail.diagrams[0].title).toBe('Architecture Diagram');
            expect(tdModel.detail.diagrams[1].title).toBe('Empty Diagram');
        });

        it('converts the representation description', () => {
            expect(tdModel.detail.diagrams[0].description).toBeUndefined();
            expect(tdModel.detail.diagrams[1].description).toBe('a description of the Empty Diagram');
        });

        it('provides the diagram type', () => {
            expect(tdModel.detail.diagrams[0].diagramType).toBe('Generic');
            expect(tdModel.detail.diagrams[1].diagramType).toBe('LINDDUN');
        });

        it('preserves the representation size', () => {
            expect(tdModel.detail.diagrams[0].size).toEqual({ 'width': 1000, 'height': 1100 });
            expect(tdModel.detail.diagrams[1].size).toEqual({ 'width': 500, 'height': 300 });
        });

        it('preserves the representation attributes', () => {
            expect(tdModel.detail.diagrams[0].attributes).toBeNull();
            expect(tdModel.detail.diagrams[1].attributes).toEqual({ 'diagramType': 'LINDDUN' });
        });

        it('provides the CIA diagram type', () => {
            mockOTM.representations[0].attributes = { 'diagramType': 'CIA' };
            tdModel = convertOTMtoTD(mockOTM);
            expect(tdModel.detail.diagrams[0].diagramType).toBe('CIA');
        });

        it('provides the DIE diagram type', () => {
            mockOTM.representations[0].attributes = { 'diagramType': 'DIE' };
            tdModel = convertOTMtoTD(mockOTM);
            expect(tdModel.detail.diagrams[0].diagramType).toBe('DIE');
        });

        it('provides the PLOT4ai diagram type', () => {
            mockOTM.representations[0].attributes = { 'diagramType': 'PLOT4ai' };
            tdModel = convertOTMtoTD(mockOTM);
            expect(tdModel.detail.diagrams[0].diagramType).toBe('PLOT4ai');
        });

        it('provides the STRIDE diagram type', () => {
            mockOTM.representations[0].attributes = { 'diagramType': 'STRIDE' };
            tdModel = convertOTMtoTD(mockOTM);
            expect(tdModel.detail.diagrams[0].diagramType).toBe('STRIDE');
        });

        it('preserves a non-diagram representation', () => {
            expect(tdModel.detail.representations[0]).toEqual({
                'name': 'Application Code',
                'id': 'application-code',
                'type': 'code',
                'description': 'the Application Code description',
                'repository': { 'url': 'https://github.com/my-project' },
                'attributes': null
            });
        });

    });
});
