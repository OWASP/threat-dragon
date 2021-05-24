/**
 * @name upgrader
 * @description Upgrades v1 threat model data to the v2 format
 */
import v2Upgrader from './v2.js';
import { modelVersions } from './versions.js';

/**
 * An array containing the upgrader scripts
 * for each version.
 */
const upgraders = [
    {
        // Upgrader not needed for v1
        version: modelVersions.v1
    },
    {
        version: modelVersions.v2_0,
        upgrader: v2Upgrader
    }
];

/**
 * Gets the threat model version
 * @param {Object} threatModel
 * @returns {String}
 */
const getVersion = (threatModel) => {
    const version = threatModel.version || modelVersions.v1;
    if (!Object.values(modelVersions).includes(version)) {
        throw new Error(`Invalid model version: ${version}`);
    }
    return version;
};

/**
 * Upgrades a threat model to the latest version if needed.
 * @param {Object} threatModel
 * @returns {Object}
 */
const upgrade = (threatModel) => {
    const version = getVersion(threatModel);

    const existingUpgrade = upgraders.find(u => u.version === version);
    if (existingUpgrade === upgraders[upgraders.length - 1]) {
        return threatModel;
    }

    let upgradedThreatModel = threatModel;
    for (let i = upgraders.indexOf(existingUpgrade) + 1; i < upgraders.length; i++) {
        upgradedThreatModel = upgraders[i].upgrader.upgrade(threatModel);
    }

    return upgradedThreatModel;
};

export default {
    getVersion,
    modelVersions,
    upgrade
};
