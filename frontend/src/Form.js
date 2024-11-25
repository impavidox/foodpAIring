import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VirtualKeyboard from './VirtualKeyboard';
import Header from './Header';
import './Form.css';

// Lazy-load the game page with a preload capability
const lazyWithPreload = (importFunc) => {
  const Component = React.lazy(importFunc);
  Component.preload = importFunc;
  return Component;
};

const GamePage = lazyWithPreload(() => import('./Game')); // Adjust the path to your GamePage

const Form = () => {
  const [formData, setFormData] = useState({ nome: '', nickname: '', email: '' });
  const [activeField, setActiveField] = useState(null);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const navigate = useNavigate();
  const [Tutorial, setTutorial] = useState(false);

  const handleInputChange = (field, value) => {
    if (field === 'nickname' && value.length > 3) return; // Limit to 3 characters
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleHomeGame = async () => {
    navigate('/');
  };

  const handleStartGame = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/start-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const { gameId } = await response.json();
      navigate(`/game?gameId=${gameId}`);
    } catch (error) {
      console.error('Error starting game:', formData);
    }
  };

  const handleTutorial = async () => {
    setTutorial(true);
    setActiveField(null)
  };


  const preloadNextPage = () => {
    GamePage.preload?.(); // Preload the GamePage component
  };

  const isFormValid =
    Object.values(formData).every((value) => value.trim() !== '') && isPrivacyChecked;

  return (
    <div className="form-container">
      {Tutorial ? <img src='Tutorial.png' onClick={handleStartGame}></img>:
      <><Header showAigro={true} />
      <div className="form-form">
        {['nome', 'nickname', 'email'].map((field) => (
          <input
            key={field}
            type={field === 'email' ? 'email' : 'text'}
            placeholder={activeField === field ? '' : `Inserisci ${field}`}
            value={formData[field]}
            onClick={() => setActiveField(field)}
            className={`input-field ${activeField === field ? 'active' : ''}`}
          />
        ))}
        {activeField && (
          <VirtualKeyboard
            currentValue={formData[activeField]}
            onKeyPress={(value) => handleInputChange(activeField, value)}
            onClose={() => setActiveField(null)}
          />
        )}
        <div className="privacy-container">
          <input
            type="checkbox"
            id="privacy"
            checked={isPrivacyChecked}
            onChange={(e) => setIsPrivacyChecked(e.target.checked)}
          />
          <label htmlFor="privacy">I agree to the privacy policy</label>
        </div>
        <button
          className="start-button"
          onClick={handleTutorial}
          onTouchStart={preloadNextPage} // Preload when the user touches the button
          disabled={!isFormValid}
        >
          Start Game
        </button>
        <button className="leaderboard-home" onClick={handleHomeGame}>
          <img src="home.png" alt="home" className="logo_home" />
        </button>
      </div></>}
    </div>
  );
};

export default Form;
