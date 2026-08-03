import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { formatINR } from '../utils/format';

const PH =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#1b2530"/></svg>'
  );

const pickDiverse = (products) => {
  const grouped = {};
  products.forEach((p) => {
    const key = (p.category && p.category.name) || 'Other';
    (grouped[key] = grouped[key] || []).push(p);
  });
  const out = [];
  const keys = Object.keys(grouped);
  let guard = 0;
  while (out.length < 12 && keys.length && guard < 40) {
    guard += 1;
    let any = false;
    for (let i = 0; i < keys.length && out.length < 12; i += 1) {
      const arr = grouped[keys[i]];
      if (arr.length) {
        out.push(arr.shift());
        any = true;
      }
    }
    if (!any) break;
  }
  return out;
};

const DUST = Array.from({ length: 26 }, (_, i) => ({
  left: `${(i * 3.7 + 1.3) % 100}%`,
  size: 1.5 + ((i * 7) % 3),
  dur: 7 + ((i * 5) % 9),
  delay: -((i * 1.9) % 12),
  o: 0.25 + ((i * 11) % 40) / 100,
}));

const WalkingCategories = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get('/products?pageSize=60')
      .then(({ data }) => {
        if (!active) return;
        const list = pickDiverse(data.products || []).map((p) => ({
          id: p._id,
          name: p.name,
          cat: (p.category && p.category.name) || 'Products',
          image: p.image,
          price: p.price,
        }));
        setItems(list);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const loop = useMemo(
    () => [...items, ...items],
    [items]
  );

  if (loading || items.length === 0) return null;

  const renderCard = (item, kind, i) => (
    <Link
      key={`${kind}-${item.id}-${i}`}
      to={`/product/${item.id}`}
      className={`para-card para-card--${kind}`}
      style={{ '--fdelay': `${(i % 6) * 0.7}s` }}
    >
      <div className="para-card-media">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = PH;
          }}
        />
        <span className="para-card-sheen" />
        <div className="para-card-label">
          <span className="para-card-cat">{item.cat}</span>
          <span className="para-card-price">{formatINR(item.price)}</span>
        </div>
      </div>
      <div className="para-card-refl">
        <img src={item.image} alt="" loading="lazy" onError={(e) => { e.currentTarget.src = PH; }} />
      </div>
    </Link>
  );

  return (
    <section className="para-section">
      <div className="para-head">
        <span className="para-eyebrow">categories</span>
        <h2 className="para-title">Stockedup in Motion</h2>
      </div>
      <div className="para-stage">
        <div className="para-glow para-glow--orange" />
        <div className="para-glow para-glow--blue" />
        <div className="para-horizon" />
        <div className="para-grid" />
        {DUST.map((d, i) => (
          <span
            key={i}
            className="para-dust"
            style={{
              left: d.left,
              width: d.size,
              height: d.size,
              animationDuration: `${d.dur}s`,
              animationDelay: `${d.delay}s`,
              '--o': d.o,
            }}
          />
        ))}
        <div className="para-row para-row--far">
          {loop.map((item, i) => renderCard(item, 'far', i))}
        </div>
        <div className="para-row para-row--near">
          {loop.map((item, i) => renderCard(item, 'near', i))}
        </div>
      </div>
    </section>
  );
};

export default WalkingCategories;
