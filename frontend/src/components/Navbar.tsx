import { type FormEvent, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CartIcon, CloudLogo, SearchIcon, MenuIcon, CloseIcon } from './icons';
import { useCartStore, selectTotalItems } from '../store/cart-store';
import './Navbar.css';

export default function Navbar() {
  const [keyword, setKeyword] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toggleCart = useCartStore((s) => s.toggle);
  const totalItems = useCartStore(selectTotalItems);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = keyword.trim();
    if (q) navigate(`/products?keyword=${encodeURIComponent(q)}`);
    setMenuOpen(false);
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

        <button
          type="button"
          className="nav-icon-btn navbar-cart"
          aria-label={`购物车，共 ${totalItems} 件`}
          onClick={toggleCart}
        >
          <CartIcon />
          {totalItems > 0 && (
            <span className="cart-badge">{totalItems > 99 ? '99+' : totalItems}</span>
          )}
        </button>

        <button
          type="button"
          className="nav-icon-btn navbar-hamburger"
          aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {menuOpen && (
        <nav className="mobile-menu" role="menu" aria-label="移动端导航">
          <NavLink to="/" end role="menuitem" onClick={() => setMenuOpen(false)}>
            首页
          </NavLink>
          <NavLink to="/products" role="menuitem" onClick={() => setMenuOpen(false)}>
            全部商品
          </NavLink>
          <form className="mobile-search" onSubmit={onSearch} role="search">
            <input
              type="search"
              placeholder="搜索商品…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              aria-label="搜索商品"
            />
            <button type="submit" aria-label="搜索">
              <SearchIcon size={16} />
            </button>
          </form>
        </nav>
      )}
    </header>
  );
}
