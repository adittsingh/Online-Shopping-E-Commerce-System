import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch, FaTruck, FaLock, FaHeadset } from 'react-icons/fa';
import api from '../api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
    api.get('/products/featured').then(({ data }) => setFeatured(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const kw = searchParams.get('keyword');
    if (kw !== null && kw !== keyword) {
      setKeyword(kw);
      setPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (selectedCategory) params.set('category', selectedCategory);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sort) params.set('sort', sort);
        params.set('pageNumber', page);
        const { data } = await api.get(`/products?${params.toString()}`);
        if (!active) return;
        setProducts(data.products);
        setPages(data.pages);
        setPage(data.page);
        setError('');
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      active = false;
    };
  }, [keyword, selectedCategory, minPrice, maxPrice, sort, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams(keyword ? { keyword } : {});
  };

  const handleCategory = (id) => {
    setSelectedCategory(id);
    setPage(1);
  };

  const handleSort = (value) => {
    setSort(value);
    setPage(1);
  };

  const resetFilters = () => {
    setKeyword('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div>
      <section className="hero-section text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">
            Welcome to <span style={{ color: '#febd69' }}>Stockedup</span>
          </h1>
          <p className="lead">
            Discover amazing products at unbeatable prices. Shop the latest
            electronics, fashion, home essentials and more.
          </p>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container my-4">
          <h4 className="section-title mb-3">
            <span style={{ color: '#febd69' }}>Featured</span> Products
          </h4>
          <div className="row">
            {featured.map((p) => (
              <div className="col-6 col-md-3 mb-4" key={p._id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container mt-4">
        <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
          <form
            onSubmit={handleSearch}
            className="d-flex flex-column flex-md-row gap-2 mb-3"
          >
            <div className="input-group flex-grow-1">
              <span className="input-group-text bg-white">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary px-4">
              Search
            </button>
          </form>
          <div className="row g-2">
            <div className="col-md-3">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => handleCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Min $"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Max $"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={sort}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="">Sort By</option>
                <option value="price:asc">Price: Low to High</option>
                <option value="price:desc">Price: High to Low</option>
                <option value="rating:desc">Top Rated</option>
                <option value="createdAt:desc">Newest</option>
              </select>
            </div>
            <div className="col-md-2 d-grid">
              <button
                className="btn btn-outline-secondary"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : products.length === 0 ? (
          <Message variant="info">No products found.</Message>
        ) : (
          <>
            <div className="row">
              {products.map((p) => (
                <div className="col-6 col-md-3 mb-4" key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
            {pages > 1 && (
              <nav className="d-flex justify-content-center mt-3">
                <ul className="pagination">
                  <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage(page - 1)}
                    >
                      Prev
                    </button>
                  </li>
                  {[...Array(pages).keys()].map((n) => (
                    <li
                      key={n}
                      className={`page-item ${page === n + 1 ? 'active' : ''}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setPage(n + 1)}
                      >
                        {n + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${page === pages ? 'disabled' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </section>

      <section className="container my-4">
        <h4 className="section-title mb-3">
          <span style={{ color: '#febd69' }}>Why Shop</span> With Us
        </h4>
        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="p-4 bg-white rounded-3 shadow-sm h-100">
              <FaTruck size={40} style={{ color: '#febd69' }} className="mb-3" />
              <h5 className="fw-bold">Free Shipping</h5>
              <p className="text-muted mb-0">On all orders above $500</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 bg-white rounded-3 shadow-sm h-100">
              <FaLock size={40} style={{ color: '#febd69' }} className="mb-3" />
              <h5 className="fw-bold">Secure Payments</h5>
              <p className="text-muted mb-0">100% safe &amp; secure checkout</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 bg-white rounded-3 shadow-sm h-100">
              <FaHeadset size={40} style={{ color: '#febd69' }} className="mb-3" />
              <h5 className="fw-bold">24/7 Support</h5>
              <p className="text-muted mb-0">
                Need help? <Link to="/contact">Contact us</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
