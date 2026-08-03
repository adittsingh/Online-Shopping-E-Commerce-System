import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaTruck,
  FaLock,
  FaHeadset,
  FaShoppingCart,
  FaArrowRight,
  FaSearch,
} from 'react-icons/fa';
import api from '../api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/format';

const LINE_RULES = [
  { label: 'Headphones & Earbuds', test: /headphone|earbud|neckband|vr/i },
  { label: 'Speakers', test: /speaker|soundbar/i },
  { label: 'Smartwatches & Fitness Bands', test: /smart watch|watch|smart band|fitness band|band/i },
  { label: 'Phones & Tablets', test: /smartphone|phone|tablet/i },
  { label: 'Laptops & Computers', test: /laptop|monitor/i },
  { label: 'Cameras & Dash Cams', test: /camera|webcam|dash cam|action camera|photo frame/i },
  { label: 'Chargers & Power Banks', test: /charger|power bank/i },
  { label: 'Keyboards, Mouse & Controllers', test: /keyboard|mouse|controller/i },
  { label: 'Smart Home & Security', test: /bulb|smart speaker|router|security|projector|doorbell|smart lock/i },
  { label: 'Storage & Gadgets', test: /ssd|storage/i },
  { label: 'Kurtis, Sarees & Dresses', test: /kurti|saree|anarkali|dress|kameez|lehenga|kurta set|kurta|kaftan/i },
  { label: 'T-Shirts & Shirts', test: /t-shirt|tshirt|polo|shirt/i },
  { label: 'Jeans, Pants & Leggings', test: /jeans|track pants|leggings|joggers|shorts|palazzo|chinos/i },
  { label: 'Shoes & Slippers', test: /shoes|sneaker|slipper|running shoes/i },
  { label: 'Jackets & Hoodies', test: /jacket|hoodie|denim/i },
  { label: 'Bags, Wallets & Backpacks', test: /backpack|bag|wallet|handbag/i },
  { label: 'Sunglasses & Accessories', test: /sunglass|glasses|hat|scarf|cap/i },
  { label: 'Innerwear & Sleepwear', test: /boxer|brief|pajama|innerwear|underwear/i },
  { label: 'Shampoo, Face & Skincare', test: /shampoo|face wash|serum|sunscreen|cream|cleanser|cleansing|mask|lotion|roller|scrub|argan|retinol|under eye|aloe|toner/i },
  { label: 'Makeup & Fragrances', test: /lipstick|eyeshadow|makeup|perfume|parfum|body mist|brush set|nail polish|lip balm/i },
  { label: 'Hair Care & Grooming', test: /hair dryer|straightener|trimmer|beard|nail|manicure|grooming|hair oil/i },
  { label: 'Kitchen Appliances', test: /microwave|toaster|kettle|rice cooker|air fryer|induction|mixer|blender|chimney|coffee maker|food processor|sandwich maker|popcorn|coffee grinder|dispenser/i },
  { label: 'Cookware & Dining', test: /cookware|tiffin|dinner set|dinner plate|plates|knife|casserole|jars|thermos/i },
  { label: 'Home Appliances & Lighting', test: /vacuum|heater|ceiling fan|lamp|purifier/i },
  { label: 'Storage & Home Decor', test: /storage containers|vase|wall clock|curtain|mats/i },
  { label: 'Cricket, Football & Sports', test: /cricket|football|soccer/i },
  { label: 'Basketball', test: /basketball/i },
  { label: 'Badminton & Tennis', test: /badminton|tennis/i },
  { label: 'Gym & Fitness', test: /treadmill|exercise cycle|kettlebell|dumbbell|push up|resistance|gripper|gym gloves|yoga|running|boxing|punching|bench|fitness/i },
  { label: 'Cycles & Mobility', test: /cycle|cycling|bike|scooter|mtb/i },
  { label: 'Swimming & Outdoors', test: /swimming|goggles|bottle|fishing|rod/i },
  { label: 'Toys & Games', test: /toy|blocks|teddy|chess|puzzle|train|car|cube|doll|drone|dino|gun|figure/i },
];

const MIN_LINE_SIZE = 6;

