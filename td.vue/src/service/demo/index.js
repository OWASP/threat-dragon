import demoThreatModel from './demo-threat-model.js';
import legacyDesktopModel from './legacy-desktop-model.js';
import legacyModel2 from './legacy-model-2.js';
import legacyModel from './legacy-model.js';
import v2Model from './v2-threat-model.js';

const models = [
    { name: 'Demo Threat Model', model: demoThreatModel },
    { name: 'Legacy Desktop Model', model: legacyDesktopModel },
    { name: 'Legacy Model', model: legacyModel },
    { name: 'Legacy Model 2', model: legacyModel2 },
    { name: 'Version 2 Demo Model', model: v2Model }
];

export default {
    models
};
