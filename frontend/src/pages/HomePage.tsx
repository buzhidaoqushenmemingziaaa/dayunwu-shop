import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/product';
import './HomePage.css';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError('商品加载失败，请稍后重试'));
  }, []);

  // 分类入口：从商品数据聚合出分类与数量
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return [...map.entries()].map(([name, count]) => ({ name, count }));
  }, [products]);

  return (
    <main>
      {/* 推荐区 Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <h1>
              大云屋
              <br />
              数码好物一站购齐
            </h1>
            <p>耳机 · 键盘 · 鼠标 · 显示器 · 精选配件</p>
            <Link to="/products" className="hero-cta">
              立即逛逛
            </Link>
          </div>
          <img
            className="hero-image"
            src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=e-commerce%20hero%20banner%2C%20modern%20desk%20setup%20with%20wireless%20headphones%2C%20mechanical%20keyboard%20and%20mouse%2C%20warm%20orange%20accent%20lighting%2C%20clean%20minimal%20product%20photography%2C%20soft%20shadows&image_size=landscape_16_9"
            alt="大云屋精选数码好物"
          />
        </div>
      </section>

      {/* 分类入口 */}
      <section className="container section">
        <h2 className="section-title">商品分类</h2>
        {error && <p className="section-error">{error}</p>}
        <div className="category-grid">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={`/products?category=${encodeURIComponent(c.name)}`}
              className="category-card"
            >
              <span className="category-name">{c.name}</span>
              <span className="category-count">{c.count} 件</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 推荐商品列表 */}
      <section className="container section">
        <h2 className="section-title">为你推荐</h2>
        <div className="product-grid">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}
