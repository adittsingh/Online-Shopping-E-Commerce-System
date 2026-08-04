import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { formatINR } from '../utils/format';

const PH =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#1b2530"/></svg>'
  );

const FALLBACK_PRODUCTS = [
  { id: 'f1', name: 'Wireless Bluetooth Headphones', cat: 'Electronics', price: 4149, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600' },
  { id: 'f2', name: 'Smartphone 5G 128GB', cat: 'Electronics', price: 33999, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600' },
  { id: 'f3', name: 'Laptop 15.6 inch - 16GB RAM', cat: 'Electronics', price: 74999, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600' },
  { id: 'f4', name: 'Smart Watch Series', cat: 'Electronics', price: 10999, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
  { id: 'f5', name: 'Men Casual Cotton T-Shirt', cat: 'Fashion', price: 1699, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600' },
  { id: 'f6', name: 'Sneakers Running Shoes', cat: 'Fashion', price: 5999, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' },
  { id: 'f7', name: 'Denim Jacket', cat: 'Fashion', price: 2499, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Denim_jacket_%2815355762104%29.jpg/600px-Denim_jacket_%2815355762104%29.jpg' },
  { id: 'f8', name: 'Non-Stick Cookware Set', cat: 'Home & Kitchen', price: 2999, image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600' },
  { id: 'f9', name: 'Coffee Maker Machine', cat: 'Home & Kitchen', price: 5999, image: 'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=600' },
  { id: 'f10', name: 'Yoga Mat Premium', cat: 'Sports', price: 1499, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600' },
  { id: 'f11', name: 'Dumbbell Set 20kg', cat: 'Sports', price: 1999, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600' },
  { id: 'f12', name: 'Skincare Vitamin C Serum', cat: 'Beauty', price: 699, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600' },
];

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
  const [items, setItems] = useState(FALLBACK_PRODUCTS);

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
        if (list.length) setItems(list);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const loop = useMemo(() => [...items, ...items], [items]);

  if (items.length === 0) return null;

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
        <div className="car-viewport">
          <div className="car-row">
            {loop.map((item, i) => (
              <Link
                key={`${item.id}-${i}`}
                to={`/product/${item.id}`}
                className="car-card"
                style={{ '--fdelay': `${(i % 6) * 0.6}s` }}
              >
                <div className="car-card-media">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = PH;
                    }}
                  />
                  <span className="car-sheen" />
                </div>
                <div className="car-card-body">
                  <div className="car-card-cat">{item.cat}</div>
                  <div className="car-card-name">{item.name}</div>
                  <div className="car-card-price">{formatINR(item.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WalkingCategories;
