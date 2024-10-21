import api from '@/service/api/api.js';
import googleDriveApi from '@/service/api/googleDriveApi.js';

describe('service/googleDriveApi.js', () => {
    beforeEach(() => {
        jest.spyOn(api, 'getAsync').mockImplementation(() => {});
        jest.spyOn(api, 'postAsync').mockImplementation(() => {});
        jest.spyOn(api, 'putAsync').mockImplementation(() => {});
    });

    describe('folderAsync', () => {
        const folderId = 'root';

        beforeEach(async () => {
            await googleDriveApi.folderAsync(folderId);
        });

        it('calls the folder endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith(
                '/api/googleproviderthreatmodel/folders', 
                { params: { page: 1, folderId: 'root' } }
            );
        });
    });

    describe('createAsync', () => {
        const folder = 'folderId123';
        const fileContent = 'File content here';
        const fileName = 'file.txt';

        beforeEach(async () => {
            await googleDriveApi.createAsync(folder, fileContent, fileName);
        });

        it('calls the create endpoint', () => {
            expect(api.postAsync).toHaveBeenCalledWith(
                `/api/googleproviderthreatmodel/${folder}/create`, 
                { fileContent, fileName }
            );
        });
    });

    describe('updateAsync', () => {
        const fileId = 'fileId123';
        const fileContent = 'Updated file content';

        beforeEach(async () => {
            await googleDriveApi.updateAsync(fileId, fileContent);
        });

        it('calls the update endpoint', () => {
            expect(api.putAsync).toHaveBeenCalledWith(
                `/api/googleproviderthreatmodel/${fileId}/update`, 
                { fileContent }
            );
        });
    });

    describe('modelAsync', () => {
        const fileId = 'fileId123';

        beforeEach(async () => {
            await googleDriveApi.modelAsync(fileId);
        });

        it('calls the model data endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith(
                `/api/googleproviderthreatmodel/${fileId}/data`
            );
        });
    });
});
