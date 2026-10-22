import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/product';
import './ProductListPage.css';

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const keyword = searchParams.get('keyword') ?? '';
  const category = searchParams.get('category') ?? '';

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
      if (keyword) {
        const k = keyword.toLowerCase();
        const haystack = `${p.name} ${p.intro} ${p.tags} ${p.brand}`.toLowerCase();
        if (!haystack.includes(k)) return false;
      }
      return true;
    });
  }, [products, category, keyword]);

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

  const clearFilters = () => setSearchParams({});

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
            {(keyword || category) && (
              <button className="chip chip-clear" onClick={clearFilters}>
                清除筛选
              </button>
            )}
          </div>
        )}

        {/* 结果计数 */}
        {!loading && !error && (
          <p className="result-count">
            共 <strong>{filtered.length}</strong> 件商品
            {keyword && <span className="result-tag">关键词：{keyword}</span>}
            {category && <span className="result-tag">分类：{category}</span>}
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
