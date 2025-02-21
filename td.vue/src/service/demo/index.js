import v2NewThreatModel from './v2-new-model.js';
import threeTierWebApp from './three-tier-web-app.js';
import rentingCar from './renting-car.js';
//import payment from './payment.js';
//import onlineGame from './online-game.js';
//import iotDevice from './iot-device.js';
//import genericCms from './generic-cms.js';
import cryptoWallet from './cryptocurrency-wallet.js';
import v2DemoThreatModel from './v2-threat-model.js';

const models = [
    { name: 'Demo Threat Model', model: v2DemoThreatModel },
    { name: 'Cryptocurrency Wallet', model: cryptoWallet },
    //{ name: 'Generic CMS', model: genericCms },
    //{ name: 'IoT Device', model: iotDevice },
    //{ name: 'Online Game', model: onlineGame },
    //{ name: 'Payments Processing Platform', model: payment },
    { name: 'Renting Car Startup', model: rentingCar },
    { name: 'Three Tier Web Application', model: threeTierWebApp },
    { name: 'New Blank Model', model: v2NewThreatModel }
];

export default {
    models
};
