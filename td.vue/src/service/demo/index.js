import v2NewThreatModel from './v2-new-model';
import threeTierWebApp from './three-tier-web-app';
import rentingCar from './renting-car';
import payment from './payment-online';
import onlineGame from './online-game';
import iotDevice from './iot-device';
import genericCms from './generic-cms';
import cryptoWallet from './cryptocurrency-wallet';
import huskyAi from './huskyai.tmbom';
import v2DemoThreatModel from './v2-threat-model';

const models = [
    { name: 'Demo Threat Model', model: v2DemoThreatModel },
    { name: 'Husky AI', model: huskyAi },
    { name: 'Cryptocurrency Wallet', model: cryptoWallet },
    { name: 'Generic CMS', model: genericCms },
    { name: 'IoT Device', model: iotDevice },
    { name: 'Online Game', model: onlineGame },
    { name: 'Payments Processing Platform', model: payment },
    { name: 'Renting Car Startup', model: rentingCar },
    { name: 'Three Tier Web Application', model: threeTierWebApp },
    { name: 'New Blank Model', model: v2NewThreatModel }
];

export default {
    models
};
