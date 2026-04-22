import React from 'react';
import { paymentApi } from '../api/axiosClient';

function Payment({ orderId }) {
  const handlePayment = async (method) => {
    try {
      await paymentApi.post('/payments', { orderId: orderId, method: method });
      alert("Thanh toán thành công! Kiểm tra console log của Payment Service để xem thông báo.");
    } catch (err) { alert("Lỗi thanh toán"); }
  };

  return (
    <div>
      <h3>Thanh toán đơn hàng #{orderId}</h3>
      <button onClick={() => handlePayment('Banking')}>Chuyển khoản</button>
      <button onClick={() => handlePayment('COD')}>Tiền mặt</button>
    </div>
  );
}