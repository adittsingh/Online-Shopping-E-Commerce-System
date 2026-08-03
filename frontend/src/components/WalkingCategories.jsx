import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const CATEGORY_STYLE = {
  Electronics: { emoji: '🤖', color: '#00d4ff' },
  Fashion: { emoji: '👗', color: '#ff7ab8' },
  'Home & Kitchen': { emoji: '🍳', color: '#ffb347' },
  Sports: { emoji: '🏀', color: '#7cff6b' },
  Beauty: { emoji: '💄', color: '#ff6b9d' },
  'Toys & Games': { emoji: '🧸', color: '#c4a5ff' },
};

const FALLBACK_STYLE = { emoji: '🛒', color: '#febd69' };

const WalkingCategories = ({ categories: categoriesProp }) => {
  const [categories, setCategories] = useState(categoriesProp || []);

  useEffect(() => {
    if (categoriesProp) {
      setCategories(categoriesProp);
      return undefined;
    }
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
    return undefined;
  }, [categoriesProp]);

  if (categories.length === 0) return null;

  const walkers = categories.map((c, i) => {
    const style = CATEGORY_STYLE[c.name] || FALLBACK_STYLE;
    const reverse = i % 2 === 1;
    return {
      ...c,
      ...style,
      reverse,
      dur: 13 + (i % 4) * 3,
      delay: -(i * 3.8),
      bottom: 10 + (i % 3) * 24,
      size: 34 + (i % 3) * 9,
    };
  });

  return (
    <section className="cat-walk-section">
      <div className="cat-walk-head">
        <span className="cat-walk-title">Categories on the Move</span>
        <span className="cat-walk-hint">Tap a character to shop</span>
      </div>
      <div className="cat-walk" role="presentation">
        <div className="cat-walk-ground" />
        {walkers.map((w) => (
          <Link
            key={w._id}
            to={`/search?category=${w._id}`}
            className={`cat-walker ${w.reverse ? 'cat-walker--rev' : ''}`}
            style={{
              '--dur': `${w.dur}s`,
              '--delay': `${w.delay}s`,
              '--bottom': `${w.bottom}px`,
              '--size': `${w.size}px`,
              '--color': w.color,
            }}
            aria-label={`Shop ${w.name}`}
          >
            <span className="cat-walker-inner">
              <span className="cat-walker-emoji">{w.emoji}</span>
              <span className="cat-walker-shadow" />
            </span>
            <span className="cat-walker-label">{w.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default WalkingCategories;
