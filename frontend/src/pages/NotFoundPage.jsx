import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="container text-center py-5">
    <h1 className="display-1 fw-bold text-primary">404</h1>
    <h3 className="fw-bold">Page Not Found</h3>
    <p className="text-muted">The page you are looking for does not exist.</p>
    <Link to="/" className="btn btn-primary">
      Go Home
    </Link>
  </div>
);

export default NotFoundPage;
