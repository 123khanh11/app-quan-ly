import React, { useState, useEffect } from 'react';
import '../styles/ProductsPage.css';
import { productService } from '../lib/productService';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    sku: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setError('');
    } catch (error) {
      setError('Lỗi tải sản phẩm: ' + error.message);
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await fetch('http://localhost:3000/api/categories')
        .then(res => res.json())
        .catch(() => ({ data: [] }));
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
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
      if (!formData.name || !formData.price) {
        alert('Vui lòng nhập tên và giá sản phẩm');
        return;
      }

      if (editingId) {
        await productService.updateProduct(editingId, formData);
        alert('Cập nhật thành công!');
      } else {
        await productService.createProduct(formData);
        alert('Tạo sản phẩm thành công!');
      }

      await fetchProducts();
      resetForm();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      sku: product.sku || '',
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      await productService.deleteProduct(id);
      await fetchProducts();
      alert('Xóa thành công!');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image_url: '',
      sku: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredProducts = filterCategory === 'all'
    ? products
    : products.filter(p => p.category_id === filterCategory);

  if (loading) return <div className="products-page"><div className="loading">Đang tải...</div></div>;

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>📦 Quản Lý Sản Phẩm</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn-primary ${showForm ? 'active' : ''}`}
        >
          {showForm ? '✕ Đóng' : '+ Thêm Sản Phẩm'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="product-form">
          <h2>{editingId ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}</h2>

          <div className="form-grid">
            <div className="form-group">
              <label>Tên Sản Phẩm *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Danh Mục</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
              >
                <option value="">-- Chọn Danh Mục --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Giá *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>URL Hình Ảnh</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Mô Tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
              />
            </div>
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

      <div className="filter-section">
        <h3>Lọc theo danh mục:</h3>
        <div className="filter-buttons">
          <button
            onClick={() => setFilterCategory('all')}
            className={`filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
          >
            Tất Cả ({products.length})
          </button>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="product-image" />
            )}
            <div className="product-info">
              <h3>{product.name}</h3>
              {product.description && (
                <p className="description">{product.description.substring(0, 100)}...</p>
              )}
              <div className="product-details">
                <span className="price">{product.price?.toLocaleString('vi-VN')} ₫</span>
                <span className={`stock ${product.stock_quantity > 10 ? 'high' : 'low'}`}>
                  Kho: {product.stock_quantity || 0}
                </span>
              </div>
              {product.sku && (
                <p className="sku">SKU: {product.sku}</p>
              )}
            </div>
            <div className="product-actions">
              <button
                onClick={() => handleEdit(product)}
                className="btn-edit"
              >
                ✏️ Sửa
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="btn-delete"
              >
                🗑️ Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <p>📭 Không có sản phẩm</p>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
