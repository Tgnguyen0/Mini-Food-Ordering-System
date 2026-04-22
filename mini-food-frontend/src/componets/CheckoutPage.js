import React, { useState, useEffect } from 'react';
import { orderApi } from '../api/axiosClient';
import './CheckoutPage.css';

function CheckoutPage({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [payingId, setPayingId] = useState(null); // Track đơn đang thanh toán

  // 1. Lấy tất cả đơn hàng
  const fetchMyOrders = async () => {
    setFetchLoading(true);
    try {
      const res = await orderApi.get('');
      // Lọc theo customerName khớp với user đang đăng nhập
      const myOrders = res.data.filter(
        o => o.customerName === user?.username
      );
      setOrders(myOrders);
    } catch (err) {
      console.error("Lỗi lấy đơn hàng:", err);
      // Dữ liệu giả lập khi BE chưa chạy
      setOrders([
        {
          id: 'ORD001', totalPrice: 75000, status: 'PENDING',
          paymentMethod: null,
          items: [{ name: 'Phở' }, { name: 'Trà đá' }]
        },
        {
          id: 'ORD002', totalPrice: 30000, status: 'PAID',
          paymentMethod: 'COD',
          items: [{ name: 'Bánh mì' }]
        }
      ]);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => { fetchMyOrders(); }, [user]);

  // 2. Xử lý thanh toán
  const handlePayment = async (orderId, method) => {
    setPayingId(orderId);
    try {
      await orderApi.put(`/${orderId}`, {
        status: 'PAID',
        paymentMethod: method,
      });

      console.log(`✅ [PAYMENT] Đơn #${orderId} thanh toán qua ${method}`);
      alert(`✅ Thanh toán thành công!\nPhương thức: ${method === 'COD' ? 'Tiền mặt (COD)' : 'Chuyển khoản'}`);

      // Cập nhật state local luôn, không cần fetch lại
      setOrders(prev =>
        prev.map(o =>
          o.id === orderId
            ? { ...o, status: 'PAID', paymentMethod: method }
            : o
        )
      );
    } catch (err) {
      console.error("Lỗi thanh toán:", err);
      alert("❌ Thanh toán thất bại! Vui lòng thử lại.");
    } finally {
      setPayingId(null);
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'CREATED');
  const doneOrders = orders.filter(o => o.status !== 'PENDING' && o.status !== 'CREATED');

  const statusColor = {
    PAID: '#22c55e',
    CANCELLED: '#ef4444',
    CREATED: '#f59e0b',
    PENDING: '#f59e0b',
  };

  if (fetchLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="spinner" />
        <p style={{ color: '#888', marginTop: '1rem' }}>Đang tải đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h3>💳 Thanh toán đơn hàng</h3>

      {/* PENDING ORDERS */}
      {pendingOrders.length === 0 ? (
        <div className="no-order">
          <p>🎉 Bạn không có đơn hàng nào chờ thanh toán.</p>
        </div>
      ) : (
        <div className="order-list">
          {pendingOrders.map(order => (
            <div key={order.id} className="payment-card">
              <div className="payment-info">
                <h4>Đơn hàng: <span style={{ color: '#2563eb' }}>#{order.id}</span></h4>
                <p>
                  <span style={{ color: '#888', fontSize: '0.88rem' }}>Món: </span>
                  {order.items?.map(i => i.name || i.productName).join(', ')}
                </p>
                <strong className="total">
                  Tổng tiền: {Number(order.totalPrice).toLocaleString('vi-VN')}đ
                </strong>
              </div>

              <div className="payment-actions">
                <p>Chọn phương thức thanh toán:</p>
                <div className="btn-group">
                  <button
                    className="btn-cod"
                    onClick={() => handlePayment(order.id, 'COD')}
                    disabled={payingId === order.id}
                  >
                    {payingId === order.id ? '⏳ Đang xử lý...' : '💵 Tiền mặt (COD)'}
                  </button>
                  <button
                    className="btn-banking"
                    onClick={() => handlePayment(order.id, 'BANKING')}
                    disabled={payingId === order.id}
                  >
                    {payingId === order.id ? '⏳ Đang xử lý...' : '🏦 Chuyển khoản'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HISTORY */}
      <div className="history-section">
        <h4>Lịch sử đơn hàng</h4>
        {doneOrders.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: '0.88rem' }}>Chưa có đơn hàng nào hoàn thành.</p>
        ) : (
          doneOrders.map(o => (
            <div key={o.id} className="history-item">
              <div>
                <span>#{o.id} — {Number(o.totalPrice).toLocaleString('vi-VN')}đ</span>
                {o.paymentMethod && (
                  <span style={{ marginLeft: 8, fontSize: '0.78rem', color: '#888' }}>
                    ({o.paymentMethod === 'COD' ? 'Tiền mặt' : 'Chuyển khoản'})
                  </span>
                )}
              </div>
              <span
                className="status-badge"
                style={{ background: statusColor[o.status] || '#888' }}
              >
                {o.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CheckoutPage;