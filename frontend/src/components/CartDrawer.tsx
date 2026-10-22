import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, selectTotalItems, selectTotalAmount } from '../store/cart-store';
import './CartDrawer.css';

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const open = useCartStore((s) => s.open);
  const toggle = useCartStore((s) => s.toggle);
  const setOpen = useCartStore((s) => s.setOpen);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const totalItems = useCartStore(selectTotalItems);
  const totalAmount = useCartStore(selectTotalAmount);

  const navigate = useNavigate();

  // ESC 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    // 禁止 body 滚动
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, setOpen]);

  const goCheckout = () => {
    setOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* 遮罩 */}
      <div
        className={`cart-overlay ${open ? 'cart-overlay-open' : ''}`}
        onClick={toggle}
        aria-hidden="true"
      />

      {/* 侧拉栏 */}
      <aside
        className={`cart-drawer ${open ? 'cart-drawer-open' : ''}`}
        role="dialog"
        aria-label="购物车"
      >
        <header className="cart-header">
          <h2 className="cart-title">购物车</h2>
          <button className="cart-close" onClick={toggle} aria-label="关闭">
            ✕
          </button>
        </header>

        {/* 空状态 */}
        {items.length === 0 && (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <p>购物车还是空的</p>
            <button
              className="cart-empty-btn"
              onClick={() => {
                setOpen(false);
                navigate('/products');
              }}
            >
              去逛逛
            </button>
          </div>
        )}

        {/* 商品列表 */}
        {items.length > 0 && (
          <div className="cart-items">
            {items.map((it) => (
              <div key={it.product.id} className="cart-item">
                <Link
                  to={`/products/${it.product.id}`}
                  className="cart-item-image-wrap"
                  onClick={() => setOpen(false)}
                >
                  <img
                    className="cart-item-image"
                    src={it.product.image}
                    alt={it.product.name}
                  />
                </Link>
                <div className="cart-item-info">
                  <Link
                    to={`/products/${it.product.id}`}
                    className="cart-item-name"
                    onClick={() => setOpen(false)}
                  >
                    {it.product.name}
                  </Link>
                  <span className="cart-item-price">
                    ¥{it.product.price.toFixed(2)}
                  </span>
                  <div className="cart-item-qty">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(it.product.id, it.quantity - 1)
                      }
                      aria-label="减少数量"
                    >
                      −
                    </button>
                    <span className="qty-value">{it.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(it.product.id, it.quantity + 1)
                      }
                      aria-label="增加数量"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeItem(it.product.id)}
                  aria-label="删除商品"
                  title="删除"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 底部：合计 + 操作 */}
        {items.length > 0 && (
          <footer className="cart-footer">
            <div className="cart-total">
              <span>
                共 <strong>{totalItems}</strong> 件
              </span>
              <span className="cart-total-amount">
                ¥{totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="cart-footer-actions">
              <button className="cart-clear" onClick={clearCart}>
                清空
              </button>
              <button className="cart-checkout" onClick={goCheckout}>
                去结算
              </button>
            </div>
          </footer>
        )}
      </aside>
    </>
  );
}
