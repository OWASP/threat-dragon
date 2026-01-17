import cornucopia from './cornucopia';

// more games can be added here
const games = {
    cornucopia
};

export function getGame(id) {
    return games[id];
}

export function getAllGames() {
    return Object.values(games);
}