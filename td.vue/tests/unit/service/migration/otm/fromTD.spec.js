import { convert as convertTDtoOTM }  from '@/service/migration/otm/fromTD.js';

describe('service/migration/otm/fromTD.js', () => {
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
            otmModel = convertTDtoOTM(dragonModel);
        });

        it('sets the otm version', () => {
            expect(otmModel.otmVersion).toEqual('0.2.0');
        });
    });
});
