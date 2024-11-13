import { expect } from 'chai';
import sinon from 'sinon';
import { google } from 'googleapis';
import googledrive from '../../src/repositories/googledrive';

describe('Google Drive Service', () => {
    let sandbox;
    let mockDriveClient;
    let oauth2ClientStub;
    const accessToken = 'testAccessToken';

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        mockDriveClient = {
            files: {
                get: sandbox.stub(),
                list: sandbox.stub(),
                create: sandbox.stub(),
                update: sandbox.stub(),
                delete: sandbox.stub(),
            },
        };

        oauth2ClientStub = sandbox.stub(google.auth, 'OAuth2');
        oauth2ClientStub.returns({
            setCredentials: sinon.stub(),
        });
        
        sandbox.stub(google, 'drive').returns(mockDriveClient);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getFolderDetailsAsync', () => {
        it('should return folder details', async () => {
            const folderId = 'testFolderId';
            const expectedResponse = { id: 'testFolderId', name: 'Test Folder', mimeType: 'application/vnd.google-apps.folder' };

            mockDriveClient.files.get.resolves({ data: expectedResponse });

            const result = await googledrive.getFolderDetailsAsync(folderId, accessToken);

            expect(result).to.deep.equal(expectedResponse);
            expect(mockDriveClient.files.get).to.have.been.calledWith({
                fileId: folderId,
                fields: 'id, name, mimeType',
            });
        });
    });

    describe('listFilesInFolderAsync', () => {
        it('should return a list of files in a folder', async () => {
            const folderId = 'testFolderId';
            const expectedResponse = {
                files: [{ id: 'fileId', name: 'Test File', mimeType: 'application/json' }],
                nextPageToken: 'nextToken',
            };

            mockDriveClient.files.list.resolves({ data: expectedResponse });

            const result = await googledrive.listFilesInFolderAsync(folderId, null, accessToken);

            expect(result).to.deep.equal({
                folders: expectedResponse.files,
                nextPageToken: expectedResponse.nextPageToken,
            });
            expect(mockDriveClient.files.list).to.have.been.calledWith({
                q: `'${folderId}' in parents and (mimeType='application/vnd.google-apps.folder' or mimeType='application/json')`,
                fields: 'nextPageToken, files(id, name, parents, mimeType)',
                pageSize: 10,
            });
        });
    });

    describe('getFolderParentIdAsync', () => {
        it('should return the parent folder id', async () => {
            const folderId = 'testFolderId';
            const expectedResponse = { id: folderId, parents: ['parentId'] };

            mockDriveClient.files.get.resolves({ data: expectedResponse });

            const result = await googledrive.getFolderParentIdAsync(folderId, accessToken);

            expect(result).to.equal('parentId');
            expect(mockDriveClient.files.get).to.have.been.calledWith({
                fileId: folderId,
                fields: 'id, name, parents',
            });
        });
    });

    describe('getFileContentAsync', () => {
        it('should return file content', async () => {
            const fileId = 'testFileId';
            const expectedResponse = { content: 'test content' };

            mockDriveClient.files.get.resolves({ data: expectedResponse });

            const result = await googledrive.getFileContentAsync(fileId, accessToken);

            expect(result).to.deep.equal(expectedResponse);
            expect(mockDriveClient.files.get).to.have.been.calledWith({
                fileId: fileId,
                alt: 'media',
            });
        });
    });

    describe('createFileInFolderAsync', () => {
        it('should create a file in a folder', async () => {
            const folderId = 'testFolderId';
            const fileName = 'testFile.json';
            const fileContent = { key: 'value' };
            const expectedResponse = { id: 'fileId' };

            mockDriveClient.files.create.resolves({ data: expectedResponse });

            const result = await googledrive.createFileInFolderAsync(folderId, fileName, fileContent, accessToken);

            expect(result).to.deep.equal(expectedResponse);
            expect(mockDriveClient.files.create).to.have.been.calledWith({
                resource: {
                    name: fileName,
                    parents: [folderId],
                },
                media: {
                    mimeType: 'application/json',
                    body: JSON.stringify(fileContent, null, '  '),
                },
                fields: 'id',
            });
        });
    });

    describe('updateFileAsync', () => {
        it('should update the file', async () => {
            const fileId = 'testFileId';
            const fileContent = { key: 'updatedValue' };
            const expectedResponse = { id: 'fileId' };

            mockDriveClient.files.update.resolves({ data: expectedResponse });

            const result = await googledrive.updateFileAsync(fileId, fileContent, accessToken);

            expect(result).to.deep.equal(expectedResponse);
            expect(mockDriveClient.files.update).to.have.been.calledWith({
                fileId: fileId,
                media: {
                    mimeType: 'application/json',
                    body: JSON.stringify(fileContent, null, '  '),
                },
                fields: 'id',
            });
        });
    });

    describe('deleteFileAsync', () => {
        it('should delete the file', async () => {
            const fileId = 'testFileId';

            mockDriveClient.files.delete.resolves();

            const result = await googledrive.deleteFileAsync(fileId, accessToken);

            expect(result).to.deep.equal({ success: true });
            expect(mockDriveClient.files.delete).to.have.been.calledWith({ fileId });
        });
    });
});
