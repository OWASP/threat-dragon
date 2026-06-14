import boxes from './diagrams/boxes';
import detail from './detail';
import diagrams from './diagrams/diagrams';
import flows from './diagrams/flows';
import nodes from './diagrams/nodes';
import schema from '@/assets/schema/threat-model.schema';
import scope from './scope';
import { buildVersion } from '@/store';
import summary from './summary';
import threats from './diagrams/threats/threats';

const createKey = (source, target, key) => {
    if (Object.hasOwn(source, key)) {
        target[key] = source[key];
    }
};

// export a Threat Dragon file to TM-BOM format, required keys for TM-BOM:
// version, scope, trust_zones, trust_boundaries, actors, components
// data_stores, data_sets, data_flows
export const exportAsTmbom = (model) => {
    const tmbomNodes = nodes.convert(model);
    const tmbomThreats = threats.convert(model);
    const tmbom = {
        $schema: schema.$id,
        version: model.compatibility?.version || buildVersion,
        scope: scope.convert(model),
        diagrams: diagrams.convert(model),
        trust_zones: boxes.convert(model, tmbomNodes),
        trust_boundaries: [],
        actors: tmbomNodes.actors,
        components: tmbomNodes.components,
        data_stores: tmbomNodes.data_stores,
        data_sets: [],
        data_flows: flows.convert(model),
        threat_personas: tmbomThreats.threat_personas,
        threats: tmbomThreats.threats,
        controls: tmbomThreats.controls,
        risks: tmbomThreats.risks
    };

    // compatibility object exists if original file was also TM-BOM
    if (model.compatibility) {
        // optional key values
        createKey(model.compatibility, tmbom, 'description');
        createKey(model.compatibility, tmbom, 'frozen');
        createKey(model.compatibility, tmbom, 'released_at');
        createKey(model.compatibility, tmbom, 'product_release_date');
        createKey(model.compatibility, tmbom, 'release_docs_link');
        createKey(model.compatibility, tmbom, 'reviewed_at');
        createKey(model.compatibility, tmbom, 'repo_link');
    }

    return tmbom;
};

// import a TM-BOM file to Threat Dragon format
export const importTmbom = (model) => {

    // required values not used by TD but need to be preserved
    const compatibility = {
        version: model.version,
        description: model.description,
    };

    // optional values need to be preserved but only if present
    createKey(model, compatibility, 'frozen');
    createKey(model, compatibility, 'released_at');
    createKey(model, compatibility, 'product_release_date');
    createKey(model, compatibility, 'release_docs_link');
    createKey(model, compatibility, 'reviewed_at');
    createKey(model, compatibility, 'repo_link');

    return {
        summary: summary.merge(model),
        detail: detail.merge(model, buildVersion),
        version: buildVersion,
        compatibility
    };
};

// read a TM-BOM file
const read = (model) => {
    // not supported yet, return an empty Threat Dragon model with TM-BOM attached
    return {
        version: buildVersion,
        summary: {
            title: model.scope.title,
            owner: '',
            description: 'Empty Threat Dragon model from a TM-BOM',
            id: 0
        },
        detail: {
            contributors: [],
            diagrams: [],
            diagramTop: 0,
            reviewer: '',
            threatTop: 0
        },
        tmBom: model
    };

};

// write a TM-BOM file
const write = (model) => {
    // not supported yet, so return a nearly empty TM-BOM
    return {
        version: buildVersion,
        scope: {
            title: model.tmBom.scope.title,
            description: 'Empty Threat Model Bill of Materials (TM-BOM)',
            business_criticality: '',
            data_sensitivity: '',
            exposure: '',
            tier: ''
        },
        trust_zones: [],
        trust_boundaries: [],
        actors: [],
        components: [],
        data_stores: [],
        data_sets: [],
        data_flows: []
    };
};

export default {
    exportAsTmbom,
    importTmbom,
    read,
    write
};
