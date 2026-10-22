import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct } from '../api/products';
import { ApiError } from '../api/client';
import { useCartStore } from '../store/cart-store';
import type { Product } from '../types/product';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const toggleCart = useCartStore((s) => s.toggle);
  const qty = 1;

  useEffect(() => {
    if (!id) return;
    const productId = Number(id);
    if (!Number.isFinite(productId)) {
      setError('商品 ID 无效');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setProduct(null);

    getProduct(productId)
      .then(setProduct)
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 404) {
          setError('商品不存在');
        } else {
          setError('商品加载失败，请稍后重试');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  // 加购 → 加入购物车并自动打开侧拉栏
  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addItem(product, qty);
    toggleCart();
  };

  // 库存展示
  const renderStock = (stock: number) => {
    if (stock <= 0) return <span className="stock stock-out">暂时无货</span>;
    if (stock < 10)
      return (
        <span className="stock stock-low">
          库存紧张（仅剩 {stock} 件）
        </span>
      );
    return <span className="stock stock-ok">有货（库存 {stock} 件）</span>;
  };

  // Loading
  if (loading) {
    return (
      <main className="product-detail-page">
        <div className="container">
          <div className="detail-state">
            <div className="spinner" />
            <span>加载商品中…</span>
          </div>
        </div>
      </main>
    );
  }

  // Error
  if (error || !product) {
    return (
      <main className="product-detail-page">
        <div className="container">
          <div className="detail-state detail-state-error">
            <p>{error ?? '商品不存在'}</p>
            <Link to="/products" className="back-link">
              ← 返回商品列表
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const tags = product.tags.split(',').filter(Boolean);

  return (
    <main className="product-detail-page">
      <div className="container">
        {/* 面包屑 */}
        <nav className="breadcrumb">
          <Link to="/">首页</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/products">商品</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="detail-layout">
          {/* 左：图片 */}
          <div className="detail-image-wrap">
            <img
              className="detail-image"
              src={product.image}
              alt={product.name}
            />
          </div>

          {/* 右：信息 */}
          <div className="detail-info">
            <span className="detail-category">{product.category}</span>
            <h1 className="detail-name">{product.name}</h1>
            <p className="detail-brand">品牌：{product.brand}</p>

            <div className="detail-price-row">
              <span className="detail-price">¥{product.price.toFixed(2)}</span>
              {renderStock(product.stock)}
            </div>

            <p className="detail-intro">{product.intro}</p>

            {tags.length > 0 && (
              <div className="detail-tags">
                {tags.map((t) => (
                  <span key={t} className="detail-tag">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            <div className="detail-actions">
              <button
                className={`btn-add-cart ${product.stock <= 0 ? 'btn-disabled' : ''}`}
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
                title={product.stock <= 0 ? '库存不足' : '加入购物车'}
              >
                {product.stock <= 0 ? '暂时无货' : '加入购物车'}
              </button>
            </div>
          </div>
        </div>

        {/* 详细描述 */}
        <section className="detail-description">
          <h2 className="detail-desc-title">商品详情</h2>
          <p className="detail-desc-text">{product.description}</p>
        </section>
      </div>
    </main>
  );
}
