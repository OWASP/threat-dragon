import cornucopia from './cornucopia';
import cornucopiaMobileApp from './cornucopia-mobileapp';
import cornucopiaCompanion from './cornucopia-companion';
import cornucopiaEop from './cornucopia-eop';

// more games can be added here
const games = {
    cornucopia,
    'cornucopia-mobileapp': cornucopiaMobileApp,
    'cornucopia-companion': cornucopiaCompanion,
    'cornucopia-eop': cornucopiaEop
};

export function getGame(id) {
    return games[id];
}

export function getAllGames() {
    return Object.values(games);
}
