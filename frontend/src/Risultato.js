import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './Risultato.css';
import Header from './Header';

const Risultato = () => {
  const [data, setData] = useState([]);
  const [yourdata, setYourData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const gameId = queryParams.get('gameId'); // Get gameId if it exists
  const length = gameId ? 3 : 5;

  // Variable for switching text
  const scoreCategory = yourdata.scorecat || 'default'; // Example variable, use real logic if available

  const getTextForScore = (score) => {
    if (score >= 0 && score <= 24) {
      return {
        title: 'Curioso del palato',
        description: 'Hai iniziato il tuo viaggio nel mondo del Foodpairing, ma serve più attenzione alle preferenze del pubblico.',
        img:'francesco.gif'
      };
    } else if (score >= 25 && score <= 39) {
      return {
        title: 'Esploratore del gusto',
        description: 'Ottimo lavoro! Ti manca solo un pizzico di intuizione per diventare un maestro del gusto.',
        img:'francesco2.gif'
      };
    } else if (score >= 40) {
      return {
        title: 'Gusto Supremo',
        description: 'Sei un vero Maestro degli Abbinamenti! La tua capacità di intuire il gusto del pubblico è straordinaria.',
        img:'francesco3.gif'
      };
    } else {
      return {
        title: 'Titolo Generico',
        description: 'Testo predefinito per il caso di valori mancanti.',
      };
    }
  };

  const { title, description,img } = getTextForScore(yourdata.scorecat)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        if (gameId) {
          const queryParams2 = new URLSearchParams({ gameId });
          const res2 = await fetch(`http://localhost:5000/api/rank?${queryParams2}`);
          const leaderboard2 = await res2.json();
          //console.log(leaderboard2);
          setYourData(leaderboard2);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, [length, gameId]);

  const handleLeaderboard = () => {
    navigate(`/leaderboard?gameId=${gameId}`);
  };

  return (
    <div className="risultato">
      <Header showAigro={true} />
      <div className="labels">HAI TOTALIZZATO</div>
      <div className="scorecat">{yourdata.scorecat}</div>
      <div className="labels">PUNTI</div>
      <div className="category">
        <div className="circle">
          <img src={img} alt="Circle Visual" />
        </div>
        <div className="rectangle">
          <span className="title">{title}</span>
          <span className="description1">{description}</span>
        </div>
      </div>
      <button className="leaderboard-button" onClick={handleLeaderboard}>
        Classifica
      </button>
    </div>
  );
};

export default Risultato;
