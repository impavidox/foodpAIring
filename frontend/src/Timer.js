import React, { useEffect, useState } from 'react';
import './Timer.css';

const Timer = ({ duration, onTimeout, resetTrigger, onTimeUpdate }) => {
  const [remainingMs, setRemainingMs] = useState(duration * 1000); // Track milliseconds remaining
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setRemainingMs(duration * 1000); // Reset the timer to the initial duration in milliseconds
    setIsActive(true); // Activate the timer
  }, [resetTrigger, duration]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setRemainingMs((prevMs) => {
        if (prevMs <= 10) { // Stop at the last 10ms
          clearInterval(timer);
          setIsActive(false);
          onTimeout(); // Trigger timeout when the timer ends
          return 0;
        }
        return prevMs - 10; // Decrement by 10ms
      });
    }, 10); // Update every 10ms

    return () => clearInterval(timer); // Cleanup on unmount or reset
  }, [isActive, onTimeout]);

  // Effect to notify the parent component of updates
  useEffect(() => {
    if (isActive) {
      onTimeUpdate(remainingMs); // Notify the parent about the remaining time
    }
  }, [remainingMs, isActive, onTimeUpdate]);

  return (
    <div
      className="timer-spritesheet"
      style={{
        backgroundPositionX: `-${Math.floor((duration * 1000 - remainingMs) / 1000) * 180}px`, // Update sprite frame every second
      }}
    />
  );
};

export default Timer;
