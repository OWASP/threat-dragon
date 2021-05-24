/**
 * @name v2
 * @description Upgrade scripts from v1 to v2 of Threat Models
 */
import { modelVersions } from './versions.js';

/**
 * Upgrades a threat model from version 1 to version 2
 * See upgrader.js for more info on versioning
 * @param {Object} threatModel
 * @returns {Object}
 */
const upgrade = (threatModel) => ({
    version: modelVersions.v2_0,
    title: threatModel.summary.title || '',
    owner: threatModel.summary.owner || '',
    reviewer: threatModel.reviewer || '',
    description: threatModel.summary.description || '',
    contributors: (threatModel.detail.contributors || []).map(x => x.name),
    diagrams: threatModel.detail.diagrams
});

export default {
    upgrade
};
