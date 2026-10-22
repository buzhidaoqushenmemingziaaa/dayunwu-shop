import { type FormEvent, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CartIcon, CloudLogo, SearchIcon } from './icons';
import './Navbar.css';

export default function Navbar() {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = keyword.trim();
    if (q) navigate(`/products?keyword=${encodeURIComponent(q)}`);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <CloudLogo />
          <span className="navbar-brand">大云屋</span>
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" end className="nav-link">
            首页
          </NavLink>
          <NavLink to="/products" className="nav-link">
            全部商品
          </NavLink>
        </nav>

        <form className="navbar-search" onSubmit={onSearch} role="search">
          <input
            type="search"
            placeholder="搜索商品…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            aria-label="搜索商品"
          />
          <button type="submit" className="nav-icon-btn" aria-label="搜索">
            <SearchIcon size={18} />
          </button>
        </form>

        <button type="button" className="nav-icon-btn navbar-cart" aria-label="购物车">
          <CartIcon />
          <span className="cart-badge" hidden>
            0
          </span>
        </button>
      </div>
    </header>
  );
}
