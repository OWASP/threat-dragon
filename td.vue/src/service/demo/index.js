import v2NewThreatModel from './v2-new-model.js';
import threeTierWebApp from './three-tier-web-app.js';
import v2DemoThreatModel from './v2-threat-model.js';

const models = [
	{ name: 'Demo Threat Model', model: v2DemoThreatModel },
	{ name: 'Three Tier Web Application', model: threeTierWebApp },
    { name: 'New Blank Model', model: v2NewThreatModel }
];

export default {
    models
};
