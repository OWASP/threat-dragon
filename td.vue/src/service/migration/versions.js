/**
 * The known versions of threat models
 * This may not be in lock-step with the Threat Dragon version,
 * as the schema should not be changing as frequently as 
 * Threat Dragon is updated
 * Versioning should follow semver, minus the build number.
 * New features should increment the minor version
 * Breaking changes should increment the major version
 * @type {Object}
 */
export const modelVersions = Object.freeze({
    v1: '1',
    v2_0: '2.0'
});
