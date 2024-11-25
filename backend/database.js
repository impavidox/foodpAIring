const Database = require('better-sqlite3');

// Initialize SQLite database
let db;

try {
    db = new Database('./game.db');
    console.log('Database connected');

    // Create tables if they don't exist
    db.prepare(`
        CREATE TABLE IF NOT EXISTS games (
            game_id TEXT PRIMARY KEY,
            player_name TEXT,
            player_email TEXT,
            final_score INTEGER
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT,
            options TEXT,  -- Comma separated options
            correct TEXT,  -- Correct answer option
            score INTEGER   -- Score assigned for answering correctly
        )
    `).run();

} catch (err) {
    console.error('Error opening database:', err);
}

module.exports = db;
