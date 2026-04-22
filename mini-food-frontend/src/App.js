import React, { useEffect, useState } from 'react';
import Auth from './componets/Auth';
import FoodManagement from './componets/FoodManagement';
import OrderPage from './componets/OrderPage';
import './App.css';
import CheckoutPage from './componets/CheckoutPage';
import { checkAllConnections } from './utils/connectionCheck';

function App() {
  useEffect(() => {
    checkAllConnections();
  }, []);

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');
  const [isDemo, setIsDemo] = useState(false);

  const enterDemoMode = (role) => {
    setUser({ username: 'Guest', role: role });
    setIsDemo(true);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  return (
    <div className="App">
      {!user ? (
        <div className="login-preview-container">
          <Auth setToken={handleLoginSuccess} />
          
          {/* Nút bấm giả lập nằm dưới Form Login */}
          <div className="demo-controls">
            <p>--- Chế độ xem trước (Dev Only) ---</p>
            <button onClick={() => enterDemoMode('USER')}>Xem giao diện User</button>
            <button onClick={() => enterDemoMode('ADMIN')}>Xem giao diện Admin</button>
          </div>
        </div>
      ) : (
        <div className="dashboard">
          {/* Header & Nav */}
          <header className="app-header">
            <div className="logo">🍕 Mini Food App</div>
            <nav className="nav-links">
              <button 
                className={activeTab === 'menu' ? 'active' : ''} 
                onClick={() => setActiveTab('menu')}
              >
                Trang chủ
              </button>

              {/* Chỉ hiển thị Quản lý nếu là ADMIN */}
              {user.role === 'ADMIN' && (
                <button 
                  className={activeTab === 'management' ? 'active' : ''} 
                  onClick={() => setActiveTab('management')}
                >
                  Quản lý món
                </button>
              )}

              <button 
                className={activeTab === 'checkout' ? 'active' : ''} 
                onClick={() => setActiveTab('checkout')}
              >
                💳 Thanh toán
              </button>
              
              <button className="btn-logout" onClick={() => setUser(null)}>Đăng xuất</button>
            </nav>
          </header>

          <main className="content">
            <div className="user-info">
              Chào, <strong>{user.username}</strong> ({user.role})
            </div>

            {/* Hiển thị Component tương ứng */}
            {activeTab === 'menu' ? (
              <OrderPage user={user} setActiveTab={setActiveTab} />
            ) : activeTab === 'checkout' ? (
              <CheckoutPage user={user} />
            ) : (
              <FoodManagement isAdmin={true} />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;