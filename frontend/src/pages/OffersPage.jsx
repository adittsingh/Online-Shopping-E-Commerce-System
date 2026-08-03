import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaShoppingCart, FaSearch, FaClock, FaArrowRight } from 'react-icons/fa';
import api from '../api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useCart } from '../context/CartContext';
import {
  VOUCHER_CODE,
  VOUCHER_MIN_ITEMS,
  VOUCHER_DISCOUNT,
  formatINR,
} from '../utils/format';

const renderStars = (rating) => {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full));
};

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    let active = true;
    const fetchOffers = async () => {
      try {
        const { data } = await api.get('/products/offers');
        if (active) {
          setOffers(data);
          setError('');
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchOffers();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setQuickView(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(VOUCHER_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const group50 = offers.filter((p) => p.discount === 50);
  const group60 = offers.filter((p) => p.discount >= 60);

  const renderOfferCard = (p) => {
    const savings = p.originalPrice > p.price ? p.originalPrice - p.price : 0;
    return (
      <div className="col-6 col-lg-3 col-xl-2 mb-4" key={p._id}>
        <div className="card h-100 shadow-sm product-card offer-card">
          <div
            className="product-img offer-img"
            style={{ backgroundImage: `url(${p.image})` }}
            onClick={() => setQuickView(p)}
            role="button"
            aria-label={`Quick view ${p.name}`}
          >
            {p.discount > 0 && <span className="offer-badge">-{p.discount}%</span>}
            {savings > 0 && <span className="offer-save-badge">Save {formatINR(savings)}</span>}
            <span className="quick-view-btn">
              <FaSearch className="me-1" /> Quick View
            </span>
          </div>
          <div className="card-body d-flex flex-column">
            <Link
              to={`/product/${p._id}`}
              className="text-decoration-none text-dark"
            >
              <h6 className="fw-bold offer-title">{p.name}</h6>
            </Link>
            {p.description && <p className="offer-desc text-muted small mb-2">{p.description}</p>}
            <div className="d-flex align-items-center gap-1 mb-2">
              <span className="text-warning offer-stars">{renderStars(p.rating)}</span>
              <small className="text-muted">({p.numReviews})</small>
              {p.category?.name && (
                <span className="badge bg-light text-dark border category-chip ms-auto">
                  {p.category.name}
                </span>
              )}
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <span className="fs-5 fw-bold text-primary">{formatINR(p.price)}</span>
              {savings > 0 && (
                <small className="text-muted text-decoration-line-through">
                  {formatINR(p.originalPrice)}
                </small>
              )}
            </div>
            <div className="mt-auto d-grid gap-2 pt-2">
              {p.countInStock > 0 ? (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => addToCart(p, 1)}
                >
                  <FaShoppingCart className="me-1" /> Add to Cart
                </button>
              ) : (
                <button className="btn btn-outline-secondary btn-sm" disabled>
                  Out of Stock
                </button>
              )}
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setQuickView(p)}
              >
                Quick View
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuickView = (p) => {
    const savings = p.originalPrice > p.price ? p.originalPrice - p.price : 0;
    return (
      <div
        className="modal fade show d-block offer-modal"
        tabIndex="-1"
        role="dialog"
        onClick={() => setQuickView(null)}
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">{p.name}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setQuickView(null)}
              />
            </div>
            <div className="modal-body pt-2">
              <div className="row g-4">
                <div className="col-md-5">
                  <div
                    className="product-img offer-modal-img rounded-3 border"
                    style={{ backgroundImage: `url(${p.image})` }}
                  >
                    {p.discount > 0 && <span className="offer-badge">-{p.discount}%</span>}
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                    {p.category?.name && (
                      <span className="badge bg-light text-dark border">{p.category.name}</span>
                    )}
                    <span className="text-warning">{renderStars(p.rating)}</span>
                    <small className="text-muted">{p.numReviews} ratings</small>
                  </div>
                  <div className="d-flex align-items-baseline gap-3 mb-1">
                    <span className="fs-3 fw-bold text-primary">{formatINR(p.price)}</span>
                    {savings > 0 && (
                      <span className="text-muted text-decoration-line-through fs-6">
                        {formatINR(p.originalPrice)}
                      </span>
                    )}
                  </div>
                  {savings > 0 && (
                    <div className="text-success fw-bold mb-2">
                      You save {formatINR(savings)} ({p.discount}% OFF)
                    </div>
                  )}
                  <p className="text-muted mb-3">{p.description}</p>
                  <div className="mb-3">
                    {p.countInStock > 0 ? (
                      <span className="text-success fw-bold">
                        In Stock — {p.countInStock} available
                      </span>
                    ) : (
                      <span className="text-danger fw-bold">Out of Stock</span>
                    )}
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {p.countInStock > 0 && (
                      <button
                        className="btn btn-primary px-4"
                        onClick={() => {
                          addToCart(p, 1);
                          setQuickView(null);
                        }}
                      >
                        <FaShoppingCart className="me-1" /> Add to Cart
                      </button>
                    )}
                    <Link
                      to={`/product/${p._id}`}
                      className="btn btn-outline-primary px-4"
                    >
                      Full Details <FaArrowRight className="ms-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <section className="offer-hero text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold mb-2">Independence Day Sale</h1>
          <p className="lead mb-3 fw-semibold">
            Azadi Ka Amrit Mahotsav — Up to <span className="text-danger">60% OFF</span>
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <span className="offer-stat">{offers.length || '100+'} Offers Live</span>
            <span className="offer-stat">Up to 60% OFF</span>
            <span className="offer-stat">{formatINR(VOUCHER_DISCOUNT)} Voucher</span>
          </div>
        </div>
      </section>

      <div className="container my-4">
        <div className="voucher-strip p-3 rounded-3 d-flex flex-wrap align-items-center gap-3">
          <FaTicketAlt size={30} className="text-success" />
          <div className="flex-grow-1">
            <div className="fw-bold">
              Spend {formatINR(VOUCHER_MIN_ITEMS)} or more and get{' '}
              {formatINR(VOUCHER_DISCOUNT)} OFF!
            </div>
            <div className="small text-muted">
              Apply voucher code at checkout
            </div>
          </div>
          <button className="btn btn-success" onClick={copyCode}>
            {copied ? 'Copied!' : `Copy Code ${VOUCHER_CODE}`}
          </button>
        </div>

        <div className="jump-nav d-flex flex-wrap gap-2 my-4">
          {group60.length > 0 && (
            <button className="btn btn-outline-primary btn-sm" onClick={() => scrollToId('mega-deals')}>
              <span className="text-danger fw-bold">60%</span> Mega Deals ({group60.length})
            </button>
          )}
          {group50.length > 0 && (
            <button className="btn btn-outline-primary btn-sm" onClick={() => scrollToId('great-deals')}>
              <span className="text-danger fw-bold">50%</span> Great Deals ({group50.length})
            </button>
          )}
          <button className="btn btn-outline-primary btn-sm" onClick={() => scrollToId('how-to-redeem')}>
            <FaTicketAlt className="me-1" /> How to Redeem
          </button>
        </div>

        {loading ? (
          <div className="mt-4">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : offers.length === 0 ? (
          <Message variant="info">No offers available right now.</Message>
        ) : (
          <>
            {group60.length > 0 && (
              <section id="mega-deals" className="mt-4">
                <h4 className="section-title mb-3">
                  <span className="text-danger">60% OFF</span> Mega Deals
                </h4>
                <div className="row">
                  {group60.map((p) => renderOfferCard(p))}
                </div>
              </section>
            )}
            {group50.length > 0 && (
              <section id="great-deals" className="mt-4">
                <h4 className="section-title mb-3">
                  <span className="text-danger">50% OFF</span> Great Deals
                </h4>
                <div className="row">
                  {group50.map((p) => renderOfferCard(p))}
                </div>
              </section>
            )}

            <section id="how-to-redeem" className="mt-5">
              <h4 className="section-title mb-3">
                <FaTicketAlt className="me-2 text-success" /> How to Redeem Your Voucher
              </h4>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="p-4 bg-white rounded-3 shadow-sm h-100">
                    <span className="redeem-step">1</span>
                    <h5 className="fw-bold mt-3">Add to Cart</h5>
                    <p className="text-muted mb-0">
                      Pick any items from the offers above (or browse all products).
                      Add them to your cart.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-4 bg-white rounded-3 shadow-sm h-100">
                    <span className="redeem-step">2</span>
                    <h5 className="fw-bold mt-3">Reach the Minimum</h5>
                    <p className="text-muted mb-0">
                      Ensure your order total is at least{' '}
                      <strong>{formatINR(VOUCHER_MIN_ITEMS)}</strong>.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-4 bg-white rounded-3 shadow-sm h-100">
                    <span className="redeem-step">3</span>
                    <h5 className="fw-bold mt-3">Apply the Code</h5>
                    <p className="text-muted mb-0">
                      At checkout, enter{' '}
                      <span className="voucher-code">{VOUCHER_CODE}</span> to get{' '}
                      <strong>{formatINR(VOUCHER_DISCOUNT)}</strong> off instantly.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="text-center mt-4">
              <Link to="/" className="btn btn-outline-primary">
                Browse All Products
              </Link>
            </div>
          </>
        )}
      </div>

      {quickView && renderQuickView(quickView)}
    </div>
  );
};

export default OffersPage;
