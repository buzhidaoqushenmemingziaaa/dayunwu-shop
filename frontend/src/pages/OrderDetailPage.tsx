import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrder } from '../api/orders';
import { ApiError } from '../api/client';
import type { Order } from '../types/order';
import './OrderDetailPage.css';

const STATUS_LABEL: Record<string, string> = {
  PENDING: '待支付',
  PAID: '已支付',
  SHIPPED: '已发货',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('zh-CN', { hour12: false });
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const orderId = Number(id);
    if (!Number.isFinite(orderId)) {
      setError('订单号无效');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    getOrder(orderId)
      .then(setOrder)
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 404) {
          setError('订单不存在');
        } else {
          setError('订单加载失败，请稍后重试');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="order-page">
        <div className="container">
          <div className="order-state">
            <div className="spinner" />
            <span>加载订单中…</span>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="order-page">
        <div className="container">
          <div className="order-state order-state-error">
            <p>{error ?? '订单不存在'}</p>
            <Link to="/products" className="back-link">
              ← 返回商品列表
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const statusLabel = STATUS_LABEL[order.status] ?? order.status;
  const paid = order.status === 'PAID';

  return (
    <main className="order-page">
      <div className="container">
        {/* 结果提示 */}
        <section className="order-success">
          <div className="success-icon">{paid ? '✓' : '!'}</div>
          <div className="success-text">
            <h1 className="success-title">
              {paid ? '支付成功，下单完成' : '订单已创建'}
            </h1>
            <p className="success-subtitle">
              {paid
                ? '演示站点模拟支付，不会产生真实扣款，感谢您的体验。'
                : '订单已创建，请尽快完成支付。'}
            </p>
          </div>
        </section>

        {/* 订单信息 */}
        <section className="order-card">
          <header className="order-card-header">
            <h2 className="order-card-title">订单信息</h2>
            <span className={`order-status ${paid ? 'order-status-paid' : ''}`}>
              {statusLabel}
            </span>
          </header>

          <dl className="order-meta">
            <div className="order-meta-item">
              <dt>订单编号</dt>
              <dd className="order-number">{order.orderNumber}</dd>
            </div>
            <div className="order-meta-item">
              <dt>创建时间</dt>
              <dd>{formatDate(order.createdAt)}</dd>
            </div>
            <div className="order-meta-item">
              <dt>订单状态</dt>
              <dd>{statusLabel}</dd>
            </div>
            <div className="order-meta-item">
              <dt>订单总价</dt>
              <dd className="order-total-amount">
                ¥{order.totalAmount.toFixed(2)}
              </dd>
            </div>
          </dl>

          <div className="order-table-wrap">
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>商品信息</th>
                  <th>商品单价</th>
                  <th>数量</th>
                  <th>小计</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it) => (
                  <tr key={it.id}>
                    <td>
                      <Link
                        to={`/products/${it.productId}`}
                        className="order-item-name"
                      >
                        {it.productName}
                      </Link>
                    </td>
                    <td>¥{it.unitPrice.toFixed(2)}</td>
                    <td>× {it.quantity}</td>
                    <td className="order-item-subtotal">
                      ¥{it.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="order-foot-label">
                    订单总价
                  </td>
                  <td className="order-foot-amount">
                    ¥{order.totalAmount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <div className="order-actions">
          <Link to="/products" className="order-primary-btn">
            继续购物
          </Link>
          <Link to="/" className="order-secondary-btn">
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
}
