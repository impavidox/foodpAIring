import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
  
    // Disable right-click menu and gestures like double-tap zoom
    document.addEventListener('gesturestart', preventDefault);
    document.addEventListener('gesturechange', preventDefault);
    document.addEventListener('gestureend', preventDefault);
  
    // Disable touch actions globally
    document.addEventListener('touchstart', preventDefault);
  
    return () => {
      document.removeEventListener('gesturestart', preventDefault);
      document.removeEventListener('gesturechange', preventDefault);
      document.removeEventListener('gestureend', preventDefault);
      document.removeEventListener('touchstart', preventDefault);
    };
  }, []);
  

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
