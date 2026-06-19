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

// export Plain Old Dragon (POD) format to a TM-BOM file
export const exportAsTmbom = (model) => {
    const tmbomNodes = nodes.convert(model);
    const tmbomThreats = threats.convert(model);
    const tmbom = {
        $schema: schema.$id,
        version: model.compatibility?.version || buildVersion, // required
        scope: scope.convert(model), // required
        diagrams: diagrams.convert(model),
        trust_zones: boxes.convert(model, tmbomNodes), // required
        trust_boundaries: [], // required
        actors: tmbomNodes.actors, // required
        components: tmbomNodes.components, // required
        data_stores: tmbomNodes.data_stores, // required
        data_sets: [], // required
        data_flows: flows.convert(model), // required
        threat_personas: tmbomThreats.threat_personas,
        threats: tmbomThreats.threats,
        controls: tmbomThreats.controls,
        risks: tmbomThreats.risks
    };

    // compatibility object exists if original file was also TM-BOM
    if (model.compatibility) {
        // optional key values
        tmbom.description = model.compatibility?.description || undefined;
        tmbom.frozen = model.compatibility?.frozen;
        tmbom.released_at = model.compatibility?.released_at || undefined;
        tmbom.product_release_date = model.compatibility?.product_release_date || undefined;
        tmbom.release_docs_link = model.compatibility?.release_docs_link || undefined;
        tmbom.reviewed_at = model.compatibility?.reviewed_at || undefined;
        tmbom.repo_link = model.compatibility?.repo_link || undefined;
    }

    return tmbom;
};

// import a TM-BOM file to POD
export const importTmbom = (model) => {

    // required values not used by TD but need to be preserved
    const compatibility = {
        version: model.version,
        description: model.description,
    };

    // optional values need to be preserved but only if present
    compatibility.frozen = model?.frozen;
    compatibility.released_at = model?.released_at || undefined;
    compatibility.product_release_date = model?.product_release_date || undefined;
    compatibility.release_docs_link = model?.release_docs_link || undefined;
    compatibility.reviewed_at = model?.reviewed_at || undefined;
    compatibility.repo_link = model?.repo_link || undefined;

    return {
        summary: summary.merge(model),
        detail: detail.merge(model, buildVersion),
        version: buildVersion,
        compatibility
    };
};

// read a TM-BOM file to POD
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

// write a TM-BOM file from POD
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
