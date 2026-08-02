import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaShoppingCart,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBoxOpen,
  FaUserCog,
  FaTachometerAlt,
  FaUserShield,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center">
          <img
            src="/logo.png"
            alt="Stockedup"
            width="36"
            height="36"
            className="me-2 rounded"
            style={{ objectFit: 'contain' }}
          />{" "}
          Stockedup
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">
                Contact
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link to="/cart" className="nav-link position-relative">
                <FaShoppingCart className="me-1" /> Cart
                {cartCount > 0 && (
                  <span className="badge bg-primary rounded-pill ms-1">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
            {user ? (
              <>
                {user.isAdmin && (
                  <li className="nav-item">
                    <Link to="/admin" className="nav-link">
                      <FaUserShield className="me-1 text-warning" /> Admin
                    </Link>
                  </li>
                )}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FaUserCog className="me-1" /> {user.name}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
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
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    <FaSignInAlt className="me-1" /> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    <FaUserPlus className="me-1" /> Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
