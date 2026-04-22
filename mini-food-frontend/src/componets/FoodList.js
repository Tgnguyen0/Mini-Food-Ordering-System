import React, { useEffect, useState } from 'react';
import { foodApi, orderApi } from '../api/axiosClient';

function FoodList() {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    foodApi.get('/foods').then(res => setFoods(res.data));
  }, []);

  const addToCart = (food) => setCart([...cart, food]);

  const createOrder = async () => {
    const orderData = {
      userId: 1, // Fix cứng hoặc lấy từ login
      items: cart.map(item => item.id),
      totalPrice: cart.reduce((sum, item) => sum + item.price, 0)
    };
    try {
      const res = await orderApi.post('/orders', orderData);
      alert("Tạo đơn hàng thành công! ID: " + res.data.id);
      setCart([]);
    } catch (err) { alert("Lỗi tạo đơn"); }
  };

  return (
    <div>
      <h2>Thực đơn</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        {foods.map(f => (
          <div key={f.id} style={{ border: '1px solid black', padding: '10px' }}>
            <p>{f.name} - {f.price}đ</p>
            <button onClick={() => addToCart(f)}>Thêm vào giỏ</button>
          </div>
        ))}
      </div>
      <h3>Giỏ hàng ({cart.length} món)</h3>
      <button onClick={createOrder} disabled={cart.length === 0}>Đặt hàng ngay</button>
    </div>
  );
}
export default FoodList;