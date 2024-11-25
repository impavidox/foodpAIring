import React, { useState } from 'react';
import './VirtualKeyboard.css';

const keys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L','@'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '.', '_','<-'],
    ['Space'],
];

function VirtualKeyboard({ currentValue, onKeyPress, onClose }) {
    const [isVisible, setIsVisible] = useState(true);

    const handleKeyPress = (key) => {
        if (key === '<-') {
            onKeyPress(currentValue.slice(0, -1));
        } else if (key === 'Space') {
            onKeyPress(`${currentValue} `);
        } else {
            onKeyPress(`${currentValue}${key}`);
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Match the animation duration
    };

        return (
        <div className={`keyboard-wrapper ${isVisible ? 'open' : 'close'}`}>
            <div className="keyboard-container">
                {keys.map((row, rowIndex) => (
                    <div key={rowIndex} className="keyboard-row">
                        {row.map((key) => (
                            <button
                                key={key}
                                className={`keyboard-key${key === 'Space' ? 'space-key' : ''}`}
                                onClick={() => handleKeyPress(key)}
                            >
                                {key === 'Space' ? 'Space' : key}
                            </button>
                        ))}
                    </div>
                ))}
                <button className="keyboard-close" onClick={handleClose}>
                    &times; {/* Unicode for "X" */}
                </button>
            </div>
        </div>
    );
}

export default VirtualKeyboard;
