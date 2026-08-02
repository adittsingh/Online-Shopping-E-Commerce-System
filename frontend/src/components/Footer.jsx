import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-4 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="fw-bold d-flex align-items-center">
              <img
                src="/logo.png"
                alt="Stockedup"
                width="34"
                height="34"
                className="me-2 rounded"
                style={{ objectFit: 'contain' }}
              />{" "}
              Stockedup
            </h5>
            <p className="text-white-50 small">
              Your one-stop online shopping destination. Quality products at the
              best prices, delivered to your door.
            </p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-white-50 text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-white-50 text-decoration-none">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white-50 text-decoration-none">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact</h5>
            <ul className="list-unstyled small text-white-50">
              <li>
                <FaEnvelope className="me-2" /> support@stockedup.com
              </li>
              <li>
                <FaPhone className="me-2" /> +91 98765 43210
              </li>
              <li>
                <FaGithub className="me-2" /> Online-Shopping-E-Commerce-System
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center py-3 border-top border-secondary mt-4">
        <small className="text-white-50">
          &copy; {new Date().getFullYear()} Stockedup. All rights reserved.
        </small>
      </div>
    </footer>
  );
};

export default Footer;
