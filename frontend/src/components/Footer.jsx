import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <button className="amz-backtotop" onClick={scrollToTop}>
        Back to top
      </button>
      <footer className="amz-footer pt-5">
        <div className="container">
          <div className="row g-4 pb-5">
            <div className="col-6 col-md-3">
              <h6>Get to Know Us</h6>
              <Link to="/">About Us</Link>
              <Link to="/">Careers</Link>
              <Link to="/contact">Contact Us</Link>
              <Link to="/">Press Releases</Link>
            </div>
            <div className="col-6 col-md-3">
              <h6>Make Money with Us</h6>
              <Link to="/">Sell on Stockedup</Link>
              <Link to="/">Become a Seller</Link>
              <Link to="/">Advertise Your Products</Link>
              <Link to="/">Become an Affiliate</Link>
            </div>
            <div className="col-6 col-md-3">
              <h6>Let Us Help You</h6>
              <Link to="/cart">Your Cart</Link>
              <Link to="/orders">Your Orders</Link>
              <Link to="/profile">Your Account</Link>
              <Link to="/contact">Help Center</Link>
            </div>
            <div className="col-6 col-md-3">
              <h6>Follow Us</h6>
              <Link to="/">
                <FaFacebookF className="me-2" /> Facebook
              </Link>
              <Link to="/">
                <FaTwitter className="me-2" /> Twitter
              </Link>
              <Link to="/">
                <FaInstagram className="me-2" /> Instagram
              </Link>
              <Link to="/">
                <FaYoutube className="me-2" /> YouTube
              </Link>
            </div>
          </div>
        </div>
        <div className="amz-footer-bottom">
          <div className="container text-center py-3">
            <div className="d-flex justify-content-center align-items-center mb-2">
              <img
                src="/logo.png"
                alt="Stockedup"
                width="28"
                height="28"
                className="me-2 rounded"
                style={{ objectFit: 'contain' }}
              />
              <span className="fw-bold" style={{ fontSize: 14 }}>
                stockedup
              </span>
            </div>
            <div>
              &copy; {new Date().getFullYear()} Stockedup. All rights reserved.
              <span className="mx-2">|</span>
              <Link to="/" className="text-decoration-none text-white-50">
                Conditions of Use
              </Link>
              <span className="mx-2">|</span>
              <Link to="/" className="text-decoration-none text-white-50">
                Privacy Notice
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
