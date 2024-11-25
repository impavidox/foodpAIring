const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // To generate unique game IDs

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
let db;
try {
  db = new Database('./game.db');
  console.log('Database connected');

  // Create tables if they do not exist
  db.prepare(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY,
      question TEXT,
      options TEXT,
      correctAnswer TEXT
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS game_results (
      id INTEGER PRIMARY KEY,
      email TEXT,
      name TEXT,
      nickname TEXT,
      finalScore INTEGER,
      scoreCat INTEGER,
      answers TEXT,
      gameId TEXT,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
} catch (err) {
  console.error('Error initializing database:', err);
  process.exit(1); // Exit the application if database initialization fails
}

// Route to fetch questions from the database
app.get('/api/questions', (req, res) => {
  try {
    const rows = db
      .prepare('SELECT * FROM questions ORDER BY RANDOM() LIMIT 5')
      .all();

    const formattedQuestions = rows.map(q => ({
      id: q.id,
      text: q.question,
      options: q.options.replace(/\s+/g, '').split(','), // Parse the stringified options back to an array
      correctAnswer: q.correctAnswer,
    }));

    res.json(formattedQuestions);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: 'Error fetching questions' });
  }
});

// Route to start a new game
app.post('/api/start-game', (req, res) => {
  const { nome, nickname, email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required to start the game' });
  }

  const gameId = uuidv4(); // Generate a unique game session ID

  try {
    db.prepare(
      `INSERT INTO game_results (email, name, nickname, finalScore, answers, gameId) 
      VALUES (?, ?, ?, ?, ?, ?)`
    ).run(email, nome, nickname, 0, JSON.stringify([]), gameId);

    res.status(200).json({
      message: 'Game started successfully',
      gameId: gameId,
    });
  } catch (err) {
    console.error('Error starting the game:', err);
    res.status(500).json({ error: 'Error starting the game' });
  }
});

// Route to save game results
app.post('/api/game', (req, res) => {
  const { gameId, answers, score, scorecat } = req.body;

  try {
    db.prepare(
      `UPDATE game_results 
      SET finalScore = ?, answers = ?, scoreCat = ? 
      WHERE gameId = ?`
    ).run(score, JSON.stringify(answers), scorecat, gameId);

    res.status(200).json({ message: 'Game result saved successfully' });
  } catch (err) {
    console.error('Error saving game result:', err);
    res.status(500).json({ error: 'Error saving game result' });
  }
});

// Route to get leaderboard
app.get('/api/leaderboard', (req, res) => {
  const length = parseInt(req.query.length);

  try {
    const rows = db
      .prepare(
        `SELECT nickname, finalScore 
        FROM game_results 
        ORDER BY finalScore DESC
        LIMIT ?`
      )
      .all(length);

    res.json(rows);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Error fetching leaderboard' });
  }
});

// Route to get rank by game ID
app.get('/api/rank', (req, res) => {
  const gameId = req.query.gameId;

  try {
    const row = db
      .prepare(
        `
        SELECT gameId, nickname, finalScore, rank, name, email, scoreCat
        FROM (
          SELECT gameId, nickname, finalScore, 
                 RANK() OVER (ORDER BY finalScore DESC) AS rank, name, email, scoreCat
          FROM game_results
        ) ranked_games
        WHERE gameId = ?
        `
      )
      .get(gameId);

    if (!row) {
      return res.status(404).json({ error: 'Game ID not found' });
    }

    res.json({
      gameId: row.gameId,
      nickname: row.nickname,
      finalScore: row.finalScore,
      rank: row.rank,
      nome: row.name,
      email: row.email,
      scorecat: row.scoreCat,
    });
  } catch (err) {
    console.error('Error fetching rank:', err);
    res.status(500).json({ error: 'Error fetching rank' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
