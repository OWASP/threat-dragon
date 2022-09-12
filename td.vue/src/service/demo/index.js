import newThreatModel from './new-model.js';
import demoThreatModel from './demo-threat-model.js';
import v2NewThreaModel from './v2-new-model.js';
import v2DemoThreatModel from './v2-threat-model.js';

const models = [
    { name: 'New Threat Model', model: newThreatModel },
    { name: 'Demo Threat Model', model: demoThreatModel },
    { name: 'Version 2 New Model', model: v2NewThreaModel },
    { name: 'Version 2 Demo Model', model: v2DemoThreatModel }
];

export default {
    models
};
