import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './Leaderboard.css';
import Header from './Header';

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [yourdata, setYourData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const gameId = queryParams.get('gameId'); // Get gameId if it exists

  const length = gameId ? 3 : 5;

  useEffect(() => {

    const fetchLeaderboard = async () => {
      try {
        // Construct query parameters
        const queryParams = new URLSearchParams({ length });
        
        // Fetch leaderboard data
        const res = await fetch(`http://localhost:5000/api/leaderboard?${queryParams}`);
        const leaderboard = await res.json();
        setData(leaderboard);

        if (gameId){
        const queryParams2 = new URLSearchParams({ gameId });
        
        // Fetch leaderboard data
        const res2 = await fetch(`http://localhost:5000/api/rank?${queryParams2}`);
        const leaderboard2 = await res2.json();
        setYourData(leaderboard2);
      }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, [length,gameId]); // Add `length` as a dependency for useEffect

  const handleRestartGame = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/start-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: yourdata.nome, nickname: yourdata.nickname, email: yourdata.email}),
      });
      const { gameId:newGameId } = await response.json();

      navigate(`/game?gameId=${newGameId}`);
    } catch (error) {
      console.error('Error starting game:');
    }
  };


  const handleYourPrize = async () =>{

  }

  const handleHomeGame = async () =>{
    navigate('/');
  }

  return (
    <div className="leaderboard">
      <Header showAigro={true}/>
      <ul className="leaderboard-list">
      <label className='leaderboard-title'>Classifica</label>
        {data.map((player, index) => (
          <li key={index} className="leaderboard-item">
            <span className='ranking'>{index+1}</span>
            <span className="name">{player.nickname}</span>
            <span className="score">{player.finalScore}p</span>
          </li>
        ))}
        {gameId && (<li key='ciao'  className='leaderboard-item' id='yourscore'>
          <span className='ranking'>{yourdata.rank}</span>
          <span className="name">{yourdata.nickname}</span>
          <span className="score">{yourdata.finalScore}p</span>
        </li>)};
      </ul>
      {gameId ?
      (<div className='Buttons'>
      <button className="leaderboard-restart" onClick={handleRestartGame}><img src="restart.png" alt="restart" className="logo_restart"/></button><button className="leaderboard-home2" onClick={handleHomeGame}><img src="home.png" alt="home" className="logo_home"/></button> </div>):
      (<>
        <button className="leaderboard-home" onClick={handleHomeGame}><img src="home.png" alt="home" className="logo_home"/></button></>)};
    </div>
  );
};



export default Leaderboard;
