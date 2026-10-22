import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/product';
import './ProductListPage.css';

// 预设价格区间（min/max 为 null 表示不限）
const PRICE_RANGES = [
  { label: '全部价格', min: null, max: null },
  { label: '¥100 以下', min: 0, max: 100 },
  { label: '¥100 - 500', min: 100, max: 500 },
  { label: '¥500 - 1000', min: 500, max: 1000 },
  { label: '¥1000 以上', min: 1000, max: null },
];

// 解析 URL 中的价格参数，非法值视为不限
function parsePrice(value: string | null): number | null {
  if (value === null || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? num : null;
}

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const keyword = searchParams.get('keyword') ?? '';
  const category = searchParams.get('category') ?? '';
  const minPrice = parsePrice(searchParams.get('minPrice'));
  const maxPrice = parsePrice(searchParams.get('maxPrice'));
  const priceActive = minPrice !== null || maxPrice !== null;

  // 拉取全部商品
  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts()
      .then((list) => setProducts(list))
      .catch(() => setError('商品加载失败，请稍后重试'))
      .finally(() => setLoading(false));
  }, []);

  // 聚合所有分类（去重）
  const allCategories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return [...set];
  }, [products]);

  // 客户端筛选
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (minPrice !== null && p.price < minPrice) return false;
      if (maxPrice !== null && p.price > maxPrice) return false;
      if (keyword) {
        const k = keyword.toLowerCase();
        const haystack = `${p.name} ${p.intro} ${p.tags} ${p.brand}`.toLowerCase();
        if (!haystack.includes(k)) return false;
      }
      return true;
    });
  }, [products, category, keyword, minPrice, maxPrice]);

  // 更新搜索关键词（回车触发）
  const [inputKeyword, setInputKeyword] = useState(keyword);
  useEffect(() => setInputKeyword(keyword), [keyword]);

  const applyKeyword = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value.trim()) params.set('keyword', value.trim());
    else params.delete('keyword');
    setSearchParams(params);
  };

  const toggleCategory = (name: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === name) params.delete('category');
    else params.set('category', name);
    setSearchParams(params);
  };

  // 选择价格区间（再次点击同一区间则取消）
  const selectPriceRange = (min: number | null, max: number | null) => {
    const params = new URLSearchParams(searchParams);
    const same = minPrice === min && maxPrice === max;
    if (same) {
      params.delete('minPrice');
      params.delete('maxPrice');
    } else {
      if (min === null) params.delete('minPrice');
      else params.set('minPrice', String(min));
      if (max === null) params.delete('maxPrice');
      else params.set('maxPrice', String(max));
    }
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});

  // 结果区展示的价格文字
  const priceLabel = !priceActive
    ? ''
    : maxPrice === null
      ? `¥${minPrice} 以上`
      : minPrice === null
        ? `¥${maxPrice} 以下`
        : `¥${minPrice} - ${maxPrice}`;

  return (
    <main className="product-list-page">
      <div className="container">
        {/* 页面标题 + 搜索框 */}
        <div className="list-header">
          <h1 className="list-title">全部商品</h1>
          <form
            className="list-search"
            onSubmit={(e) => {
              e.preventDefault();
              applyKeyword(inputKeyword);
            }}
          >
            <input
              className="list-search-input"
              type="search"
              placeholder="搜索商品、品牌、标签…"
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
            />
            <button type="submit" className="list-search-btn">
              搜索
            </button>
          </form>
        </div>

        {/* 分类筛选 */}
        {allCategories.length > 0 && (
          <div className="category-filter">
            <button
              className={`chip ${!category ? 'chip-active' : ''}`}
              onClick={clearFilters}
            >
              全部
            </button>
            {allCategories.map((c) => (
              <button
                key={c}
                className={`chip ${category === c ? 'chip-active' : ''}`}
                onClick={() => toggleCategory(c)}
              >
                {c}
              </button>
            ))}
            {(keyword || category || priceActive) && (
              <button className="chip chip-clear" onClick={clearFilters}>
                清除筛选
              </button>
            )}
          </div>
        )}

        {/* 价格区间筛选 */}
        <div className="price-filter">
          <span className="filter-label">价格</span>
          {PRICE_RANGES.map((r) => {
            const active =
              r.min === null && r.max === null
                ? !priceActive
                : minPrice === r.min && maxPrice === r.max;
            return (
              <button
                key={r.label}
                className={`chip ${active ? 'chip-active' : ''}`}
                onClick={() => selectPriceRange(r.min, r.max)}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* 结果计数 */}
        {!loading && !error && (
          <p className="result-count">
            共 <strong>{filtered.length}</strong> 件商品
            {keyword && <span className="result-tag">关键词：{keyword}</span>}
            {category && <span className="result-tag">分类：{category}</span>}
            {priceActive && (
              <span className="result-tag">价格：{priceLabel}</span>
            )}
          </p>
        )}

        {/* 错误 */}
        {error && <div className="state state-error">{error}</div>}

        {/* 加载 */}
        {loading && (
          <div className="state state-loading">
            <div className="spinner" />
            <span>加载商品中…</span>
          </div>
        )}

        {/* 空状态 */}
        {!loading && !error && filtered.length === 0 && (
          <div className="state state-empty">
            <span className="empty-icon">🔍</span>
            <p>没有找到匹配的商品</p>
            <button className="chip chip-clear" onClick={clearFilters}>
              清除筛选条件
            </button>
          </div>
        )}

        {/* 商品网格 */}
        {!loading && !error && filtered.length > 0 && (
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
