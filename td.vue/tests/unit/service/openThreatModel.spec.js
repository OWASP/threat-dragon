import openThreatModel from '@/service/openThreatModel.js';

describe('service/openThreatModel.js', () => {
    var dragonModel = new Object();
    dragonModel.version = '2.0';
    dragonModel.summary = new Object();
    dragonModel.summary.title = 'name';
    dragonModel.summary.owner = '';
    dragonModel.summary.description = '';
    dragonModel.summary.id = 1;
    dragonModel.detail = new Object();
    dragonModel.detail.contributors = [];
    dragonModel.detail.diagrams = [];
    dragonModel.detail.diagramTop = 0;
    dragonModel.detail.reviewer = '';
    dragonModel.detail.threatTop = 0;
    var diagram = new Object();
    diagram.version = '2.0';
    diagram.title = 'Main Request Data Flow';
    diagram.id = 0;
    diagram.diagramType = 'STRIDE';
    diagram.cells = [];
    dragonModel.detail.diagrams.push(diagram);
    
    let otmModel;
    describe('convertTDtoOTM', () => {
        beforeEach(() => {
            otmModel = openThreatModel.convertTDtoOTM(dragonModel);
        });

        it('converts td format to otm', () => {
            expect(otmModel.otmVersion).toEqual('0.2.0');
        });
    });

    var mockOTM = new Object();
    mockOTM.otmVersion = '0.2.0';
    mockOTM.project = new Object();
    mockOTM.project.id = 1;
    mockOTM.project.name = 'title';
    mockOTM.trustZones = [];
    mockOTM.components = [];
    mockOTM.dataflows = [];

    let tdModel;
    describe('convertOTMtoTD', () => {
        beforeEach(() => {
            tdModel = openThreatModel.convertOTMtoTD(mockOTM);
        });

        it('converts otm format to td', () => {
            expect(tdModel.summary.title).toEqual('title');
        });
    });
});
