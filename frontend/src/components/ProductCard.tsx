import { Link } from 'react-router-dom';
import type { Product } from '../types/product';
import './ProductCard.css';

export default function ProductCard({ product }: { product: Product }) {
  const tags = product.tags.split(',').filter(Boolean).slice(0, 2);

  return (
    <Link to={`/products/${product.id}`} className="product-card">
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
  );
}
