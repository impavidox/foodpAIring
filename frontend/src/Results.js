import React, { useState } from 'react';

function Results({ score, restartGame }) {
  const [name, setName] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  const submitScore = async () => {
    const response = await fetch('http://localhost:5000/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score }),
    });
    const data = await response.json();
    setLeaderboard(data);
  };

  return (
    <div>
      <h1>Your Score: {score}</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={submitScore}>Submit Score</button>
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            {entry.name}: {entry.score}
          </li>
        ))}
      </ul>
      <button onClick={restartGame}>Play Again</button>
    </div>
  );
}

export default Results;
