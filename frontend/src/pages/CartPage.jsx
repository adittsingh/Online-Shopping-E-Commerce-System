import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/format';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate(user ? '/checkout' : '/login');
  };

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 499 ? 0 : itemsPrice > 0 ? 49 : 0;
  const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <div className="container my-4">
      <h2 className="fw-bold mb-4">
        <FaArrowLeft
          className="me-2 text-primary cursor-pointer"
          onClick={() => navigate(-1)}
          role="button"
        />
        Shopping Cart
      </h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">Your cart is empty</h4>
          <Link to="/" className="btn btn-primary mt-2">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="card shadow-sm mb-3 cart-item-card"
              >
                <div className="card-body d-flex align-items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                  <div className="flex-grow-1">
                    <Link
                      to={`/product/${item.product}`}
                      className="fw-bold text-decoration-none text-dark"
                    >
                      {item.name}
                    </Link>
                    <div className="text-muted small mt-1">
                      {formatINR(item.price)} each
                    </div>
                    <div className="d-flex align-items-center mt-2">
                      <select
                        className="form-select form-select-sm"
                        style={{ width: 80 }}
                        value={item.qty}
                        onChange={(e) => updateQty(item.product, e.target.value)}
                        disabled={item.countInStock === 0}
                      >
                        {[...Array(Math.min(item.countInStock, 10)).keys()].map(
                          (n) => (
                            <option key={n + 1} value={n + 1}>
                              {n + 1}
                            </option>
                          )
                        )}
                      </select>
                      <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={() => removeFromCart(item.product)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="fw-bold fs-5 text-primary">
                    {formatINR(item.price * item.qty)}
                  </div>
                </div>
              </div>
            ))}
            <Link to="/" className="btn btn-outline-secondary mt-2">
              Continue Shopping
            </Link>
          </div>
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white fw-bold">
                Order Summary
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Items ({cartItems.reduce((a, i) => a + i.qty, 0)})</span>
                  <strong>{formatINR(itemsPrice)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <strong>
                    {shippingPrice === 0 ? 'Free' : formatINR(shippingPrice)}
                  </strong>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Tax (5%)</span>
                  <strong>{formatINR(taxPrice)}</strong>
                </div>
                <hr />
                <div className="d-flex justify-content-between fs-5 fw-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatINR(totalPrice)}
                  </span>
                </div>
                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
