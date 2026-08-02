import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTicketAlt } from 'react-icons/fa';
import api from '../api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { VOUCHER_CODE, VOUCHER_MIN_ITEMS, VOUCHER_DISCOUNT, formatINR } from '../utils/format';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

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

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(VOUCHER_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const group50 = offers.filter((p) => p.discount === 50);
  const group60 = offers.filter((p) => p.discount >= 60);

  return (
    <div>
      <section className="offer-hero text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold mb-2">Independence Day Sale</h1>
          <p className="lead mb-1 fw-semibold">
            Azadi Ka Amrit Mahotsav — Up to <span className="text-danger">60% OFF</span>
          </p>
          <p className="mb-0 text-dark">
            {offers.length || '100+'} Independence Day offers live now
          </p>
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
              <section className="mt-4">
                <h4 className="section-title mb-3">
                  <span className="text-danger">60% OFF</span> Mega Deals
                </h4>
                <div className="row">
                  {group60.map((p) => (
                    <div className="col-6 col-md-3 mb-4" key={p._id}>
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </section>
            )}
            {group50.length > 0 && (
              <section className="mt-4">
                <h4 className="section-title mb-3">
                  <span className="text-danger">50% OFF</span> Great Deals
                </h4>
                <div className="row">
                  {group50.map((p) => (
                    <div className="col-6 col-md-3 mb-4" key={p._id}>
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </section>
            )}
            <div className="text-center mt-3">
              <Link to="/" className="btn btn-outline-primary">
                Browse All Products
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OffersPage;
