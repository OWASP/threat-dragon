import nock from 'nock';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, '../fixtures');

// Create fixtures directory if it doesn't exist
if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
}

// Load fixtures if they exist
const loadFixture = (filename) => {
    const filePath = path.join(fixturesDir, filename);
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return null;
};

// GitHub fixtures
const githubUserFixture = loadFixture('github-user.json') || {
    login: 'testuser',
    id: 12345,
    name: 'Test User',
    email: 'test@example.com'
};

const githubReposFixture = loadFixture('github-repos.json') || [
    { name: 'repo1', full_name: 'testuser/repo1' },
    { name: 'repo2', full_name: 'testuser/repo2' }
];

const githubBranchesFixture = loadFixture('github-branches.json') || [
    { name: 'main', commit: { sha: 'abc123' } },
    { name: 'develop', commit: { sha: 'def456' } }
];

const githubModelsFixture = loadFixture('github-models.json') || [
    { name: 'model1', type: 'dir', path: 'ThreatDragonModels/model1' },
    { name: 'model2', type: 'dir', path: 'ThreatDragonModels/model2' }
];

const githubModelContentFixture = loadFixture('github-model-content.json') || {
    name: 'model1.json',
    path: 'ThreatDragonModels/model1.json',
    sha: 'ghi789',
    content: Buffer.from(JSON.stringify({ title: 'Test Model' })).toString('base64')
};

/**
 * Mock GitHub API requests
 * @param {Object} options - Configuration options
 * @param {boolean} options.persist - Whether to persist the mock for multiple requests
 * @returns {nock.Scope} The nock scope
 */
export function mockGitHubApi(options = {}) {
    const { persist = true } = options;

    // Use our loaded fixtures

    // Set up the GitHub API mock
    const scope = nock('https://api.github.com')
        // User endpoint
        .get('/user')
        .reply(200, githubUserFixture)

        // Repos endpoint
        .get('/user/repos')
        .query(true) // Match any query parameters
        .reply(200, githubReposFixture)

        // Search repos endpoint
        .get(/\/search\/repositories.*/)
        .reply(200, { items: githubReposFixture })

        // Branches endpoint
        .get(/\/repos\/.*\/.*\/branches.*/)
        .reply(200, githubBranchesFixture)

        // Contents endpoint for ThreatDragonModels directory
        .get(/\/repos\/.*\/.*\/contents\/ThreatDragonModels.*/)
        .reply(200, githubModelsFixture)

        // Contents endpoint for specific model - support both old and new path formats
        .get(/\/repos\/.*\/.*\/contents\/ThreatDragonModels\/.*\.json.*/)
        .reply(200, githubModelContentFixture)

        // Create file endpoint - support both old and new path formats
        .put(/\/repos\/.*\/.*\/contents\/ThreatDragonModels\/.*\.json/)
        .reply(201, { content: githubModelContentFixture })

        // Update file endpoint - support both old and new path formats
        .put(/\/repos\/.*\/.*\/contents\/ThreatDragonModels\/.*\.json/)
        .reply(200, { content: { ...githubModelContentFixture, sha: 'newsha123' } })

        // Delete file endpoint - support both old and new path formats
        .delete(/\/repos\/.*\/.*\/contents\/ThreatDragonModels\/.*\.json/)
        .reply(200, {});

    if (persist) {
        scope.persist();
    }

    return scope;
}

/**
 * Mock GitLab API requests
 * @param {Object} options - Configuration options
 * @param {boolean} options.persist - Whether to persist the mock for multiple requests
 * @returns {nock.Scope} The nock scope
 */
export function mockGitLabApi(options = {}) {
    const { persist = true } = options;

    // GitLab user response
    const userFixture = {
        id: 12345,
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com'
    };

    // GitLab projects response
    const projectsFixture = {
        data: [
            { id: 1, path_with_namespace: 'testuser/repo1' },
            { id: 2, path_with_namespace: 'testuser/repo2' }
        ],
        paginationInfo: { next: null, previous: null }
    };

    // GitLab branches response
    const branchesFixture = {
        data: [
            { name: 'main', commit: { id: 'abc123' } },
            { name: 'develop', commit: { id: 'def456' } }
        ],
        paginationInfo: { next: null, previous: null }
    };

    // GitLab repository trees response
    const treesFixture = {
        data: [
            { name: 'model1', type: 'tree', path: 'ThreatDragonModels/model1' },
            { name: 'model2', type: 'tree', path: 'ThreatDragonModels/model2' }
        ],
        paginationInfo: { next: null, previous: null }
    };

    // GitLab file content response
    const fileContentFixture = {
        file_name: 'model.json',
        file_path: 'ThreatDragonModels/model1/model1.json',
        content: Buffer.from(JSON.stringify({ title: 'Test Model' })).toString('base64'),
        encoding: 'base64'
    };

    // Using a base URL for GitLab API that matches what the tests expect
    const scope = nock('https://gitlab.com')
        // Use a wildcard for all GitLab API endpoints
        .persist()
        .get(/.*/)
        .reply(function (uri) {
            // Match different endpoints
            if (uri.includes('/api/v4/user')) {
                return [200, userFixture];
            } else if (uri.includes('/api/v4/projects')) {
                return [200, projectsFixture];
            } else if (uri.includes('/api/v4/projects/') && uri.includes('/repository/branches')) {
                return [200, branchesFixture];
            } else if (uri.includes('/api/v4/projects/') && uri.includes('/repository/tree')) {
                return [200, treesFixture];
            } else if (uri.includes('/api/v4/projects/') && uri.includes('/repository/files/')) {
                return [200, fileContentFixture];
            }

            // Default response for unmatched paths
            return [404, { message: 'Not found' }];
        })
        .post(/.*/)
        .reply(201, { message: 'success' })
        .put(/.*/)
        .reply(200, { message: 'success' })
        .delete(/.*/)
        .reply(204);

    if (persist) {
        scope.persist();
    }

    return scope;
}

