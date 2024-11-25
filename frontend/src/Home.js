import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VirtualKeyboard from './VirtualKeyboard';
import Header from './Header';
import './Home.css';


const Home = () => {
  const [formData, setFormData] = useState({ nome: '', nickname: '', email: '' });
  const [activeField, setActiveField] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (value) => {
    setFormData((prev) => ({ ...prev, [activeField]: value }));
  };

  const handleForm = async () => {
    try {
      navigate(`/form`);
    } catch (error) {
      console.error('Error starting game:');
    }
  };

  const handleClassifica = async () => {
    try {
      navigate(`/leaderboard`);
    } catch (error) {
      console.error('Error starting game:');
    }
  };

  return (
    <div className="form-container">
        <Header showAigro={false} />
        <span className='description'>FoodpAIring è un progetto 4.0 di ITS Academy Agroalimentare Piemonte – Annoluce. Con dati proprietari esplora l'arte del food pairing con un'intelligenza artificiale RAG. Suggerisce abbinamenti armoniosi di cibi e bevande, combinando dati aromatici e intuizioni.</span>
        <img src="aigro.png" alt="aigro" className="img_robot"/>
        <button className="gioca-button" onClick={handleForm}>
            Gioca
        </button>
        <button className="classifica-button" onClick={handleClassifica}>
            Classifica
        </button>
      </div>
  );
};

export default Home;
