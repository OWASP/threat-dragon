import cornucopia from './cornucopia';
import cornucopiaMobileApp from './cornucopia-mobileapp';

// more games can be added here
const games = {
    cornucopia,
    'cornucopia-mobileapp': cornucopiaMobileApp
};

export function getGame(id) {
    return games[id];
}

export function getAllGames() {
    return Object.values(games);
}
