import { badRequest, forbidden, notFound, serverError } from "./errors.js";

import env from "../env/Env.js";
import loggerHelper from "../helpers/logger.helper.js";
import repositories from "../repositories";
import responseWrapper from "./responseWrapper.js";

const logger = loggerHelper.get("controllers/templateController.js");


const fetchTemplateMetadata = async (repository, accessToken) => {
  // Fetch the metadata file from the repository
  const result = await repository.listTemplatesAsync(accessToken);
  const file = result[0];
  const decoded = Buffer.from(file.content, "base64").toString("utf8");
  const parsed = JSON.parse(decoded);
  const templates = Array.isArray(parsed) ? parsed : parsed.templates || [];
  
  return { templates, sha: file.sha };
};

/**
 * Lists all available templates from the repository
 * 
 * Handles multiple repository states:
 * - Normal operation: Returns array of template metadata
 * - NOT_CONFIGURED: GITHUB_CONTENT_REPO environment variable not set
 * - NOT_INITIALIZED: Repository exists but metadata file not created (admin can initialize, non-admins informed)
 * - REPO_NOT_FOUND: Repository doesn't exist or is inaccessible (404)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const listTemplates = (req, res) => responseWrapper.sendResponseAsync(async () => {
  const repository = repositories.get();
  const contentRepo = env.get().config.GITHUB_CONTENT_REPO;
  
  if (!contentRepo) {
    return {
      templates: [],
      repoStatus: "NOT_CONFIGURED",
      canInitialize: false,
      message: "Template repository not configured. Set GITHUB_CONTENT_REPO environment variable."
    };
  }
  try {
    const { templates } = await fetchTemplateMetadata(repository, req.provider.access_token);
    return { templates };
  } catch (e) {
    if (e.statusCode === 404) {
      try {
        await repository.repoExistsAsync(req.provider.access_token);
        
        return {
          templates: [],
          repoStatus: "NOT_INITIALIZED",
          canInitialize: req.user?.isAdmin || false,
          message: req.user?.isAdmin 
            ? "Template repository not initialized."
            : "Template repository not initialized. Contact administrator."
        };
      } catch (repoError) {
        return notFound(`Template repository '${contentRepo}' not found`, res, logger);
      }
    }
    throw e;
  }
}, req, res, logger);

const importTemplate = async (req, res) => {
  if (!req.user?.isAdmin) {
    logger.warn(`Non-admin user attempted to import template: ${req.user?.username}`);
    return forbidden(res, logger);
  }

  const repository = repositories.get();
  const accessToken = req.provider.access_token;
  const { templateMetadata, model } = req.body;

  try {
    const { templates, sha } = await fetchTemplateMetadata(repository, accessToken);

    const isDuplicate = templates.some(
      (t) => (t.name || "").toLowerCase() === templateMetadata.name.toLowerCase()
    );

    if (isDuplicate) {
      return badRequest(`A template with the name "${templateMetadata.name}" already exists`, res, logger);
    }

    templates.push(templateMetadata);

    await repository.updateMetadataAsync(accessToken, templates, sha);
    await repository.createContentFileAsync(accessToken, templateMetadata.modelRef, model);

    return res.status(201).json({
      status: 201,
      message: "Template imported successfully"
    });
  } catch (error) {
    logger.error("Import template error:", error);
    return serverError(error.message || "Failed to import template", res, logger);
  }
};

const deleteTemplate = async (req, res) => {
  if (!req.user?.isAdmin) {
    logger.warn(`Non-admin user attempted to delete template: ${req.user?.username}`);
    return forbidden(res, logger);
  }

  const repository = repositories.get();
  const accessToken = req.provider.access_token;
  const { id } = req.params;

  try {
    const { templates, sha } = await fetchTemplateMetadata(repository, accessToken);

    const template = templates.find((t) => t.id === id);
    if (!template) {
      return notFound(`Template with ID "${id}" not found`, res, logger);
    }

    const updatedTemplates = templates.filter((t) => t.id !== id);

    await repository.updateMetadataAsync(accessToken, updatedTemplates, sha);
    await repository.deleteContentFileAsync(accessToken, template.modelRef);
    

    return res.status(200).json({
      status: 200,
      message: "Template deleted successfully"
    });
  } catch (err) {
    logger.error(err);
    return serverError(err.message || "Failed to delete template", res, logger);
  }
};

const updateTemplate = async (req, res) => {
  if (!req.user?.isAdmin) {
    logger.warn(`Non-admin user attempted to update template: ${req.user?.username}`);
    return forbidden(res, logger);
  }

  const repository = repositories.get();
  const accessToken = req.provider.access_token;
  const { id } = req.params;
  const { name, description, tags } = req.body;

  try {
    logger.debug(`API updateTemplate request: ${logger.transformToString(req)}`);

    const { templates, sha } = await fetchTemplateMetadata(repository, accessToken);

    const templateIndex = templates.findIndex((t) => t.id === id);
    if (templateIndex === -1) {
      return notFound(`Template with ID "${id}" not found`, res, logger);
    }

    templates[templateIndex] = {
      ...templates[templateIndex],
      name: name.trim(),
      ...(description && { description: description.trim() }),
      ...(Array.isArray(tags) && { tags }),
      id: id, // Preserve original ID
      modelRef: templates[templateIndex].modelRef // Preserve content file reference
    };

    await repository.updateMetadataAsync(accessToken, templates, sha);

    return res.status(200).json({
      status: 200,
      message: "Template updated successfully"
    });
  } catch (err) {
    logger.error(err);
    return serverError(err.message || "Failed to update template", res, logger);
  }
};

/**
 * Retrieves the full content of a specific template
 * Available to all authenticated users
 * 
 * @param {string} req.params.id - The unique ID of the template
 * @returns {Object} The template content/model
 */
