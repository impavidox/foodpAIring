import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Game from './Game';
import Form from './Form';
import Saver from './Saver';
import Leaderboard from './Leaderboard';
import Risultato from './Risultato';
import useInactivityTimer from './useInactivityTimer'; // Path to the hook

const App = () => {
  const [gameId, setGameId] = useState(null);

  useInactivityTimer(100000, '/saver'); 
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/saver" element={<Saver />} />
        <Route path="/form" element={<Form />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/risultato" element={<Risultato />} />
      </Routes>
  );
};

export default App;
