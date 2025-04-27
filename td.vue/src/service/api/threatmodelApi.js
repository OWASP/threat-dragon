import api from './api.js';

const resource = '/api/threatmodel';

const extractRepoParts = (fullRepoName) => {
    // Import logger dynamically to avoid circular dependencies
    const logger = (function() {
        try {
            // Try to import synchronously first
            return require('@/utils/logger.js').default.getLogger('api:threatmodelApi:extractRepoParts');
        } catch (e) {
            // Fallback to console if logger can't be imported
            return {
                debug: console.debug,
                error: console.error
            };
        }
    })();
    
    logger.debug('Extracting repo parts', { fullRepoName });
    
    if (!fullRepoName) {
        const error = new Error('Cannot extract parts from empty repository name');
        logger.error('Empty repository name', { error: error.message });
        throw error;
    }
    
    if (typeof fullRepoName !== 'string') {
        const error = new Error(`Repository name must be a string, got ${typeof fullRepoName}`);
        logger.error('Invalid repository name type', {
            error: error.message,
            type: typeof fullRepoName,
            value: String(fullRepoName)
        });
        throw error;
    }
    
    // Handle root directory case (empty string or '/')
    if (fullRepoName === '' || fullRepoName === '/') {
        logger.debug('Root directory detected, using default organization');
        return { org: 'bitbucket', repo: '' };
    }
    
    // Remove any leading or trailing slashes
    const cleanRepoName = fullRepoName.replace(/^\/+|\/+$/g, '');
    
    // If after cleaning we have an empty string, treat as root directory
    if (cleanRepoName === '') {
        logger.debug('Empty repository name after cleaning, using default organization');
        return { org: 'bitbucket', repo: '' };
    }
    
    const parts = cleanRepoName.split('/');
    
    // For Bitbucket repositories, the repository name might not include the organization
    // In this case, we'll use the Bitbucket workspace as the organization
    if (parts.length < 2) {
        // Try to get the Bitbucket workspace from localStorage
        let workspace = 'bitbucket';
        try {
            const storedWorkspace = localStorage.getItem('td_bitbucket_workspace');
            if (storedWorkspace) {
                workspace = storedWorkspace;
                logger.debug('Using workspace from localStorage', { workspace });
            }
        } catch (e) {
            logger.error('Error accessing localStorage', { error: e.message });
        }
        
        return { org: workspace, repo: cleanRepoName };
    }
    
    const org = parts[0];
    const repo = cleanRepoName.replace(`${org}/`, '');
    
    logger.debug('Repository parts extracted', { org, repo });
    
    return { org, repo };
};

const encodeUrlComponents = (...uriComponents) => {
    return uriComponents.map((uriComponent) => encodeURIComponent(uriComponent));
};

/**
 * Gets the organisation data configured for the express server
 * @returns {Promise}
 */
const organisationAsync = () => api.getAsync(`${resource}/organisation`);

/**
 * Gets the repos for the given user
 * @returns {Promise}
 */
const reposAsync = (page = 1, searchQuery = '') => {
    return api.getAsync(`${resource}/repos`, {
        params: { page: page, searchQuery: searchQuery }
    });
};

/**
 * Gets the branches for the given repository
 * @param {String} fullRepoName
 * @param {Number} page
 * @returns {Promise}
 */
const branchesAsync = async (fullRepoName, page = 1) => {
    // Import logger dynamically to avoid circular dependencies
    const logger = await import('@/utils/logger.js');
    const log = logger.default.getLogger('api:threatmodelApi:branchesAsync');
    
    log.debug('branchesAsync called', { fullRepoName, page });
    
    if (!fullRepoName) {
        const error = new Error('Repository name is required but was not provided');
        log.error('Missing repository name', { error: error.message });
        throw error;
    }
    
    try {
        const { org, repo } = extractRepoParts(fullRepoName);
        log.debug('Repository parts extracted', { org, repo });
        
        const [encodedOrg, encodedRepo] = encodeUrlComponents(org, repo);
        const url = `${resource}/${encodedOrg}/${encodedRepo}/branches`;
        
        log.debug('Making API request', {
            url,
            params: { page }
        });
        
        const response = await api.getAsync(url, {
            params: { page: page }
        });
        
        log.debug('API response received', {
            status: 'success',
            branchCount: response?.data?.branches?.length || 0
        });
        
        return response;
    } catch (error) {
        log.error('Error in branchesAsync', {
            error: error.message,
            stack: error.stack,
            fullRepoName
        });
        throw error;
    }
};

/**
 * Gets them models available on a given branch in a given repo
 * @param {String} fullRepoName
 * @param {String} branch
 * @returns {Promise}
 */
const modelsAsync = (fullRepoName, branch) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    const [encodedOrg, encodedRepo, encodedBranch] = encodeUrlComponents(org, repo, branch);
    return api.getAsync(`${resource}/${encodedOrg}/${encodedRepo}/${encodedBranch}/models`);
};

/**
 * Gets the given model data
 * @param {String} fullRepoName
 * @param {String} branch
 * @param {String} model
 * @returns {Promise}
 */
const modelAsync = (fullRepoName, branch, model) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    const [encodedOrg, encodedRepo, encodedBranch, encodedModel] = encodeUrlComponents(
        org,
        repo,
        branch,
        model
    );
    return api.getAsync(
        `${resource}/${encodedOrg}/${encodedRepo}/${encodedBranch}/${encodedModel}/data`
    );
};

/**
 * create Model
 * @param fullRepoName
 * @param branch
 * @param modelName
 * @param threatModel
 * @returns {Promise<*>}
 */
const createAsync = (fullRepoName, branch, modelName, threatModel) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    const [encodedOrg, encodedRepo, encodedBranch, encodedModelName] = encodeUrlComponents(
        org,
        repo,
        branch,
        modelName
    );
    return api.postAsync(
        `${resource}/${encodedOrg}/${encodedRepo}/${encodedBranch}/${encodedModelName}/create`,
        threatModel
    );
};

/**
 * Updates the given model
 * @param fullRepoName
 * @param branch
 * @param modelName
 * @param threatModel
 * @returns {Promise<*>}
 */
const updateAsync = (fullRepoName, branch, modelName, threatModel) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    const [encodedOrg, encodedRepo, encodedBranch, encodedModelName] = encodeUrlComponents(
        org,
        repo,
        branch,
        modelName
    );
    return api.putAsync(
        `${resource}/${encodedOrg}/${encodedRepo}/${encodedBranch}/${encodedModelName}/update`,
        threatModel
    );
};

/**
 * Creates a new branch on the given repository
 * @param fullRepoName
 * @param branchName
 * @param refBranch - the branch to base the new branch on
 * @returns {Promise<*>}
 */
const createBranchAsync = (fullRepoName, branchName, refBranch) => {
    const { org, repo } = extractRepoParts(fullRepoName);
    const [encodedOrg, encodedRepo, encodedBranchName, encodedRefBranch] = encodeUrlComponents(
        org,
        repo,
        branchName,
        refBranch
    );
    return api.postAsync(
        `${resource}/${encodedOrg}/${encodedRepo}/${encodedBranchName}/createBranch`,
        { refBranch: encodedRefBranch }
    );
};

export default {
    branchesAsync,
    createAsync,
    modelAsync,
    modelsAsync,
    organisationAsync,
    reposAsync,
    updateAsync,
    createBranchAsync
};