/**
 * Mock Google Drive API requests
 * @param {Object} options - Configuration options
 * @param {boolean} options.persist - Whether to persist the mock for multiple requests
 * @returns {nock.Scope} The nock scope
 */
export function mockGoogleDriveApi(options = {}) {
    const { persist = true } = options;

    // Google Drive folders response
    const foldersFixture = {
        files: [
            { id: 'folder1', name: 'Folder 1', mimeType: 'application/vnd.google-apps.folder' },
            { id: 'folder2', name: 'Folder 2', mimeType: 'application/vnd.google-apps.folder' }
        ],
        nextPageToken: null
    };

    // Google Drive files response
    const filesFixture = {
        files: [
            { id: 'file1', name: 'model1.json', mimeType: 'application/json' },
            { id: 'file2', name: 'model2.json', mimeType: 'application/json' }
        ],
        nextPageToken: null
    };

    // Google Drive file content
    const _fileContentFixture = { title: 'Test Model', diagrams: [] };

    // Google Drive folder details
    const folderDetailsFixture = {
        id: 'folder1',
        name: 'Folder 1',
        mimeType: 'application/vnd.google-apps.folder',
        parents: ['parentFolder']
    };

    // Google API is typically mocked directly via googleapi rather than with nock
    // This is a placeholder for completeness but most tests will mock googleapis directly
    const scope = nock('https://www.googleapis.com')
        .get(/drive\/v3\/files\/.*/)
        .reply(200, folderDetailsFixture)
        .get(/drive\/v3\/files\?.*/)
        .reply(function (uri) {
            if (uri.includes('mimeType=')) {
                return [200, filesFixture];
            }
            return [200, foldersFixture];
        })
        .post(/drive\/v3\/files.*/)
        .reply(201, { id: 'newFile123' })
        .patch(/drive\/v3\/files\/.*/)
        .reply(200, { id: 'updatedFile123' })
        .delete(/drive\/v3\/files\/.*/)
        .reply(204);

    if (persist) {
        scope.persist();
    }

    return scope;
}

/**
 * Mock Bitbucket API requests
 * @param {Object} options - Configuration options
 * @param {boolean} options.persist - Whether to persist the mock for multiple requests
 * @returns {nock.Scope} The nock scope
 */
export function mockBitbucketApi(options = {}) {
    const { persist = true } = options;

    // Bitbucket user response
    const userFixture = {
        username: 'testuser',
        display_name: 'Test User',
        uuid: '{12345678-1234-1234-1234-123456789012}'
    };

    // Bitbucket repositories response
    const reposFixture = {
        values: [
            { name: 'repo1', full_name: 'testuser/repo1' },
            { name: 'repo2', full_name: 'testuser/repo2' }
        ],
        page: 1,
        size: 2,
        next: null
    };

    // Bitbucket branches response
    const branchesFixture = {
        values: [
            { name: 'main', target: { hash: 'abc123' } },
            { name: 'develop', target: { hash: 'def456' } }
        ],
        page: 1,
        size: 2,
        next: null
    };

    // Bitbucket directory contents response
    const contentsFixture = {
        values: [
            { path: 'ThreatDragonModels/model1', type: 'directory' },
            { path: 'ThreatDragonModels/model2', type: 'directory' }
        ],
        page: 1,
        size: 2,
        next: null
    };

    // Bitbucket file content response
    const fileContentFixture = {
        data: JSON.stringify({ title: 'Test Model' }),
        size: 123,
        path: 'ThreatDragonModels/model1/model1.json'
    };

    const scope = nock('https://api.bitbucket.org')
        // User endpoint
        .get('/2.0/user')
        .reply(200, userFixture)

        // Repositories endpoint
        .get(/\/2.0\/repositories\/.*/)
        .reply(200, reposFixture)

        // Branches endpoint
        .get(/\/2.0\/repositories\/.*\/.*\/refs\/branches.*/)
        .reply(200, branchesFixture)

        // Directory contents endpoint
        .get(/\/2.0\/repositories\/.*\/.*\/src\/.*\/ThreatDragonModels.*/)
        .reply(200, contentsFixture)

        // File content endpoint
        .get(/\/2.0\/repositories\/.*\/.*\/src\/.*\/ThreatDragonModels\/.*\/.*\.json/)
        .reply(200, fileContentFixture)

        // Create file endpoint
        .post(/\/2.0\/repositories\/.*\/.*\/src/)
        .reply(201, {})

        // Delete file endpoint
        .delete(/\/2.0\/repositories\/.*\/.*\/src/)
        .reply(204);

    if (persist) {
        scope.persist();
    }

    return scope;
}

/**
 * Controls whether real external APIs should be used or not
 * @returns {boolean} - True if real APIs should be used
 */
export function useRealApis() {
    return process.env.USE_REAL_APIS === 'true';
}

/**
 * Set up all API mocks
 * @returns {Object} - Object containing all API mock scopes
 */
export function setupAllApiMocks() {
    // Only set up mocks if we're not using real APIs
    if (useRealApis()) {
        console.log('Using real external APIs for testing');
        return null;
    }

    return {
        github: mockGitHubApi(),
        gitlab: mockGitLabApi(),
        bitbucket: mockBitbucketApi(),
        google: mockGoogleDriveApi()
    };
}

/**
 * Clean up all API mocks
 */
export function cleanupAllApiMocks() {
    nock.cleanAll();
}
