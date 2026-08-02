import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import api from '../api';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const PlaceOrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { shippingAddress, paymentMethod } = location.state || {};

  const itemsPrice = cartItems.reduce((acc, i) => acc + i.price * i.qty, 0);
  const shippingPrice = itemsPrice > 500 ? 0 : itemsPrice > 0 ? 50 : 0;
  const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrder = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: cartItems,
        shippingAddress,
        paymentMethod,
      });
      clearCart();
      navigate(`/order/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!shippingAddress || cartItems.length === 0) {
    return (
      <div className="container text-center py-5">
        <Message variant="warning">No order details found.</Message>
        <Link to="/cart" className="btn btn-primary mt-2">
          Go to Cart
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate('/checkout')}
      >
        <FaArrowLeft className="me-1" /> Back to Checkout
      </button>
      <h2 className="fw-bold mb-4">Review Your Order</h2>
      {error && <Message variant="danger">{error}</Message>}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-white fw-bold">Shipping Address</div>
            <div className="card-body">
              {shippingAddress.address}, {shippingAddress.city},{' '}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </div>
          </div>
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-white fw-bold">Payment Method</div>
            <div className="card-body">{paymentMethod}</div>
          </div>
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">Order Items</div>
            <div className="card-body">
              {cartItems.map((item) => (
                <div key={item.product} className="d-flex align-items-center mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                  <div className="ms-3 flex-grow-1">
                    <Link
                      to={`/product/${item.product}`}
                      className="fw-bold text-decoration-none text-dark"
                    >
                      {item.name}
                    </Link>
                    <div className="small text-muted">
                      ${item.price.toFixed(2)} x {item.qty}
                    </div>
                  </div>
                  <strong>${(item.price * item.qty).toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">Order Total</div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Items</span>
                <strong>${itemsPrice.toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <strong>
                  {shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}
                </strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax (5%)</span>
                <strong>${taxPrice.toFixed(2)}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                <span>Total</span>
                <span className="text-primary">${totalPrice.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={placeOrder}
                disabled={loading}
              >
                {loading ? <Loader /> : (
                  <>
                    <FaCheckCircle className="me-1" /> Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
