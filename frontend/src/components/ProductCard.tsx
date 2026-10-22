import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cart-store';
import type { Product } from '../types/product';
import './ProductCard.css';

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleCart = useCartStore((s) => s.toggle);
  const tags = product.tags.split(',').filter(Boolean).slice(0, 2);

  const onQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addItem(product, 1);
    toggleCart();
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <img className="product-image" src={product.image} alt={product.name} loading="lazy" />
        <div className="product-body">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-intro">{product.intro}</p>
          <div className="product-footer">
            <span className="product-price">¥{product.price.toFixed(2)}</span>
            {tags.map((t) => (
              <span key={t} className="product-tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </Link>
      <button
        className={`product-quick-add ${product.stock <= 0 ? 'btn-disabled' : ''}`}
        onClick={onQuickAdd}
        disabled={product.stock <= 0}
        title={product.stock <= 0 ? '暂时无货' : '加入购物车'}
        aria-label={`加入购物车：${product.name}`}
      >
        +
      </button>
    </div>
  );
}
