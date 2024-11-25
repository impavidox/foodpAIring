import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useInactivityTimer = (timeout = 60000, redirectPath = '/') => {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    // Function to reset the inactivity timer
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        navigate(redirectPath); // Navigate to the specified page after timeout
      }, timeout);
    };

    // Events to track user interactions for touch applications
    const events = ['touchstart', 'touchmove', 'mousedown'];

    // Attach listeners to reset the timer on interaction
    events.forEach(event => window.addEventListener(event, resetTimer));

    // Initialize the timer
    resetTimer();

    // Cleanup on component unmount
    return () => {
      clearTimeout(timer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [navigate, timeout, redirectPath]);
};

export default useInactivityTimer;