const getTemplateContent = (req, res) => {
  const repository = repositories.get();
  const accessToken = req.provider.access_token;
  const { id } = req.params;

  logger.debug(`API getTemplateContent request: ${logger.transformToString(req)}`);

  return responseWrapper.sendResponseAsync(async () => {
    const { templates } = await fetchTemplateMetadata(repository, accessToken);

    const templateMetadata = templates.find((t) => t.id === id);
    if (!templateMetadata) {
      return notFound(`Template with ID "${id}" not found`, res, logger);
    }

    try {
      const contentResult = await repository.getContentFileAsync(accessToken, templateMetadata.modelRef);
      const contentFile = contentResult[0];
      const decoded = Buffer.from(contentFile.content, "base64").toString("utf8");
      const templateContent = JSON.parse(decoded);

      return {
        content: templateContent,
      };
    } catch (error) {
      if (error.statusCode === 404) {
        return notFound(`Template content for "${templateMetadata.name}" not found`, res, logger);
      }
      throw error;
    }
  }, req, res, logger);
};


const bootstrapTemplateRepository = async (req, res) => {
  if (!req.user?.isAdmin) {
    logger.warn(`Non-admin user attempted to bootstrap template repository: ${req.user?.username}`);
    return forbidden(res, logger);
  }

  const repository = repositories.get();
  const accessToken = req.provider.access_token;
  const contentRepo = env.get().config.GITHUB_CONTENT_REPO;

  if (!contentRepo) {
    return badRequest("Template repository not configured. Set GITHUB_CONTENT_REPO environment variable.", res, logger);
  }

  try {
    logger.debug(`API bootstrapTemplateRepository request: ${logger.transformToString(req)}`);

    // Check if already initialized - prevent accidental overwrites
    try {
      await repository.listTemplatesAsync(accessToken);
      // If we get here, metadata exists - don't overwrite
      return badRequest("Template repository already initialized", res, logger);
    } catch (checkError) {
      // 404 is expected - means we can proceed with initialization
      if (checkError.statusCode !== 404) {
        throw checkError;
      }
    }

    // Create the initial empty metadata file
    await repository.createMetadataAsync(accessToken);

    return res.status(201).json({
      status: 201,
      message: "Template repository initialized successfully"
    });
  } catch (err) {
    logger.error(err);
    return serverError(err.message || "Failed to initialize template repository", res, logger);
  }
};

export default {
  listTemplates,
  importTemplate,
  deleteTemplate,
  updateTemplate,
  getTemplateContent,
  bootstrapTemplateRepository,
};
