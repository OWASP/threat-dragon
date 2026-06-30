import diagrams from './diagrams';
import { buildVersion } from '@/store';
import summary from './summary';

// import an Open Threat Model (OTM) file to Plain Old Dragon (POD) format
export const importOtm = (model) => {
    const allDiagrams = diagrams.merge(model, buildVersion);

    return {
        summary: summary.merge(model),
        detail: {
            contributors: [{ 'name': 'Imported from Open Threat Model' }],
            diagrams: allDiagrams.diagrams,
            diagramTop: allDiagrams.diagrams.length,
            reviewer: '',
            threatTop: model.threats?.length ? model.threats.length - 1 : 0
        },
        version: buildVersion,
        compatibility: {
            otmVersion: model.otmVersion || null,
            representations: allDiagrams?.codeRepresentations || [],
            components: allDiagrams?.codeComponents || []
        }
    };
};

export default {
    importOtm
};
