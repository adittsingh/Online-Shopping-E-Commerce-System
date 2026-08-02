import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/format';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="card h-100 shadow-sm product-card">
      <Link to={`/product/${product._id}`}>
        <div
          className="product-img"
          style={{ backgroundImage: `url(${product.image})` }}
        />
      </Link>
      <div className="card-body d-flex flex-column">
        <Link
          to={`/product/${product._id}`}
          className="text-decoration-none text-dark"
        >
          <h6 className="fw-bold text-truncate">{product.name}</h6>
        </Link>
        {product.category && (
          <small className="text-muted">{product.category.name}</small>
        )}
        <div className="d-flex align-items-center mt-1">
          <span className="text-warning me-1">
            {'★'.repeat(Math.round(product.rating))}
          </span>
          <small className="text-muted">({product.numReviews})</small>
        </div>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="fs-5 fw-bold text-primary">
            {formatINR(product.price)}
          </span>
        </div>
        {product.countInStock > 0 ? (
          <button
            className="btn btn-primary btn-sm w-100 mt-2"
            onClick={() => addToCart(product, 1)}
          >
            <FaShoppingCart className="me-1" /> Add to Cart
          </button>
        ) : (
          <button className="btn btn-outline-secondary btn-sm w-100 mt-2" disabled>
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
