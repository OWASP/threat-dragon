import convert from '@/service/otm/OTMtoTD';

describe('service/otm/OTMtoTD.js', () => {
    var mockOTM = new Object();
    mockOTM.otmVersion = '0.2.0';
    mockOTM.project = new Object();
    mockOTM.project.id = 1;
    mockOTM.project.name = 'title';
    mockOTM.trustZones = [];
    mockOTM.components = [];
    mockOTM.dataflows = [];
    //mockOTM.project.attributes = new Object();
    //mockOTM.project.attributes.cmdbId = 'test cmdbId';

    let tdModel;
    describe('convertOTMtoTD', () => {
        beforeEach(() => {
            tdModel = convert.convertOTMtoTD(mockOTM);
        });

        it('converts otm format to td', () => {
            expect(tdModel.summary.title).toEqual('title');
        });
    });
});