const CATEGORY_IMAGES = {
  Electronics:
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600',
  Fashion:
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600',
  'Home & Kitchen':
    'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600',
  Sports:
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600',
  Beauty:
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
  'Toys & Games':
    'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600',
};

const renderStars = (rating) => {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full));
};

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lineModal, setLineModal] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
    api.get('/products/featured').then(({ data }) => setFeatured(data)).catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    const fetchMarketplace = async () => {
      try {
        const { data } = await api.get('/products?pageSize=200');
        if (active) {
          setProducts(data.products);
          setError('');
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchMarketplace();
    return () => {
      active = false;
    };
  }, []);

  const lines = useMemo(() => {
    const assignment = new Map();
    const ruleProducts = new Map();
    LINE_RULES.forEach((rule) => ruleProducts.set(rule.label, []));
    products.forEach((p) => {
      let assigned = false;
      for (const rule of LINE_RULES) {
        if (rule.test.test(p.name)) {
          ruleProducts.get(rule.label).push(p);
          assignment.set(p._id, rule.label);
          assigned = true;
          break;
        }
      }
      if (!assigned) assignment.set(p._id, null);
    });

    const fullLines = [];
    const small = [];
    ruleProducts.forEach((items, label) => {
      if (items.length >= MIN_LINE_SIZE) {
        fullLines.push({ label, products: items });
      } else if (items.length > 0) {
        small.push(...items);
      }
    });
    const leftover = products.filter((p) => assignment.get(p._id) === null);
    small.push(...leftover);

    const byCat = {};
    small.forEach((p) => {
      const cat = p.category && p.category.name ? p.category.name : 'More';
      (byCat[cat] = byCat[cat] || []).push(p);
    });
    Object.entries(byCat).forEach(([cat, items]) => {
      if (items.length > 0) {
        fullLines.push({ label: `More from ${cat}`, products: items });
      }
    });
    return fullLines;
  }, [products]);

  const openLine = (product) => {
    const line = lines.find((l) => l.products.some((p) => p._id === product._id));
    if (line) setLineModal(line);
  };

  const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderTileCol = (p) => {
    const savings = p.originalPrice > p.price ? p.originalPrice - p.price : 0;
    return (
      <div className="col-6 col-md-4 col-lg-3 col-xl-2 mb-3" key={p._id}>
        <div className="market-tile h-100">
          <div
            className="mt-img"
            style={{ backgroundImage: `url(${p.image})` }}
            onClick={() => openLine(p)}
            role="button"
            aria-label={`Browse ${p.name}`}
          >
            {p.discount > 0 && <span className="offer-badge">-{p.discount}%</span>}
            <span className="mt-expand">
              <FaArrowRight /> View all
            </span>
          </div>
          <div className="mt-body">
            <Link to={`/product/${p._id}`} className="mt-name text-decoration-none">
              {p.name}
            </Link>
            <div className="mt-rating">
              <span className="text-warning">{renderStars(p.rating)}</span>
              <small className="text-muted">({p.numReviews})</small>
            </div>
            <div className="mt-price">
              {formatINR(p.price)}
              {savings > 0 && (
                <small className="text-muted text-decoration-line-through ms-2">
                  {formatINR(p.originalPrice)}
                </small>
              )}
            </div>
            <button
              className="btn btn-primary btn-sm mt-2 w-100"
              onClick={() => addToCart(p, 1)}
            >
              <FaShoppingCart className="me-1" /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderShelf = (line) => (
    <section className="mt-4" key={line.label}>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h4 className="section-title mb-0">{line.label}</h4>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setLineModal(line)}
        >
          View all ({line.products.length}) <FaArrowRight className="ms-1" />
        </button>
      </div>
      <div className="row g-3">
        {line.products.map((p) => renderTileCol(p))}
      </div>
    </section>
  );

  return (
    <div>
      <section className="hero-section text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">
            Welcome to <span style={{ color: '#febd69' }}>Stockedup</span>
          </h1>
          <p className="lead">
            Discover amazing products at unbeatable prices. Shop the latest
            electronics, fashion, home essentials and more.
          </p>
          <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
            <button className="btn btn-primary px-4" onClick={() => scrollToId('shop')}>
              Shop the Marketplace
            </button>
            <Link to="/offers" className="btn btn-outline-light px-4">
              Independence Day Sale
            </Link>
          </div>
        </div>
      </section>

      <div className="container my-4">
        <Link to="/offers" className="text-decoration-none d-block">
          <div className="voucher-strip p-3 rounded-3 d-flex flex-wrap align-items-center gap-3 shadow-sm">
            <div className="flex-grow-1">
              <div className="fw-bold text-dark fs-5">
                Independence Day Sale — Up to 60% OFF on 100+ products
              </div>
              <div className="small text-muted">
                Use code <span className="voucher-code">INDEPENDENCE25</span> at
                checkout for ₹10,000 OFF on orders above ₹25,000
              </div>
            </div>
            <span className="btn btn-primary px-4">Shop Offers</span>
          </div>
        </Link>
      </div>

      {loading ? (
        <div className="container my-4">
          <Loader />
        </div>
      ) : error ? (
        <div className="container my-4">
          <Message variant="danger">{error}</Message>
        </div>
      ) : (
        <div id="shop" className="container mb-4">
          <section className="mt-3">
            <h4 className="section-title mb-3">Shop by Category</h4>
            <div className="row g-3">
              {categories.map((c) => (
                <div className="col-6 col-md-4 col-lg text-center" key={c._id}>
                  <button
                    className="cat-tile w-100 text-decoration-none text-dark border-0 bg-transparent p-0"
                    onClick={() => navigate(`/search?category=${c._id}`)}
                  >
                    <div
                      className="cat-img rounded-3"
                      style={{ backgroundImage: `url(${CATEGORY_IMAGES[c.name] || c.image})` }}
                    />
                    <div className="fw-bold mt-2">{c.name}</div>
                    <small className="text-muted">Shop now</small>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {featured.length > 0 && (
            <section className="mt-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h4 className="section-title mb-0">
                  <span style={{ color: '#febd69' }}>Featured</span> Products
                </h4>
              </div>
              <div className="row g-3">
                {featured.map((p) => renderTileCol(p))}
              </div>
            </section>
          )}

          {lines.map((line) => renderShelf(line))}
        </div>
      )}

      <section className="container my-4">
        <div className="bg-white p-4 rounded-3 shadow-sm text-center">
          <h4 className="section-title mb-2">Looking for something specific?</h4>
          <p className="text-muted">
            Search across {products.length}+ products to see every matching item
            on its own page.
          </p>
          <div className="d-flex justify-content-center flex-wrap gap-2">
            <Link to="/search" className="btn btn-primary px-4">
              <FaSearch className="me-1" /> Search All Products
            </Link>
            <button className="btn btn-outline-primary px-4" onClick={() => scrollToId('shop')}>
              Back to Top
            </button>
          </div>
        </div>
      </section>

      <section className="container my-4">
        <h4 className="section-title mb-3">
          <span style={{ color: '#febd69' }}>Why Shop</span> With Us
        </h4>
        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="p-4 bg-white rounded-3 shadow-sm h-100">
              <FaTruck size={40} style={{ color: '#febd69' }} className="mb-3" />
              <h5 className="fw-bold">Free Shipping</h5>
              <p className="text-muted mb-0">On all orders above ₹499</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 bg-white rounded-3 shadow-sm h-100">
              <FaLock size={40} style={{ color: '#febd69' }} className="mb-3" />
              <h5 className="fw-bold">Secure Payments</h5>
              <p className="text-muted mb-0">100% safe &amp; secure checkout</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 bg-white rounded-3 shadow-sm h-100">
              <FaHeadset size={40} style={{ color: '#febd69' }} className="mb-3" />
              <h5 className="fw-bold">24/7 Support</h5>
              <p className="text-muted mb-0">
                Need help? <Link to="/contact">Contact us</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {lineModal && (
        <div
          className="modal fade show d-block line-modal"
          tabIndex="-1"
          role="dialog"
          onClick={() => setLineModal(null)}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {lineModal.label}
                  <span className="text-muted fs-6 ms-2">
                    {lineModal.products.length} products
                  </span>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setLineModal(null)}
                />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {lineModal.products.map((p) => renderTileCol(p))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
