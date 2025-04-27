import { expect } from 'chai';
import sinon from 'sinon';
import { google } from 'googleapis';
import googledrive from '../../src/repositories/googledrive.js';
import { useRealApis } from '../helpers/api-mocks.js';

describe('Google Drive Service', () => {
    let sandbox;
    let mockDriveClient;
    let oauth2ClientStub;
    const accessToken = 'testAccessToken';
    const testFolderId = 'testFolderId';
    const testFileId = 'testFileId';

    beforeEach(() => {
        // Only mock if we're not using real APIs
        if (!useRealApis()) {
            sandbox = sinon.createSandbox();
            mockDriveClient = {
                files: {
                    get: sandbox.stub(),
                    list: sandbox.stub(),
                    create: sandbox.stub(),
                    update: sandbox.stub(),
                    delete: sandbox.stub()
                }
            };

            oauth2ClientStub = sandbox.stub(google.auth, 'OAuth2');
            oauth2ClientStub.returns({
                setCredentials: sinon.stub()
            });

            sandbox.stub(google, 'drive').returns(mockDriveClient);
        }
    });

    afterEach(() => {
        if (sandbox) {
            sandbox.restore();
        }
    });

    // Helper function to skip tests when using real APIs
    const skipIfRealApis = (_test) => {
        if (useRealApis()) {
            console.log('Skipping test while using real APIs');
            return true;
        }
        return false;
    };

    describe('getFolderDetailsAsync', () => {
        it('should return folder details', async () => {
            if (skipIfRealApis()) return;

            const expectedResponse = {
                id: testFolderId,
                name: 'Test Folder',
                mimeType: 'application/vnd.google-apps.folder'
            };

            mockDriveClient.files.get.resolves({ data: expectedResponse });

            const result = await googledrive.getFolderDetailsAsync(testFolderId, accessToken);

            expect(result).to.deep.equal(expectedResponse);
            expect(mockDriveClient.files.get).to.have.been.calledWith({
                fileId: testFolderId,
                fields: 'id, name, mimeType'
            });
        });
    });

    describe('listFilesInFolderAsync', () => {
        it('should return a list of files in a folder', async () => {
            if (skipIfRealApis()) return;

            const expectedResponse = {
                files: [{ id: 'fileId', name: 'Test File', mimeType: 'application/json' }],
                nextPageToken: 'nextToken'
            };

            mockDriveClient.files.list.resolves({ data: expectedResponse });

            const result = await googledrive.listFilesInFolderAsync(
                testFolderId,
                null,
                accessToken
            );

            expect(result).to.deep.equal({
                folders: expectedResponse.files,
                nextPageToken: expectedResponse.nextPageToken
            });
            expect(mockDriveClient.files.list).to.have.been.calledWith({
                q: `'${testFolderId}' in parents and (mimeType='application/vnd.google-apps.folder' or mimeType='application/json')`,
                fields: 'nextPageToken, files(id, name, parents, mimeType)',
                pageSize: 10
            });
        });
    });

    describe('getFolderParentIdAsync', () => {
        it('should return the parent folder id', async () => {
            if (skipIfRealApis()) return;

            const expectedResponse = { id: testFolderId, parents: ['parentId'] };

            mockDriveClient.files.get.resolves({ data: expectedResponse });

            const result = await googledrive.getFolderParentIdAsync(testFolderId, accessToken);

            expect(result).to.equal('parentId');
            expect(mockDriveClient.files.get).to.have.been.calledWith({
                fileId: testFolderId,
                fields: 'id, name, parents'
            });
        });
    });

    describe('getFileContentAsync', () => {
        it('should return file content', async () => {
            if (skipIfRealApis()) return;

            const expectedResponse = { content: 'test content' };

            mockDriveClient.files.get.resolves({ data: expectedResponse });

            const result = await googledrive.getFileContentAsync(testFileId, accessToken);

            expect(result).to.deep.equal(expectedResponse);
            expect(mockDriveClient.files.get).to.have.been.calledWith({
                fileId: testFileId,
                alt: 'media'
            });
        });
    });

    describe('createFileInFolderAsync', () => {
        it('should create a file in a folder', async () => {
            if (skipIfRealApis()) return;

            const fileName = 'testFile.json';
            const fileContent = { key: 'value' };
            const expectedResponse = { id: 'fileId' };

            mockDriveClient.files.create.resolves({ data: expectedResponse });

            const result = await googledrive.createFileInFolderAsync(
                testFolderId,
                fileName,
                fileContent,
                accessToken
            );

            expect(result).to.deep.equal(expectedResponse);
            expect(mockDriveClient.files.create).to.have.been.calledWith({
                resource: {
                    name: fileName,
                    parents: [testFolderId]
                },
                media: {
                    mimeType: 'application/json',
                    body: JSON.stringify(fileContent, null, '  ')
                },
                fields: 'id'
            });
        });
    });

    describe('updateFileAsync', () => {
        it('should update the file', async () => {
            if (skipIfRealApis()) return;

            const fileContent = { key: 'updatedValue' };
            const expectedResponse = { id: 'fileId' };

            mockDriveClient.files.update.resolves({ data: expectedResponse });

            const result = await googledrive.updateFileAsync(testFileId, fileContent, accessToken);

            expect(result).to.deep.equal(expectedResponse);
            expect(mockDriveClient.files.update).to.have.been.calledWith({
                fileId: testFileId,
                media: {
                    mimeType: 'application/json',
                    body: JSON.stringify(fileContent, null, '  ')
                },
                fields: 'id'
            });
        });
    });

    describe('deleteFileAsync', () => {
        it('should delete the file', async () => {
            if (skipIfRealApis()) return;

            mockDriveClient.files.delete.resolves();

            const result = await googledrive.deleteFileAsync(testFileId, accessToken);

            expect(result).to.deep.equal({ success: true });
            expect(mockDriveClient.files.delete).to.have.been.calledWith({ fileId: testFileId });
        });
    });
});
