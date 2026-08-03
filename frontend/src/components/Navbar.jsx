import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaUser,
  FaBoxOpen,
  FaUserShield,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [term, setTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/search?keyword=${encodeURIComponent(q)}` : '/search');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="amz-top sticky-top">
        <div className="amz-inner container-fluid d-flex align-items-center gap-3 gap-lg-4">
          <Link to="/" className="amz-hover-box d-flex align-items-center text-decoration-none">
            <img
              src="/logo.png"
              alt="Stockedup"
              height="44"
              className="me-1 rounded"
              style={{ objectFit: 'contain' }}
            />
            <span className="amz-wordmark">stockedup</span>
          </Link>

          <div className="amz-hover-box d-none d-lg-block">
            <div className="amz-loc-label">Deliver to</div>
            <div className="amz-loc-value">
              <FaMapMarkerAlt className="me-1" /> India
            </div>
          </div>

          <form
            className="amz-search d-flex flex-grow-1 mx-lg-2"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              className="form-control amz-search-input"
              placeholder="Search Stockedup"
              aria-label="Search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <button type="submit" className="amz-search-btn" aria-label="Search">
              <FaSearch />
            </button>
          </form>

          {user ? (
            <div className="dropdown">
              <a
                href="#"
                className="amz-hover-box d-block text-decoration-none dropdown-toggle"
                id="accountDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="d-block amz-acc-label">
                  Hello, {user.name.split(' ')[0]}
                </span>
                <span className="d-block amz-acc-value">Account &amp; Lists</span>
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end shadow"
                aria-labelledby="accountDropdown"
              >
                <li>
                  <h6 className="dropdown-header">{user.name}</h6>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link to="/profile" className="dropdown-item">
                    <FaUser className="me-2" /> My Profile
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="dropdown-item">
                    <FaBoxOpen className="me-2" /> My Orders
                  </Link>
                </li>
                {user.isAdmin && (
                  <li>
                    <Link to="/admin" className="dropdown-item">
                      <FaUserShield className="me-2" /> Admin Panel
                    </Link>
                  </li>
                )}
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-2" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="amz-hover-box d-block text-decoration-none">
              <span className="d-block amz-acc-label">Hello, sign in</span>
              <span className="d-block amz-acc-value">Account &amp; Lists</span>
            </Link>
          )}

          <Link to="/orders" className="amz-hover-box d-none d-md-block text-decoration-none">
            <span className="d-block amz-acc-label">Returns</span>
            <span className="d-block amz-acc-value">&amp; Orders</span>
          </Link>

          <Link to="/cart" className="amz-cart text-decoration-none position-relative">
            <FaShoppingCart className="amz-cart-icon" />
            <span className="amz-cart-count">{cartCount}</span>
            <span className="amz-cart-label ms-1">Cart</span>
          </Link>
        </div>
      </nav>

      <nav className="amz-sub">
        <div className="container-fluid d-flex align-items-center overflow-auto">
          <Link to="/" className="amz-sublink">All</Link>
          <Link to="/offers" className="amz-sublink text-warning fw-bold">
            Independence Day Sale
          </Link>
          <Link to="/" className="amz-sublink">Best Sellers</Link>
          <Link to="/" className="amz-sublink">Today's Deals</Link>
          <Link to="/" className="amz-sublink">New Releases</Link>
          <Link to="/contact" className="amz-sublink">Contact</Link>
          {user?.isAdmin && (
            <Link to="/admin" className="amz-sublink">Admin Panel</Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
