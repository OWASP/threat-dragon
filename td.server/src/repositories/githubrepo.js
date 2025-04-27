import env from '../env/Env.js';
import fetch from 'node-fetch';
import loggerHelper from '../helpers/logger.helper.js';

const logger = loggerHelper.get('repositories/githubrepo.js');

const repoRootDirectory = () =>
    env.get().config.GITHUB_REPO_ROOT_DIRECTORY || env.get().config.REPO_ROOT_DIRECTORY;

const getBaseUrl = () => {
    const enterpriseHostname = env.get().config.GITHUB_ENTERPRISE_HOSTNAME;
    if (enterpriseHostname) {
        const port = env.get().config.GITHUB_ENTERPRISE_PORT;
        const protocol = env.get().config.GITHUB_ENTERPRISE_PROTOCOL || 'https';
        return `${protocol}://${enterpriseHostname}${port ? `:${port}` : ''}/api/v3`;
    }
    return 'https://api.github.com';
};

const fetchGitHub = async (path, accessToken, options = {}) => {
    if (!accessToken) {
        throw new Error('GitHub API error: No access token provided');
    }

    const baseUrl = getBaseUrl();
    const url = `${baseUrl}${path}`;

    try {
        logger.debug(`GitHub API request to: ${url}`);
        const response = await fetch(url, {
            ...options,
            headers: {
                Authorization: `token ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
                ...options.headers
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            logger.error(`GitHub API error (${response.status}): ${response.statusText}`);
            logger.error(`Error response body: ${errorText}`);

            // Add audit logging for API errors
            logger.audit(`Data access error: GitHub API error (${response.status}) for ${url}`);

            throw new Error(
                `GitHub API error (${response.status}): ${response.statusText} - ${errorText}`
            );
        }

        return response.json();
    } catch (error) {
        logger.error(`Error fetching from GitHub API: ${error.message}`);
        if (error.stack) {
            logger.error(`Error stack: ${error.stack}`);
        }
        throw error;
    }
};

const reposAsync = async (page, accessToken, searchQueries = []) => {
    await Promise.resolve(); // Ensure async function has await expression

    // Log the parameters for debugging
    logger.debug(`GitHub reposAsync called with page: ${page}`);
    logger.debug(`GitHub reposAsync called with searchQueries:`, searchQueries);

    // Construct the URL with pagination
    const url = `/user/repos?page=${page}&per_page=100`;

    logger.debug(`GitHub reposAsync using URL: ${url}`);

    try {
        const response = await fetchGitHub(url, accessToken, {
            method: 'GET',
            headers: {
                Accept: 'application/vnd.github.v3+json'
            }
        });

        // Add audit logging for successful data access
        logger.audit(`Data access: User repositories retrieved from GitHub, page ${page}`);

        // Return the response in the expected format [repos, headers, pageLinks]
        return [response, {}, {}];
    } catch (error) {
        logger.error(`Error in reposAsync: ${error.message}`);
        throw error;
    }
};

const searchAsync = async (page, accessToken, searchQueries = []) => {
    await Promise.resolve(); // Ensure async function has await expression

    // Log the parameters for debugging
    logger.debug(`GitHub searchAsync called with page: ${page}`);
    logger.debug(`GitHub searchAsync called with searchQueries:`, searchQueries);

    // Filter out empty search queries
    const validQueries = searchQueries.filter((q) => q && typeof q === 'string' && q.trim() !== '');

    // Use the first valid query or default to a broad search
    let searchQuery = 'stars:>0';
    if (validQueries.length > 0) {
        searchQuery = validQueries[0];
    }

    logger.debug(`GitHub searchAsync using query: ${searchQuery}`);

    try {
        const url = `/search/repositories?q=${encodeURIComponent(
            searchQuery
        )}&page=${page}&per_page=100`;
        logger.debug(`GitHub searchAsync using URL: ${url}`);

        const data = await fetchGitHub(url, accessToken);

        // Add audit logging for successful search
        logger.audit(
            `Data access: GitHub repository search performed with query "${searchQuery}", page ${page}`
        );

        // Return the response in the expected format [repos, headers, pageLinks]
        return [
            data,
            {},
            {
                next: data.total_count > page * 100,
                prev: page > 1
            }
        ];
    } catch (error) {
        logger.error(`Error in searchAsync: ${error.message}`);
        throw error;
    }
};

const userAsync = async (accessToken) => {
    await Promise.resolve(); // Ensure async function has await expression
    return fetchGitHub('/user', accessToken);
};

const branchesAsync = async (repoInfo, accessToken) => {
    await Promise.resolve(); // Ensure async function has await expression

    logger.debug(
        `GitHub branchesAsync called with repo: ${repoInfo.organisation}/${repoInfo.repo}, page: ${repoInfo.page}`
    );

    try {
        const response = await fetchGitHub(
            `/repos/${repoInfo.organisation}/${repoInfo.repo}/branches?page=${repoInfo.page}`,
            accessToken
        );

        logger.debug(`GitHub branchesAsync response type: ${typeof response}`);

        // Ensure we return an array
        if (Array.isArray(response)) {
            logger.debug(`GitHub branchesAsync found ${response.length} branches`);

            // Add audit logging for successful branch retrieval
            logger.audit(
                `Data access: Retrieved ${response.length} branches from ${repoInfo.organisation}/${repoInfo.repo}`
            );

            return [response, {}, {}];
        } else {
            logger.warn(`GitHub branchesAsync response is not an array, converting to array`);
            logger.debug(`Response: ${JSON.stringify(response)}`);

            // If response is not an array, return an empty array
            return [[], {}, {}];
        }
    } catch (error) {
        logger.error(`Error in branchesAsync: ${error.message}`);
        // Return empty array on error
        return [[], {}, {}];
    }
};

const modelsAsync = async (branchInfo, accessToken) => {
    await Promise.resolve(); // Ensure async function has await expression

    try {
        logger.info(
            `Fetching models from GitHub for ${branchInfo.organisation}/${
                branchInfo.repo
            }/${repoRootDirectory()} on branch ${branchInfo.branch}`
        );

        const response = await fetchGitHub(
            `/repos/${branchInfo.organisation}/${
                branchInfo.repo
            }/contents/${repoRootDirectory()}?ref=${branchInfo.branch}`,
            accessToken
        );

        logger.debug(`GitHub modelsAsync response type: ${typeof response}`);

        // Process the response to ensure we have a proper array of model objects
        let models = [];

        if (Array.isArray(response)) {
            logger.debug(`GitHub modelsAsync found ${response.length} items`);

            // Filter for JSON files only
            models = response
                .filter((item) => {
                    // Check if it's a file and has a .json extension
                    return (
                        item.type === 'file' &&
                        item.name &&
                        typeof item.name === 'string' &&
                        item.name.toLowerCase().endsWith('.json')
                    );
                })
                .map((item) => {
                    // Ensure the name property is a proper string
                    if (typeof item.name !== 'string') {
                        logger.warn(`Item name is not a string: ${JSON.stringify(item.name)}`);
                        item.name = String(item.name || '');
                    }
                    return item;
                });

            logger.debug(`Filtered to ${models.length} JSON model files`);
        } else if (response && typeof response === 'object') {
            logger.warn(`GitHub modelsAsync response is not an array, processing as object`);

            // If response is not an array but has a message property, it might be an error
            if (response.message) {
                logger.error(`GitHub API error: ${response.message}`);
                return [[], {}, {}];
            }

            // If it's a single file with .json extension, include it
            if (
                response.type === 'file' &&
                response.name &&
                typeof response.name === 'string' &&
                response.name.toLowerCase().endsWith('.json')
            ) {
                models = [response];
            }
        }

        // Log the processed models
        logger.debug(
            `Returning ${models.length} models with names:`,
            models.map((m) => (typeof m.name === 'string' ? m.name : JSON.stringify(m.name)))
        );

        // Add audit logging for successful model retrieval
        logger.audit(
            `Data access: Retrieved ${models.length} threat models from ${branchInfo.organisation}/${branchInfo.repo}/${branchInfo.branch}`
        );

        return [models, {}, {}];
    } catch (error) {
        logger.error(`Error in modelsAsync: ${error.message}`);
        logger.error(`Error stack: ${error.stack}`);
        // Return empty array on error
        return [[], {}, {}];
    }
};

const modelAsync = async (modelInfo, accessToken) => {
    await Promise.resolve(); // Ensure async function has await expression

    // Ensure modelInfo.model is a string
    if (typeof modelInfo.model !== 'string') {
        logger.debug(`Model is not a string, converting: ${JSON.stringify(modelInfo.model)}`);

        // If it's a character-by-character object, convert it to a string
        if (modelInfo.model && typeof modelInfo.model === 'object') {
            const keys = Object.keys(modelInfo.model);
            if (keys.length > 0 && !isNaN(parseInt(keys[0]))) {
                try {
                    const sortedKeys = keys.sort((a, b) => parseInt(a) - parseInt(b));
                    modelInfo.model = sortedKeys.map((key) => modelInfo.model[key]).join('');
                    logger.debug(`Converted model name to: ${modelInfo.model}`);
                } catch (err) {
                    logger.error(`Error converting model name: ${err.message}`);
                    modelInfo.model = String(modelInfo.model);
                }
            } else {
                modelInfo.model = String(modelInfo.model);
            }
        } else {
            modelInfo.model = String(modelInfo.model || '');
        }
    }

    logger.info(
        `Fetching model: ${modelInfo.model} from ${modelInfo.organisation}/${modelInfo.repo}`
    );
    logger.debug(`Using path: ${getModelPath(modelInfo)}`);

    try {
        const data = await fetchGitHub(
            `/repos/${modelInfo.organisation}/${modelInfo.repo}/contents/${getModelPath(
                modelInfo
            )}?ref=${modelInfo.branch}`,
            accessToken
        );

        // Add audit logging for successful model retrieval
        logger.audit(
            `Data access: Retrieved threat model ${modelInfo.model} from ${modelInfo.organisation}/${modelInfo.repo}/${modelInfo.branch}`
        );

        return [data];
    } catch (error) {
        logger.error(`Error in modelAsync: ${error.message}`);
        logger.error(`Error stack: ${error.stack}`);

        // Handle "file not found" or other 404 errors
        if (
            error.message &&
            (error.message.includes('Not Found') || error.message.includes('404'))
        ) {
            logger.warn(`Model file ${getModelPath(modelInfo)} not found, returning empty object`);
            return [{}];
        }

        throw error;
    }
};

const createAsync = async (modelInfo, accessToken) => {
    await Promise.resolve(); // Ensure async function has await expression

    // Ensure modelInfo.model is a string
    if (typeof modelInfo.model !== 'string') {
        logger.debug(`Model is not a string, converting: ${JSON.stringify(modelInfo.model)}`);

        // If it's a character-by-character object, convert it to a string
        if (modelInfo.model && typeof modelInfo.model === 'object') {
            const keys = Object.keys(modelInfo.model);
            if (keys.length > 0 && !isNaN(parseInt(keys[0]))) {
                try {
                    const sortedKeys = keys.sort((a, b) => parseInt(a) - parseInt(b));
                    modelInfo.model = sortedKeys.map((key) => modelInfo.model[key]).join('');
                    logger.debug(`Converted model name to: ${modelInfo.model}`);
                } catch (err) {
                    logger.error(`Error converting model name: ${err.message}`);
                    modelInfo.model = String(modelInfo.model);
                }
            } else {
                modelInfo.model = String(modelInfo.model);
            }
        } else {
            modelInfo.model = String(modelInfo.model || '');
        }
    }

    // Ensure model name ends with .json
    if (!modelInfo.model.toLowerCase().endsWith('.json')) {
        modelInfo.model = `${modelInfo.model}.json`;
        logger.debug(`Added .json extension to model name: ${modelInfo.model}`);
    }

    logger.info(
        `Creating model: ${modelInfo.model} in ${modelInfo.organisation}/${modelInfo.repo}`
    );
    logger.debug(`Using path: ${getModelPath(modelInfo)}`);

    try {
        const result = await fetchGitHub(
            `/repos/${modelInfo.organisation}/${modelInfo.repo}/contents/${getModelPath(
                modelInfo
            )}`,
            accessToken,
            {
                method: 'PUT',
                body: JSON.stringify({
                    message: 'Created by OWASP Threat Dragon',
                    content: Buffer.from(getModelContent(modelInfo)).toString('base64'),
                    branch: modelInfo.branch
                })
            }
        );

        // Add audit logging for successful model creation
        logger.audit(
            `Data modification: Created threat model ${modelInfo.model} in ${modelInfo.organisation}/${modelInfo.repo}/${modelInfo.branch}`
        );

        return result;
    } catch (error) {
        logger.error(`Error in createAsync: ${error.message}`);
        logger.error(`Error stack: ${error.stack}`);
        throw error;
    }
};

const updateAsync = async (modelInfo, accessToken) => {
    await Promise.resolve(); // Ensure async function has await expression

    // Ensure modelInfo.model is a string
    if (typeof modelInfo.model !== 'string') {
        logger.debug(`Model is not a string, converting: ${JSON.stringify(modelInfo.model)}`);

        // If it's a character-by-character object, convert it to a string
        if (modelInfo.model && typeof modelInfo.model === 'object') {
            const keys = Object.keys(modelInfo.model);
            if (keys.length > 0 && !isNaN(parseInt(keys[0]))) {
                try {
                    const sortedKeys = keys.sort((a, b) => parseInt(a) - parseInt(b));
                    modelInfo.model = sortedKeys.map((key) => modelInfo.model[key]).join('');
                    logger.debug(`Converted model name to: ${modelInfo.model}`);
                } catch (err) {
                    logger.error(`Error converting model name: ${err.message}`);
                    modelInfo.model = String(modelInfo.model);
                }
            } else {
                modelInfo.model = String(modelInfo.model);
            }
        } else {
            modelInfo.model = String(modelInfo.model || '');
        }
    }

    // Ensure model name ends with .json
    if (!modelInfo.model.toLowerCase().endsWith('.json')) {
        modelInfo.model = `${modelInfo.model}.json`;
        logger.debug(`Added .json extension to model name: ${modelInfo.model}`);
    }

    logger.info(
        `Updating model: ${modelInfo.model} in ${modelInfo.organisation}/${modelInfo.repo}`
    );
    logger.debug(`Using path: ${getModelPath(modelInfo)}`);

    try {
        const original = await modelAsync(modelInfo, accessToken);

        const result = await fetchGitHub(
            `/repos/${modelInfo.organisation}/${modelInfo.repo}/contents/${getModelPath(
                modelInfo
            )}`,
            accessToken,
            {
                method: 'PUT',
                body: JSON.stringify({
                    message: 'Updated by OWASP Threat Dragon',
                    content: Buffer.from(getModelContent(modelInfo)).toString('base64'),
                    sha: original[0].sha,
                    branch: modelInfo.branch
                })
            }
        );

        // Add audit logging for successful model update
        logger.audit(
            `Data modification: Updated threat model ${modelInfo.model} in ${modelInfo.organisation}/${modelInfo.repo}/${modelInfo.branch}`
        );

        return result;
    } catch (error) {
        logger.error(`Error in updateAsync: ${error.message}`);
        logger.error(`Error stack: ${error.stack}`);
        throw error;
    }
};

const deleteAsync = async (modelInfo, accessToken) => {
    await Promise.resolve(); // Ensure async function has await expression

    // Ensure modelInfo.model is a string
    if (typeof modelInfo.model !== 'string') {
        logger.debug(`Model is not a string, converting: ${JSON.stringify(modelInfo.model)}`);

        // If it's a character-by-character object, convert it to a string
        if (modelInfo.model && typeof modelInfo.model === 'object') {
            const keys = Object.keys(modelInfo.model);
            if (keys.length > 0 && !isNaN(parseInt(keys[0]))) {
                try {
                    const sortedKeys = keys.sort((a, b) => parseInt(a) - parseInt(b));
                    modelInfo.model = sortedKeys.map((key) => modelInfo.model[key]).join('');
                    logger.debug(`Converted model name to: ${modelInfo.model}`);
                } catch (err) {
                    logger.error(`Error converting model name: ${err.message}`);
                    modelInfo.model = String(modelInfo.model);
                }
            } else {
                modelInfo.model = String(modelInfo.model);
            }
        } else {
            modelInfo.model = String(modelInfo.model || '');
        }
    }

    // Ensure model name ends with .json
    if (!modelInfo.model.toLowerCase().endsWith('.json')) {
        modelInfo.model = `${modelInfo.model}.json`;
        logger.debug(`Added .json extension to model name: ${modelInfo.model}`);
    }

    logger.info(
        `Deleting model: ${modelInfo.model} from ${modelInfo.organisation}/${modelInfo.repo}`
    );
    logger.debug(`Using path: ${getModelPath(modelInfo)}`);

    try {
        const content = await modelAsync(modelInfo, accessToken);

        const result = await fetchGitHub(
            `/repos/${modelInfo.organisation}/${modelInfo.repo}/contents/${getModelPath(
                modelInfo
            )}`,
            accessToken,
            {
                method: 'DELETE',
                body: JSON.stringify({
                    message: 'Deleted by OWASP Threat Dragon',
                    sha: content[0].sha,
                    branch: modelInfo.branch
                })
            }
        );

        // Add audit logging for successful model deletion
        logger.audit(
            `Data modification: Deleted threat model ${modelInfo.model} from ${modelInfo.organisation}/${modelInfo.repo}/${modelInfo.branch}`
        );

        return result;
    } catch (error) {
        logger.error(`Error in deleteAsync: ${error.message}`);
        logger.error(`Error stack: ${error.stack}`);
        throw error;
    }
};

const getModelPath = (modelInfo) => {
    // Ensure modelInfo.model is a string
    const modelName = String(modelInfo.model || '');

    // For the model endpoint, we're directly accessing the file in the root directory
    // The GitHub API expects the full path to the file
    logger.debug(`Model path: ${repoRootDirectory()}/${modelName}`);
    return `${repoRootDirectory()}/${modelName}`;
};
const getModelContent = (modelInfo) => JSON.stringify(modelInfo.body, null, '  ');

export default {
    name: 'githubrepo',
    branchesAsync,
    createAsync,
    deleteAsync,
    modelAsync,
    modelsAsync,
    reposAsync,
    searchAsync,
    updateAsync,
    userAsync
};
