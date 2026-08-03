import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaTimes, FaArrowLeft } from 'react-icons/fa';
import api from '../api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import SearchSuggest from '../components/SearchSuggest';

const PAGE_SIZE = 12;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [term, setTerm] = useState(keyword);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setTerm(keyword);
  }, [keyword]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (category) params.set('category', category);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sort) params.set('sort', sort);
        params.set('pageNumber', page);
        params.set('pageSize', PAGE_SIZE);
        const { data } = await api.get(`/products?${params.toString()}`);
        if (!active) return;
        setProducts(data.products);
        setPages(data.pages);
        setCurrentPage(data.page);
        setTotal(data.count);
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
  }, [keyword, category, minPrice, maxPrice, sort, page]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });
    next.delete('page');
    setSearchParams(next, { replace: true });
  };

  const handleSearch = (q, opts) => {
    if (opts && opts.direct) {
      navigate(`/product/${opts.direct}`);
      return;
    }
    updateParams({ keyword: q.trim() });
  };

  const handleClear = () => {
    setTerm('');
    setSearchParams({}, { replace: true });
  };

  const resetFilters = () => {
    setSearchParams(keyword ? { keyword } : {}, { replace: true });
  };

  const heading = keyword
    ? `Results for "${keyword}"`
    : category
      ? categories.find((c) => c._id === category)?.name || 'Category'
      : 'All Products';

  const goToPage = (n) => updateParams({ page: n });

  return (
    <div>
      <section className="search-banner text-white text-center py-4">
        <div className="container">
          <h1 className="h3 fw-bold mb-1">
            <span style={{ color: '#febd69' }}>{heading}</span>
          </h1>
          {keyword && (
            <p className="mb-0 small">
              {total} product{total === 1 ? '' : 's'} found — showing only
              matching products
            </p>
          )}
        </div>
      </section>

      <div className="container my-4">
        <div className="bg-white p-3 p-md-4 rounded-3 shadow-sm">
          <div className="d-flex flex-column flex-md-row gap-2 mb-3">
            <SearchSuggest
              value={term}
              onChange={setTerm}
              onSearch={handleSearch}
              placeholder="Search products (e.g. shirt, kurta, shoes)..."
              variant="page"
            />
            <Link to="/" className="btn btn-outline-secondary px-4 flex-shrink-0">
              <FaArrowLeft className="me-1" /> Home
            </Link>
          </div>
          <div className="row g-2">
            <div className="col-md-3">
              <select
                className="form-select"
                value={category}
                onChange={(e) => updateParams({ category: e.target.value })}
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
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => updateParams({ minPrice: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => updateParams({ maxPrice: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
              >
                <option value="">Sort By</option>
                <option value="price:asc">Price: Low to High</option>
                <option value="price:desc">Price: High to Low</option>
                <option value="rating:desc">Top Rated</option>
                <option value="createdAt:desc">Newest</option>
              </select>
            </div>
            <div className="col-md-2 d-grid">
              <button className="btn btn-outline-secondary" onClick={resetFilters}>
                <FaTimes className="me-1" /> Clear
              </button>
            </div>
          </div>
        </div>

        {keyword && (
          <button className="btn btn-link btn-sm text-decoration-none mt-3" onClick={handleClear}>
            <FaTimes className="me-1" /> Clear search "{keyword}"
          </button>
        )}

        {loading ? (
          <div className="mt-4">
            <Loader />
          </div>
        ) : error ? (
          <div className="mt-4">
            <Message variant="danger">{error}</Message>
          </div>
        ) : products.length === 0 ? (
          <div className="mt-4">
            <Message variant="info">
              No products found{keyword ? ` for "${keyword}"` : ''}. Try a
              different keyword or clear the filters.
            </Message>
          </div>
        ) : (
          <div className="row g-3 mt-1">
            {products.map((p) => (
              <div className="col-6 col-md-4 col-lg-3 mb-2" key={p._id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        {pages > 1 && (
          <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                  Prev
                </button>
              </li>
              {[...Array(pages).keys()].map((n) => (
                <li
                  key={n}
                  className={`page-item ${currentPage === n + 1 ? 'active' : ''}`}
                >
                  <button className="page-link" onClick={() => goToPage(n + 1)}>
                    {n + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === pages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
