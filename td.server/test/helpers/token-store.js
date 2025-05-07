import Database from 'better-sqlite3';
import { TokenStore } from '../../src/repositories/tokenStore.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.join(__dirname, '../db');

// Ensure test db directory exists
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

/**
 * SQLite token store backend for testing
 * Persists tokens in a SQLite database for tests
 */
export class SqliteTokenStore {
    constructor() {
        this.dbPath = path.join(dbDir, 'test-tokens.db');
        this.db = new Database(this.dbPath);

        // Create the tokens table if it doesn't exist
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS tokens (
        token TEXT PRIMARY KEY,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Prepare statements
        this.addStmt = this.db.prepare('INSERT OR REPLACE INTO tokens (token) VALUES (?)');
        this.removeStmt = this.db.prepare('DELETE FROM tokens WHERE token = ?');
        this.existsStmt = this.db.prepare('SELECT COUNT(*) as count FROM tokens WHERE token = ?');
    }

    add(token) {
        this.addStmt.run(token);
    }

    remove(token) {
        this.removeStmt.run(token);
    }

    exists(token) {
        const result = this.existsStmt.get(token);
        return result.count > 0;
    }

    /**
     * Clears all tokens from the store
     * Useful for test cleanup
     */
    clear() {
        this.db.exec('DELETE FROM tokens');
    }

    /**
     * Closes the database connection
     */
    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

/**
 * Create a token store instance with a SQLite backend for testing
 * @returns {TokenStore} A token store with SQLite backend
 */
export function createTestTokenStore() {
    const sqliteBackend = new SqliteTokenStore();
    return new TokenStore(sqliteBackend);
}

/**
 * Clean up the token store after tests
 * @param {SqliteTokenStore} sqliteBackend - The SQLite backend to clean up
 */
export function cleanupTestTokenStore(sqliteBackend) {
    if (sqliteBackend) {
        sqliteBackend.clear();
        sqliteBackend.close();
    }
}
