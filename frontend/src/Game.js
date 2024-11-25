import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Game.css';
import Header from './Header';
import Timer from './Timer';

const Game = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [scoreBase, setScoreBase] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [resetTimer, setResetTimer] = useState(false); // Trigger to reset the timer
  const [remainingSeconds, setRemainingSeconds] = useState(10); // Track remaining seconds
  const [francesco, setFrancesco] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gameId = queryParams.get('gameId');
  const valutazioni = ['Scarso', 'Sufficiente', 'Buono', 'Ottimo', 'Super'];
  const [random, setRandom] = useState('1');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/questions');
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  const handleTimeout = () => {
    const question = questions[currentQuestionIndex];
    const updatedAnswers = { ...answers, [question.id]: null }; // Record no answer
    setAnswers(updatedAnswers);

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setTimeout(() => {
        setCurrentQuestionIndex(nextIndex);
        setSelectedOption(null); // Reset selection for the next question
        setResetTimer((prev) => !prev); // Reset the timer
        setRemainingSeconds(10); // Reset remaining seconds
      }, 500); // Add a 500ms delay before moving to the next question
    } else {
      setGameOver(true);
      submitGameResult(updatedAnswers, score); // Submit results at the end of the game
    }
  };

  const handleAnswer = (option) => {
    const question = questions[currentQuestionIndex];
    const updatedAnswers = { ...answers, [question.id]: option };

    const distance = Math.abs(option - question.correctAnswer);
    if (distance>2){
      if (francesco>1){
        setFrancesco((prevScore) => prevScore - 1)
      }
    }else if (distance<2){
      if (francesco<5){
        setFrancesco((prevScore) => prevScore + 1)
      }
    }
    setRandom((Math.floor(Math.random() * 3) + 1).toString())
    // Calculate score as (question base score) * (remaining seconds)
    const baseScore = (5-distance)*7 ;
    const scorecat = (5-distance)*2;
    const timeScore = baseScore * (remainingSeconds/10);
    //console.log('You answered '+option+' when the correct answer is '+question.correctAnswer+' producing a distance of '+distance+' with a base score of '+baseScore+' responding in '+remainingSeconds)

    setAnswers(updatedAnswers);
    setScore((prevScore) => prevScore + timeScore); // Update the total score
    setScoreBase((prevScore) => prevScore + scorecat);

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setSelectedOption(option); // Highlight the selected option
      setTimeout(() => {
        setCurrentQuestionIndex(nextIndex);
        setSelectedOption(null); // Reset selection for the next question
        setResetTimer((prev) => !prev); // Reset the timer for the next question
        setRemainingSeconds(10); // Reset remaining seconds
      }, 500); // Add a 500ms delay before moving to the next question
    } else {
      setSelectedOption(option); // Highlight the selected option
      setTimeout(() => {
        setGameOver(true);
        submitGameResult(updatedAnswers, score + timeScore, scoreBase+scorecat);
      }, 1500); // Add a delay before ending the game
    }
  };

  const submitGameResult = async (updatedAnswers, finalScore, scorecat) => {
    try {
      await axios.post('http://localhost:5000/api/game', {
        gameId,
        answers: updatedAnswers,
        score: finalScore,
        scorecat: scorecat
      });
      navigate(`/risultato?gameId=${gameId}`);
    } catch (error) {
      console.error('Error submitting game result:', error);
      alert('There was an error submitting your game results. Please try again.');
    }
  };

  if (!questions.length) return <div>Loading...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <Header showAigro={true} />
      <div className="game-container">
      <Timer
              duration={10} // Timer duration in seconds
              onTimeout={handleTimeout}
              resetTrigger={resetTimer} // Trigger to reset the timer
              onTimeUpdate={setRemainingSeconds} // Track remaining seconds
            />
        <h2 className="round-title">Round {currentQuestionIndex + 1}</h2>
        <div className="live-streaming">
          <img src='kitchen.png' className='background'></img>
          <img src={'reazioni/'+francesco+'/'+random+'.gif'} className='reaction'></img>
        </div>
        <div className="questions">
          <div className="question-card">
            <div className="question-circle">
              <img className='circle-image' src={'/alimenti/'+currentQuestion.text.split('+')[0].trim().toLowerCase()+'.jpg'}></img>
            </div>
            <div className="question-text">{currentQuestion.text.split('+')[0].trim()}</div>
          </div>
          <div className='question-plus'>+</div>
          <div className="question-card">
            <div className="question-circle">
              <img className='circle-image' src={'/alimenti/'+currentQuestion.text.split('+')[1].trim().toLowerCase()+'.jpg'}></img>
            </div>
            <div className="question-text">{currentQuestion.text.split('+')[1].trim()}</div>
          </div>
        </div>
        <div className="options-container">
          {currentQuestion.options.map((option, idx) => (
            <div key={idx} className="option-container">
              <button
                className={`option-btn ${
                  selectedOption === option ? 'selected' : ''
                }`} // Apply 'selected' class if this option is selected
                onClick={() => handleAnswer(option)} // Handle answer on click
              >
                {option}
              </button>
              <label className="option-tag">{valutazioni[option - 1]}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
