import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Saver = () => {
  const navigate = useNavigate();


  const handleHome = async () => {
    try {
      navigate(`/`);
    } catch (error) {
      console.error('Error starting game:');
    }
  };


  return (
    <div className="form-container">
        <img src="screensaver.png" onClick={handleHome}/>
      </div>
  );
};

export default Saver;
