import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const itemsPrice = cartItems.reduce(
    (acc, i) => acc + i.price * i.qty,
    0
  );
  const shippingPrice = itemsPrice > 500 ? 0 : itemsPrice > 0 ? 50 : 0;
  const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/place-order', {
      state: { shippingAddress: { address, city, postalCode, country }, paymentMethod },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="container text-center py-5">
        <h4 className="text-muted">Your cart is empty</h4>
        <Link to="/" className="btn btn-primary mt-2">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate('/cart')}
      >
        <FaArrowLeft className="me-1" /> Back to Cart
      </button>
      <h2 className="fw-bold mb-4">Checkout</h2>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-white fw-bold">Shipping Address</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <hr className="my-4" />
                <h5 className="fw-bold mb-3">Payment Method</h5>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="cod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="cod">
                    Cash on Delivery (COD)
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="card"
                    value="Card on Delivery"
                    checked={paymentMethod === 'Card on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="card">
                    Card on Delivery
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="upi"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="upi">
                    UPI
                  </label>
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-4">
                  Continue to Review Order
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white fw-bold">Order Summary</div>
            <div className="card-body">
              {cartItems.map((item) => (
                <div key={item.product} className="d-flex justify-content-between mb-2 small">
                  <span className="text-truncate me-2">
                    {item.name} x {item.qty}
                  </span>
                  <strong>${(item.price * item.qty).toFixed(2)}</strong>
                </div>
              ))}
              <hr />
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
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span className="text-primary">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
