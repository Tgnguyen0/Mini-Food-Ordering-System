import React, { useState } from 'react';
import { userApi } from '../api/axiosClient';
import './Auth.css';

function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' }); // Đã bỏ fullName để khớp BE
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Khớp với LoginRequest(String username, String password)
        const res = await userApi.post('/login', {
          username: formData.username,
          password: formData.password
        });

        // Backend trả về AuthResponse(String token, String username, Role role)
        const { token, username, role } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ username, role }));
        alert(`Chào mừng ${username} (${role}) quay trở lại!`);
        setToken({ username, role });

      } else {
        // Khớp với RegisterRequest(String username, String password)
        await userApi.post('/register', {
          username: formData.username,
          password: formData.password
        });

        alert("Đăng ký thành công! Hãy đăng nhập nhé.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      const msg = err.response?.data?.message 
              || err.response?.data?.error   // ✅ Thêm dòng này — khớp với BE
              || "Thao tác thất bại!";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Đã loại bỏ field Họ và tên nếu BE không lưu trữ */}
          
          <div className="input-group">
            <label>Tên đăng nhập</label>
            <input 
              name="username" 
              type="text" 
              placeholder="username123" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng Nhập' : 'Đăng Ký')}
          </button>
        </form>

        <div className="auth-footer">
          <button className="btn-toggle" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;