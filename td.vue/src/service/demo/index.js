import demoThreatModel from './demo-threat-model.js';
import legacyDesktopModel from './legacy-desktop-model.js';
import legacyModel2 from './legacy-model-2.js';
import legacyModel from './legacy-model.js';

const models = [
    { name: 'Demo Threat Model', model: demoThreatModel },
    { name: 'Legacy Desktop Model', model: legacyDesktopModel },
    { name: 'Legacy Model', model: legacyModel },
    { name: 'Legacy Model 2', model: legacyModel2 }
];

export default {
    models
};
