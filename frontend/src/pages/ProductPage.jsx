import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaCartPlus, FaStar, FaRegStar } from 'react-icons/fa';
import api from '../api';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/format';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAdd = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      setComment('');
      setReviewMsg('success');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      setReviewMsg(err.message);
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!product) return <Message variant="info">Product not found.</Message>;

  return (
    <div className="container my-4">
      <Link to="/" className="text-decoration-none mb-3 d-inline-block">
        &larr; Back to products
      </Link>
      <div className="row g-4">
        <div className="col-md-5">
          <div className="rounded-3 overflow-hidden shadow">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid w-100"
              style={{ maxHeight: 400, objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className="col-md-4">
          <h2 className="fw-bold">{product.name}</h2>
          {product.category && (
            <span className="badge bg-light text-dark border mb-2">
              {product.category.name}
            </span>
          )}
          <div className="d-flex align-items-center mb-2">
            <span className="text-warning">
              {'★'.repeat(Math.round(product.rating))}
              {'☆'.repeat(5 - Math.round(product.rating))}
            </span>
            <span className="ms-2 text-muted">
              {product.rating.toFixed(1)} ({product.numReviews} reviews)
            </span>
          </div>
          <p className="text-muted">{product.description}</p>
          <div className="d-flex align-items-center gap-2">
            <h3 className="text-primary fw-bold mb-0">
              {formatINR(product.price)}
            </h3>
            {product.discount > 0 && product.originalPrice > product.price && (
              <>
                <span className="fs-5 text-muted text-decoration-line-through">
                  {formatINR(product.originalPrice)}
                </span>
                <span className="offer-badge position-static">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>
          {product.discount > 0 && (
            <p className="text-success mb-2 mt-2 fw-semibold">
              Independence Day Deal: You save{' '}
              {formatINR(product.originalPrice - product.price)}
            </p>
          )}
          <p className={product.countInStock > 0 ? 'text-success' : 'text-danger'}>
            {product.countInStock > 0
              ? `In Stock (${product.countInStock} available)`
              : 'Out of Stock'}
          </p>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Price:</span>
                <strong>{formatINR(product.price)}</strong>
              </div>
              {product.discount > 0 && product.originalPrice > product.price && (
                <div className="d-flex justify-content-between mb-2">
                  <span>MRP:</span>
                  <strong className="text-muted text-decoration-line-through">
                    {formatINR(product.originalPrice)}
                  </strong>
                </div>
              )}
              <div className="d-flex justify-content-between mb-3">
                <span>Status:</span>
                <strong
                  className={
                    product.countInStock > 0 ? 'text-success' : 'text-danger'
                  }
                >
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </strong>
              </div>
              {product.countInStock > 0 && (
                <div className="mb-3">
                  <label className="form-label">Quantity</label>
                  <select
                    className="form-select"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                  >
                    {[...Array(Math.min(product.countInStock, 10)).keys()].map(
                      (n) => (
                        <option key={n + 1} value={n + 1}>
                          {n + 1}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}
              <button
                className="btn btn-primary w-100"
                disabled={product.countInStock === 0}
                onClick={handleAdd}
              >
                <FaCartPlus className="me-1" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">
              Customer Reviews
            </div>
            <div className="card-body">
              {product.reviews.length === 0 ? (
                <p className="text-muted">No reviews yet. Be the first!</p>
              ) : (
                product.reviews.map((r) => (
                  <div key={r._id} className="border-bottom pb-2 mb-2">
                    <div className="d-flex justify-content-between">
                      <strong>{r.name}</strong>
                      <span className="text-warning">
                        {'★'.repeat(Math.round(r.rating))}
                      </span>
                    </div>
                    <p className="mb-0 text-muted">{r.comment}</p>
                    <small className="text-muted">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">Write a Review</div>
            <div className="card-body">
              {!user ? (
                <Message variant="info">
                  Please <Link to="/login">login</Link> to write a review.
                </Message>
              ) : (
                <form onSubmit={submitReview}>
                  <div className="mb-3">
                    <label className="form-label">Rating</label>
                    <div className="fs-4">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          type="button"
                          key={n}
                          className="bg-transparent border-0 p-0 me-1"
                          onClick={() => setRating(n)}
                        >
                          {n <= rating ? (
                            <FaStar className="text-warning" />
                          ) : (
                            <FaRegStar className="text-warning" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Comment</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                  </div>
                  <button className="btn btn-primary w-100">Submit</button>
                  {reviewMsg === 'success' ? (
                    <div className="alert alert-success mt-2 mb-0 py-2">
                      Review added!
                    </div>
                  ) : reviewMsg ? (
                    <div className="alert alert-danger mt-2 mb-0 py-2">
                      {reviewMsg}
                    </div>
                  ) : null}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
