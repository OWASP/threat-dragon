import cornucopia from './cornucopia';
import cornucopiaMobileApp from './cornucopia-mobileapp';
import cornucopiaCompanion from './cornucopia-companion';

// more games can be added here
const games = {
    cornucopia,
    'cornucopia-mobileapp': cornucopiaMobileApp,
    'cornucopia-companion': cornucopiaCompanion
};

export function getGame(id) {
    return games[id];
}

export function getAllGames() {
    return Object.values(games);
}
