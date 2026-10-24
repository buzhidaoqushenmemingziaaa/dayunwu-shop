import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orders';
import { ApiError } from '../api/client';
import {
  useCartStore,
  selectTotalItems,
  selectTotalAmount,
} from '../store/cart-store';
import { toast } from '../store/toast-store';
import './CheckoutPage.css';

type Step = 'confirm' | 'pay';

const PAYMENT_METHODS = [
  { id: 'wechat', label: '微信支付', desc: '扫码模拟支付' },
  { id: 'alipay', label: '支付宝', desc: '账户余额模拟支付' },
  { id: 'card', label: '银行卡', desc: '储蓄卡模拟支付' },
];

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore(selectTotalItems);
  const totalAmount = useCartStore(selectTotalAmount);
  const clearCart = useCartStore((s) => s.clearCart);
  const setOpen = useCartStore((s) => s.setOpen);
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('confirm');
  const [payment, setPayment] = useState('wechat');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 空购物车
  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <div className="container">
          <div className="checkout-empty">
            <span className="checkout-empty-icon">🛒</span>
            <p>购物车是空的，先去挑选商品吧</p>
            <Link to="/products" className="checkout-primary-btn">
              去逛逛
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handlePay = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const order = await createOrder(
        items.map((it) => ({
          productId: it.product.id,
          quantity: it.quantity,
        })),
        true
      );
      clearCart();
      toast.success('支付成功，订单已创建');
      navigate(`/orders/${order.id}`, { replace: true });
    } catch (err) {
      let message: string;
      if (err instanceof ApiError) {
        if (err.message === 'insufficient stock') {
          message = '部分商品库存不足，请返回购物车调整数量';
        } else if (err.message === 'product not found') {
          message = '部分商品已下架，请返回购物车调整';
        } else {
          message = `下单失败：${err.message}`;
        }
      } else {
        message = '网络异常，请稍后重试';
      }
      setError(message);
      toast.error(message);
      setSubmitting(false);
    }
  };

  return (
    <main className="checkout-page">
      <div className="container">
        <nav className="breadcrumb checkout-breadcrumb">
          <Link to="/">首页</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/products">商品</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">结算</span>
        </nav>

        {/* 步骤条 */}
        <div className="checkout-steps">
          <div className={`checkout-step ${step === 'confirm' ? 'active' : 'done'}`}>
            <span className="step-index">1</span>
            <span className="step-label">确认订单</span>
          </div>
          <span className="step-line" />
          <div className={`checkout-step ${step === 'pay' ? 'active' : ''}`}>
            <span className="step-index">2</span>
            <span className="step-label">模拟支付</span>
          </div>
          <span className="step-line" />
          <div className="checkout-step">
            <span className="step-index">3</span>
            <span className="step-label">完成</span>
          </div>
        </div>

        <div className="checkout-layout">
          <section className="checkout-main">
            {step === 'confirm' && (
              <div className="checkout-panel">
                <div className="panel-header">
                  <h2 className="panel-title">商品清单</h2>
                  <button
                    className="panel-link"
                    onClick={() => setOpen(true)}
                  >
                    修改购物车
                  </button>
                </div>
                <div className="checkout-items">
                  {items.map((it) => (
                    <div key={it.product.id} className="checkout-item">
                      <img
                        className="checkout-item-image"
                        src={it.product.image}
                        alt={it.product.name}
                      />
                      <div className="checkout-item-info">
                        <Link
                          to={`/products/${it.product.id}`}
                          className="checkout-item-name"
                        >
                          {it.product.name}
                        </Link>
                        <span className="checkout-item-meta">
                          单价 ¥{it.product.price.toFixed(2)}
                        </span>
                      </div>
                      <span className="checkout-item-qty">× {it.quantity}</span>
                      <span className="checkout-item-subtotal">
                        ¥{(it.product.price * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 'pay' && (
              <div className="checkout-panel">
                <h2 className="panel-title">选择支付方式</h2>
                <div className="payment-methods">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      className={`payment-method ${payment === m.id ? 'selected' : ''}`}
                      onClick={() => setPayment(m.id)}
                      aria-pressed={payment === m.id}
                    >
                      <span className="payment-method-label">{m.label}</span>
                      <span className="payment-method-desc">{m.desc}</span>
                    </button>
                  ))}
                </div>
                <p className="payment-notice">
                  本项目为演示站点，使用模拟支付，不会产生真实扣款。
                </p>
              </div>
            )}
          </section>

          <aside className="checkout-summary">
            <h2 className="summary-title">订单汇总</h2>
            <div className="summary-row">
              <span>商品件数</span>
              <span>{totalItems} 件</span>
            </div>
            <div className="summary-row">
              <span>商品金额</span>
              <span>¥{totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>运费</span>
              <span>免运费</span>
            </div>
            <div className="summary-total">
              <span>应付总额</span>
              <strong>¥{totalAmount.toFixed(2)}</strong>
            </div>

            {error && <p className="checkout-error">{error}</p>}

            {step === 'confirm' ? (
              <button
                className="checkout-primary-btn checkout-submit"
                onClick={() => setStep('pay')}
              >
                提交订单
              </button>
            ) : (
              <div className="checkout-actions">
                <button
                  className="checkout-secondary-btn"
                  onClick={() => setStep('confirm')}
                  disabled={submitting}
                >
                  返回上一步
                </button>
                <button
                  className="checkout-primary-btn checkout-submit"
                  onClick={handlePay}
                  disabled={submitting}
                >
                  {submitting
                    ? '支付中…'
                    : `确认支付 ¥${totalAmount.toFixed(2)}`}
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
