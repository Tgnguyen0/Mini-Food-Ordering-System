import React, { useState, useEffect } from 'react';
import { foodApi, orderApi } from '../api/axiosClient';
import './OrderPage.css';

function OrderPage({ user, setActiveTab }) {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1. Lấy danh sách món ăn từ Food Service
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await foodApi.get('');
        setFoods(res.data);
      } catch (err) {
        console.error("Không thể lấy thực đơn:", err);
        // Dữ liệu giả định để bạn có thể test giao diện ngay
        setFoods([
          { id: 101, name: 'Cơm Tấm Sườn Bì', price: 45000, category: 'Món chính' },
          { id: 102, name: 'Bún Chả Hà Nội', price: 50000, category: 'Món chính' },
          { id: 103, name: 'Nước Cam Ép', price: 20000, category: 'Đồ uống' },
        ]);
      }
    };
    fetchFoods();
  }, []);

  // 2. Thêm món vào giỏ hàng
  const addToCart = (food) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === food.id);
      if (existing) {
        return prev.map((i) =>
          i.id === food.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
  };

  // 3. Xóa món khỏi giỏ hàng
  const removeFromCart = (cartItemId) => {
    setCart(cart.filter(item => item.cartItemId !== cartItemId));
  };

  const handlePlaceOrder = async () => {

    // 1. Kiểm tra giỏ hàng trống
    if (cart.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }

    // 2. Build payload đúng cấu trúc Backend
    const orderPayload = {
      customerName: user?.username || "Khách lẻ",   // Tên khách (nếu có)
      items: cart.map((item) => ({
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: item.price * item.quantity,
      })),
      // totalPrice và status sẽ do Backend tính/set lại
    };

    try {
      // 3. Gọi API tạo đơn hàng
      const res = await orderApi.post("", orderPayload);
      const createdOrder = res.data;

      // 4. Log kết quả
      console.log("✅ Đơn hàng đã tạo:");
      console.log("  ID:", createdOrder.id);
      console.log("  Trạng thái:", createdOrder.status);
      console.log("  Tổng tiền:", createdOrder.totalPrice);
      console.log("  Số món:", createdOrder.items.length);

      // 5. Thông báo thành công
      alert(`✅ Đặt hàng thành công!\nMã đơn: #${createdOrder.id}\nTổng tiền: ${createdOrder.totalPrice.toLocaleString("vi-VN")}đ`);

      // 6. Reset state
      setCart([]);
      setIsCartOpen(false);
      setActiveTab("checkout");

    } catch (err) {
      // 7. Xử lý lỗi chi tiết
      if (err.response) {
        // Lỗi từ phía Backend (4xx, 5xx)
        console.error("❌ Lỗi Backend:", err.response.status, err.response.data);
        alert(`❌ Lỗi: ${err.response.data || "Không thể tạo đơn hàng."}`);
      } else {
        // Lỗi mạng / không kết nối được BE
        console.error("❌ Không kết nối được Backend:", err.message);
        alert("❌ Không thể kết nối với Backend Order Service!\nKiểm tra lại server đang chạy chưa.");
      }
    }
  };


  // ============================================================
  // Ví dụ cấu trúc cart item cần có:
  // {
  //   name: "Phở bò",
  //   price: 50000,
  //   quantity: 2
  // }
  //
  // Payload gửi lên BE sẽ có dạng:
  // {
  //   customerName: "Khách lẻ",
  //   items: [
  //     { productName: "Phở bò", quantity: 2, unitPrice: 50000, subtotal: 100000 },
  //     { productName: "Cơm tấm", quantity: 1, unitPrice: 40000, subtotal: 40000 }
  //   ]
  // }
  // ============================================================

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="order-page">
      <div className="order-header">
        <h2>🍔 Thực Đơn Đặt Món</h2>
        <button className="cart-badge-btn" onClick={() => setIsCartOpen(true)}>
          🛒 Giỏ hàng ({cart.length})
        </button>
      </div>

      {/* Grid danh sách món ăn */}
      <div className="food-grid">
        {foods.map(food => (
          <div key={food.id} className="food-card">
            <div className="food-thumb">🍲</div>
            <div className="food-info">
              <h4>{food.name}</h4>
              <span className="food-tag">{food.category}</span>
              <p className="food-price">{Number(food.price).toLocaleString()}đ</p>
              <button className="btn-add-to-cart" onClick={() => addToCart(food)}>
                Thêm món
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Giỏ hàng */}
      {isCartOpen && (
        <div className="cart-overlay">
          <div className="cart-modal">
            <div className="cart-modal-header">
              <h3>Giỏ hàng của bạn</h3>
              <button className="close-btn" onClick={() => setIsCartOpen(false)}>×</button>
            </div>

            <div className="cart-body">
              {cart.length === 0 ? (
                <p className="empty-msg">Giỏ hàng đang trống, chọn món ngay nhé!</p>
              ) : (
                cart.map((item, index) => (
                  <div key={item.id || index} className="cart-row">
                    <span>{item.name}</span>
                    <div className="cart-row-right">
                      <span>{Number(item.price).toLocaleString()}đ</span>
                      <button className="remove-btn" onClick={() => removeFromCart(item.cartItemId)}>Xóa</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer">
              <div className="total-box">
                <strong>Tổng cộng:</strong>
                <span className="total-amount">{totalPrice.toLocaleString()}đ</span>
              </div>
              <button 
                className="btn-checkout" 
                disabled={cart.length === 0}
                onClick={handlePlaceOrder}
              >
                Xác Nhận Đặt Món
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderPage;