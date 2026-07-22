import React, { useState, useEffect } from 'react';
import '../styles/InventoryPage.css';
import { productService } from '../lib/productService';

function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [editingStockId, setEditingStockId] = useState(null);
  const [newStockValue, setNewStockValue] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchInventoryData();
    const interval = setInterval(fetchInventoryData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const [allProducts, low] = await Promise.all([
        productService.getAllProducts(),
        productService.getLowStockProducts(10),
      ]);
      setProducts(allProducts);
      setLowStockItems(low);
      setError('');
    } catch (error) {
      setError('Lỗi tải dữ liệu kho: ' + error.message);
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (product, currentStock) => {
    if (editingStockId === product.id) {
      try {
        const quantity = parseInt(newStockValue);
        if (isNaN(quantity) || quantity < 0) {
          alert('Vui lòng nhập số lượng hợp lệ');
          return;
        }

        let variantId = product.default_variant_id || product.variant_id;
        if (!variantId) {
          const variant = await productService.ensureDefaultVariant(product.id, quantity, product.price || 0);
          variantId = variant.id;
        } else {
          await productService.updateStock(variantId, quantity);
        }

        await fetchInventoryData();
        alert('Cập nhật kho hàng thành công!');
        setEditingStockId(null);
        setNewStockValue('');
      } catch (error) {
        alert('Lỗi: ' + error.message);
      }
    } else {
      setEditingStockId(product.id);
      setNewStockValue(currentStock.toString());
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'stock-low':
        return a.stock_quantity - b.stock_quantity;
      case 'stock-high':
        return b.stock_quantity - a.stock_quantity;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const displayedProducts = showLowStockOnly ? lowStockItems : sortedProducts;
  const totalStock = products.reduce((sum, p) => sum + (p.stock_quantity || 0), 0);
  const lowStockCount = lowStockItems.length;
  const stockValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock_quantity || 0)), 0);

  if (loading) return <div className="inventory-page"><div className="loading">Đang tải...</div></div>;

  return (
    <div className="inventory-page">
      <div className="page-header">
        <h1>📊 Quản Lý Kho Hàng</h1>
        <button onClick={fetchInventoryData} className="btn-refresh">
          🔄 Làm mới
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="inventory-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Tổng Số Lượng</h3>
            <p className="stat-value">{totalStock}</p>
            <p className="stat-label">sản phẩm trong kho</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Giá Trị Kho</h3>
            <p className="stat-value">
              {stockValue.toLocaleString('vi-VN')} ₫
            </p>
            <p className="stat-label">tổng giá trị hàng hóa</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Hàng Tồn Ít</h3>
            <p className="stat-value">{lowStockCount}</p>
            <p className="stat-label">cần bổ sung hàng hóa</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <h3>Tổng Sản Phẩm</h3>
            <p className="stat-value">{products.length}</p>
            <p className="stat-label">loại sản phẩm</p>
          </div>
        </div>
      </div>

      <div className="inventory-controls">
        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
            />
            Chỉ hiện hàng tồn ít
          </label>
        </div>

        <div className="control-group">
          <label htmlFor="sort-by">Sắp xếp theo:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Tên (A-Z)</option>
            <option value="stock-low">Tồn kho (Tăng)</option>
            <option value="stock-high">Tồn kho (Giảm)</option>
            <option value="price-low">Giá (Thấp)</option>
            <option value="price-high">Giá (Cao)</option>
          </select>
        </div>
      </div>

      {lowStockCount > 0 && (
        <div className="low-stock-alert">
          <span className="alert-icon">⚠️</span>
          <span className="alert-text">
            Có {lowStockCount} sản phẩm cần bổ sung hàng hóa!
          </span>
        </div>
      )}

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Sản Phẩm</th>
              <th>SKU</th>
              <th>Giá</th>
              <th>Tồn Kho</th>
              <th>Trạng Thái</th>
              <th>Giá Trị</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {displayedProducts.map(product => (
              <tr key={product.id} className={product.stock_quantity < 10 ? 'low-stock' : ''}>
                <td className="product-name">{product.name}</td>
                <td className="sku">{product.sku || '-'}</td>
                <td className="price">
                  {product.price?.toLocaleString('vi-VN')} ₫
                </td>
                <td className="stock-quantity">
                  {editingStockId === product.id ? (
                    <div className="stock-edit">
                      <input
                        type="number"
                        value={newStockValue}
                        onChange={(e) => setNewStockValue(e.target.value)}
                        min="0"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <span className={`stock-badge ${product.stock_quantity < 10 ? 'low' : 'normal'}`}>
                      {product.stock_quantity || 0}
                    </span>
                  )}
                </td>
                <td className="status">
                  {product.stock_quantity < 5 && (
                    <span className="status-badge critical">🔴 Rất Ít</span>
                  )}
                  {product.stock_quantity >= 5 && product.stock_quantity < 10 && (
                    <span className="status-badge warning">🟡 Ít</span>
                  )}
                  {product.stock_quantity >= 10 && product.stock_quantity < 50 && (
                    <span className="status-badge normal">🟢 OK</span>
                  )}
                  {product.stock_quantity >= 50 && (
                    <span className="status-badge good">💚 Đủ</span>
                  )}
                </td>
                <td className="value">
                  {((product.price || 0) * (product.stock_quantity || 0)).toLocaleString('vi-VN')} ₫
                </td>
                <td className="actions">
                  <button
                    onClick={() => handleUpdateStock(product, product.stock_quantity || 0)}
                    className={`btn-update-stock ${editingStockId === product.id ? 'saving' : ''}`}
                  >
                    {editingStockId === product.id ? '✅ Lưu' : '✏️ Sửa'}
                  </button>
                  {editingStockId === product.id && (
                    <button
                      onClick={() => {
                        setEditingStockId(null);
                        setNewStockValue('');
                      }}
                      className="btn-cancel"
                    >
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {displayedProducts.length === 0 && (
        <div className="empty-state">
          <p>📭 {showLowStockOnly ? 'Không có sản phẩm tồn ít' : 'Không có sản phẩm'}</p>
        </div>
      )}
    </div>
  );
}

export default InventoryPage;
