import React, { useEffect, useRef, useState } from 'react';
import { FaSearch, FaArrowRight } from 'react-icons/fa';
import api from '../api';
import { formatINR } from '../utils/format';

const scoreMatch = (p, q) => {
  const name = (p.name || '').toLowerCase();
  const desc = (p.description || '').toLowerCase();
  const cat = (p.category && p.category.name ? p.category.name : '').toLowerCase();
  if (name.startsWith(q)) return 0;
  if (name.includes(q)) return 1;
  if (desc.includes(q)) return 2;
  if (cat.includes(q)) return 3;
  return 99;
};

const SearchSuggest = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search Stockedup',
  variant = 'navbar',
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef(null);

  useEffect(() => {
    const q = value.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      setActive(-1);
      return undefined;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(
          `/products?keyword=${encodeURIComponent(q)}&pageSize=20`
        );
        if (cancelled) return;
        const ranked = (data.products || [])
          .map((p) => ({ p, s: scoreMatch(p, q) }))
          .filter((x) => x.s < 99)
          .sort((a, b) => a.s - b.s || a.p.name.localeCompare(b.p.name))
          .slice(0, 8)
          .map((x) => x.p);
        setSuggestions(ranked);
        setOpen(true);
        setActive(-1);
      } catch (e) {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [value]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const goProduct = (p) => {
    setOpen(false);
    onChange('');
    onSearch(p.name, { direct: p._id });
  };

  const seeAll = () => {
    setOpen(false);
    onSearch(value);
  };

  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      goProduct(suggestions[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (open && active >= 0) {
      goProduct(suggestions[active]);
      return;
    }
    setOpen(false);
    onSearch(value);
  };

  const isNavbar = variant === 'navbar';

  return (
    <div
      className={
        isNavbar
          ? 'amz-search-wrap d-flex flex-grow-1 mx-lg-2'
          : 'amz-search-wrap flex-grow-1'
      }
      ref={wrapRef}
    >
      <form
        className={isNavbar ? 'amz-search d-flex flex-grow-1' : 'd-flex gap-2'}
        onSubmit={submit}
        role="search"
      >
        <input
          type="text"
          className={isNavbar ? 'form-control amz-search-input' : 'form-control'}
          placeholder={placeholder}
          aria-label="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => value.trim() && suggestions.length > 0 && setOpen(true)}
          autoComplete="off"
        />
        <button
          type="submit"
          className={isNavbar ? 'amz-search-btn' : 'btn btn-primary px-4'}
          aria-label="Search"
        >
          <FaSearch />
        </button>
      </form>

      {open && value.trim() && (
        <div className="amz-suggest">
          {loading && suggestions.length === 0 ? (
            <div className="amz-suggest-msg">Searching…</div>
          ) : suggestions.length === 0 ? (
            <div className="amz-suggest-msg">
              No matches for &quot;{value.trim()}&quot;
            </div>
          ) : (
            <>
              {suggestions.map((p, i) => (
                <div
                  key={p._id}
                  className={`amz-suggest-item ${i === active ? 'active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => goProduct(p)}
                >
                  <img className="amz-suggest-img" src={p.image} alt="" />
                  <div className="flex-grow-1">
                    <div className="amz-suggest-name">{p.name}</div>
                    <div className="amz-suggest-cat">
                      {p.category && p.category.name ? p.category.name : 'Products'}
                    </div>
                  </div>
                  <div className="amz-suggest-price">{formatINR(p.price)}</div>
                </div>
              ))}
              <div className="amz-suggest-footer" onClick={seeAll}>
                See all results for &quot;{value.trim()}&quot;
                <FaArrowRight className="ms-2" />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSuggest;
