import React, { useState, useEffect } from 'react';
import { foodApi } from '../api/axiosClient';
import './FoodManagement.css';

function FoodManagement({ isAdmin }) {
  const [foods, setFoods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', category: '', image: '' });

  // Load danh sách món ăn
  const fetchFoods = async () => {
    try {
      const res = await foodApi.get('/foods');
      setFoods(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách món:", err);
    }
  };

  useEffect(() => { fetchFoods(); }, []);

  // Xử lý Xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa món này?")) {
      try {
        await foodApi.delete(`/foods/${id}`);
        fetchFoods();
      } catch (err) { alert("Xóa thất bại!"); }
    }
  };

  // Xử lý Thêm/Sửa
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFood) {
        await foodApi.put(`/foods/${editingFood.id}`, formData);
      } else {
        await foodApi.post('/foods', formData);
      }
      setIsModalOpen(false);
      setEditingFood(null);
      setFormData({ name: '', price: '', category: '', image: '' });
      fetchFoods();
    } catch (err) { alert("Lưu thất bại!"); }
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setFormData(food);
    setIsModalOpen(true);
  };

  return (
    <div className="food-container">
      <div className="header-section">
        <h2>{isAdmin ? "Quản Lý Thực Đơn" : "Danh Sách Món Ăn"}</h2>
        {isAdmin && (
          <button className="btn-add" onClick={() => { setEditingFood(null); setIsModalOpen(true); }}>
            + Thêm Món Mới
          </button>
        )}
      </div>

      {/* --- GIAO DIỆN ADMIN (Dạng Bảng) --- */}
      {isAdmin ? (
        <table className="food-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên món</th>
              <th>Giá</th>
              <th>Loại</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {foods.map(f => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.name}</td>
                <td>{Number(f.price).toLocaleString()}đ</td>
                <td>{f.category}</td>
                <td>
                  <button className="btn-edit" onClick={() => openEditModal(f)}>Sửa</button>
                  <button className="btn-delete" onClick={() => handleDelete(f.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        /* --- GIAO DIỆN USER (Dạng Card) --- */
        <div className="food-grid">
          {foods.map(f => (
            <div key={f.id} className="food-card">
              <div className="food-img">IMG</div>
              <h4>{f.name}</h4>
              <p className="price">{Number(f.price).toLocaleString()}đ</p>
              <button className="btn-cart">Thêm vào giỏ</button>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL FORM (Thêm/Sửa) --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingFood ? "Cập nhật món ăn" : "Thêm món mới"}</h3>
            <form onSubmit={handleSubmit}>
              <input 
                placeholder="Tên món" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
              <input 
                type="number" 
                placeholder="Giá (VNĐ)" 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
                required 
              />
              <input 
                placeholder="Loại (VD: Đồ uống, Khai vị)" 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
              />
              <div className="modal-actions">
                <button type="submit" className="btn-save">Lưu</button>
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodManagement;