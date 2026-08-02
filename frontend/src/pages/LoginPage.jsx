import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container auth-container">
      <div className="card shadow-sm auth-card">
        <div className="card-body p-4">
          <h2 className="fw-bold text-center mb-1">
            <FaSignInAlt className="text-primary me-2" /> Login
          </h2>
          <p className="text-center text-muted mb-4">
            Sign in to your ShopNow account
          </p>
          {error && <Message variant="danger">{error}</Message>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? <Loader /> : 'Login'}
            </button>
          </form>
          <p className="mt-3 mb-0 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary text-decoration-none">
              Register
            </Link>
          </p>
          <div className="alert alert-light border mt-3 mb-0 small">
            <strong>Demo admin:</strong> admin@example.com / admin123
            <br />
            <strong>Demo user:</strong> john@example.com / john123
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
