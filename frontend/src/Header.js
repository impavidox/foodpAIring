import React from 'react';
import './Header.css';

const Header = ({ showAigro }) => {
  return (
    <div className="home-header">
      <img src="logo_ITS.png" alt="ITS Academy Logo" className="logo_ITS" />
      {showAigro && <img src="aigro.png" alt="aigro" className="logo_robot" />}
      <img src="logo_pAIring.png" alt="Food pAIring Logo" className="logo_pAIring" />
    </div>
  );
};

export default Header;
