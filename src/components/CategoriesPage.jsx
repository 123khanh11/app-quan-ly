import React, { useState, useEffect } from 'react';
import '../styles/CategoriesPage.css';
import { supabase } from '../lib/supabaseClient';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
      setError('');
    } catch (error) {
      setError('Lỗi tải danh mục: ' + error.message);
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name.trim()) {
        alert('Vui lòng nhập tên danh mục');
        return;
      }

      if (editingId) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            description: formData.description,
            image_url: formData.image_url || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
        alert('Cập nhật thành công!');
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([{
            name: formData.name,
            description: formData.description,
            image_url: formData.image_url || null,
            created_at: new Date().toISOString(),
          }]);

        if (error) throw error;
        alert('Tạo danh mục thành công!');
      }

      await fetchCategories();
      resetForm();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      image_url: category.image_url || '',
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa danh mục này?')) return;

    try {
      // Check if category has products
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('category_id', id)
        .limit(1);

      if (products && products.length > 0) {
        alert('Không thể xóa danh mục vì còn sản phẩm trong đó!');
        return;
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCategories();
      alert('Xóa thành công!');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_url: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="categories-page"><div className="loading">Đang tải...</div></div>;

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1>🏷️ Quản Lý Danh Mục</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn-primary ${showForm ? 'active' : ''}`}
        >
          {showForm ? '✕ Đóng' : '+ Thêm Danh Mục'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="category-form">
          <h2>{editingId ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}</h2>

          <div className="form-grid">
            <div className="form-group full-width">
              <label>Tên Danh Mục *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên danh mục"
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Mô Tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Nhập mô tả danh mục"
                rows="4"
              />
            </div>

            <div className="form-group full-width">
              <label>URL Hình Ảnh</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {formData.image_url && (
              <div className="image-preview">
                <img src={formData.image_url} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-success">
              {editingId ? 'Cập Nhật' : 'Thêm'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              Hủy
            </button>
          </div>
        </form>
      )}

      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            {category.image_url && (
              <img src={category.image_url} alt={category.name} className="category-image" />
            )}
            <div className="category-info">
              <h3>{category.name}</h3>
              {category.description && (
                <p className="description">{category.description}</p>
              )}
            </div>
            <div className="category-actions">
              <button
                onClick={() => handleEdit(category)}
                className="btn-edit"
              >
                ✏️ Sửa
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="btn-delete"
              >
                🗑️ Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="empty-state">
          <p>📭 Không có danh mục</p>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;
