/**
 * In-memory token store backend
 * This is the original implementation now wrapped in a backend class
 */
export class InMemoryTokenStore {
    constructor() {
        this.refreshTokens = [];
    }

    add(token) {
        this.refreshTokens.push(token);
    }

    remove(token) {
        const idx = this.refreshTokens.indexOf(token);
        if (idx !== -1) {
            this.refreshTokens.splice(idx, 1);
        }
    }

    exists(token) {
        return this.refreshTokens.indexOf(token) !== -1;
    }
}

export default InMemoryTokenStore;
