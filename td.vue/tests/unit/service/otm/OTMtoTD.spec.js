import { convert as convertOTMtoTD } from '@/service/otm/OTMtoTD';

describe('service/otm/OTMtoTD.js', () => {
    let tdModel;

    describe('convertOTMtoTD', () => {
        beforeEach(() => {
            var mockOTM = new Object();
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
            expect(tdModel.summary.description).toEqual('Note that Open Threat Model is not supported, yet.\n' + 'This is a test project for the OTM development');
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
});
