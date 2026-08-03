import React, { useEffect, useState } from 'react';
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

const EXTRA_CHARACTERS = [
  { name: 'Headphones', emoji: '🎧', color: '#7ec8ff' },
  { name: 'Watch', emoji: '⌚', color: '#ffd166' },
  { name: 'Sneakers', emoji: '👟', color: '#b3ff8a' },
  { name: 'Smartphone', emoji: '📱', color: '#90e0ef' },
  { name: 'Camera', emoji: '📷', color: '#ffb3b3' },
  { name: 'Game Controller', emoji: '🎮', color: '#d9b3ff' },
  { name: 'Skincare', emoji: '🧴', color: '#ffb3d9' },
  { name: 'Shopping', emoji: '🛍️', color: '#f9c74f' },
];

const WalkingCategories = ({ categories: categoriesProp }) => {
  const [categories, setCategories] = useState(categoriesProp || []);
  const [walking, setWalking] = useState(() => new Set());

  useEffect(() => {
    if (categoriesProp) {
      setCategories(categoriesProp);
      return undefined;
    }
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
    return undefined;
  }, [categoriesProp]);

  const toggle = (id) => {
    setWalking((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (categories.length === 0) return null;

  const chars = [
    ...categories.map((c) => ({
      id: c._id,
      name: c.name,
      ...(CATEGORY_STYLE[c.name] || FALLBACK_STYLE),
    })),
    ...EXTRA_CHARACTERS.map((e, i) => ({
      id: `extra-${i}`,
      name: e.name,
      emoji: e.emoji,
      color: e.color,
    })),
  ].map((c, i) => ({
    ...c,
    reverse: i % 2 === 1,
    dur: 13 + (i % 4) * 3,
    delay: -(i * 3.8),
    bottom: 12 + (i % 4) * 26,
    size: 46 + (i % 3) * 10,
  }));

  return (
    <section className="cat-walk-section">
      <div className="cat-walk-head">
        <span className="cat-walk-title">categories</span>
      </div>
      <div className="cat-walk" role="presentation">
        <div className="cat-walk-ground" />
        {chars.map((w) => {
          const isWalking = walking.has(w.id);
          return (
            <button
              key={w.id}
              type="button"
              className={`cat-walker ${w.reverse ? 'cat-walker--rev' : ''} ${
                isWalking ? 'is-walking' : ''
              }`}
              style={{
                '--dur': `${w.dur}s`,
                '--delay': `${w.delay}s`,
                '--bottom': `${w.bottom}px`,
                '--size': `${w.size}px`,
                '--color': w.color,
              }}
              onClick={() => toggle(w.id)}
              aria-pressed={isWalking}
              title={isWalking ? 'Tap to stop' : 'Tap to walk'}
            >
              <span className="cat-walker-inner">
                <span className="cat-walker-emoji">{w.emoji}</span>
                <span className="cat-walker-shadow" />
              </span>
              <span className="cat-walker-label">{w.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default WalkingCategories;
