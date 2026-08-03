import React, { useEffect, useRef, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const SPLASH_WORD = 'STOCKEDUP';

const SplashScreen = ({ onFinish }) => {
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const exitTimer = setTimeout(() => setExiting(true), 1500);
    const finishTimer = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onFinish();
      }
    }, 2150);
    return () => {
      document.body.style.overflow = '';
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash ${exiting ? 'splash-exit' : ''}`} aria-hidden="true">
      <div className="splash-inner">
        <div className="splash-icon">
          <FaShoppingCart />
        </div>
        <h1 className="splash-word">
          {SPLASH_WORD.split('').map((ch, i) => (
            <span
              key={i}
              className="splash-letter"
              style={{ animationDelay: `${0.25 + i * 0.06}s` }}
            >
              {ch}
            </span>
          ))}
        </h1>
        <p className="splash-tag">Welcome to your one-stop marketplace</p>
        <div className="splash-bar">
          <div className="splash-bar-fill" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
