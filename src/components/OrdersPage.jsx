import React, { useState, useEffect } from 'react';
import '../styles/OrdersPage.css';
import { orderService } from '../lib/orderService';
import { orderItemService } from '../lib/orderItemService';
import { parseAddress, formatAddress } from '../lib/parseAddress';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    total_amount: '',
    status: 'pending',
    notes: '',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
      setError('');
    } catch (error) {
      setError('Lỗi tải đơn hàng: ' + error.message);
      console.error('Error fetching orders:', error);
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
      const address = parseAddress(formData.shipping_address);
      
      if (editingId) {
        await orderService.updateOrder(editingId, {
          ...formData,
          ...address,
        });
      } else {
        await orderService.createOrder({
          ...formData,
          ...address,
        });
      }

      await fetchOrders();
      resetForm();
      alert(editingId ? 'Cập nhật thành công!' : 'Tạo đơn hàng thành công!');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = (order) => {
    setFormData({
      customer_name: order.customer_name || '',
      customer_email: order.customer_email || '',
      customer_phone: order.customer_phone || '',
      shipping_address: order.shipping_address || '',
      total_amount: order.total ?? order.total_amount ?? '',
      status: order.order_status || order.status || 'pending',
      notes: order.note || order.notes || '',
    });
    setEditingId(order.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa đơn hàng này?')) return;

    try {
      await orderService.deleteOrder(id);
      await fetchOrders();
      alert('Xóa thành công!');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchOrders();
      return;
    }

    try {
      setLoading(true);
      const results = await orderService.searchOrders(searchQuery);
      setOrders(results);
    } catch (error) {
      alert('Lỗi tìm kiếm: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      shipping_address: '',
      total_amount: '',
      status: 'pending',
      notes: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => (o.order_status || o.status) === filterStatus);

  if (loading) return <div className="orders-page"><div className="loading">Đang tải...</div></div>;

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>📋 Quản Lý Đơn Hàng</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn-primary ${showForm ? 'active' : ''}`}
        >
          {showForm ? '✕ Đóng' : '+ Thêm Đơn'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="order-form">
          <h2>{editingId ? 'Sửa Đơn Hàng' : 'Tạo Đơn Hàng'}</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Tên Khách Hàng *</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Số Điện Thoại *</label>
              <input
                type="tel"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Trạng Thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="pending">⏳ Chờ xử lý</option>
                <option value="processing">⚙️ Đang xử lý</option>
                <option value="completed">✅ Hoàn thành</option>
                <option value="cancelled">❌ Hủy bỏ</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Địa Chỉ Giao Hàng *</label>
              <input
                type="text"
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ giao hàng chi tiết"
                required
              />
            </div>

            <div className="form-group">
              <label>Tổng Tiền</label>
              <input
                type="number"
                name="total_amount"
                value={formData.total_amount}
                onChange={handleInputChange}
                step="0.01"
              />
            </div>

            <div className="form-group full-width">
              <label>Ghi Chú</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-success">
              {editingId ? 'Cập Nhật' : 'Tạo Đơn'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              Hủy
            </button>
          </div>
        </form>
      )}

      <div className="orders-controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn-search">🔍 Tìm</button>
          <button 
            type="button" 
            onClick={() => {
              setSearchQuery('');
              fetchOrders();
            }}
            className="btn-secondary"
          >
            Đặt lại
          </button>
        </form>

        <div className="filter-buttons">
          {['all', 'pending', 'processing', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
            >
              {status === 'all' ? 'Tất Cả' : status === 'pending' ? '⏳ Chờ' : status === 'processing' ? '⚙️ Đang' : status === 'completed' ? '✅ OK' : '❌ Hủy'}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách Hàng</th>
              <th>Điện Thoại</th>
              <th>Địa Chỉ</th>
              <th>Tổng Tiền</th>
              <th>Trạng Thái</th>
              <th>Ngày Tạo</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td className="id-cell">#{order.id.slice(0, 8)}</td>
                <td className="name-cell">{order.customer_name || 'Khách lẻ'}</td>
                <td>{order.customer_phone || '-'}</td>
                <td className="address-cell">{order.shipping_address || '-'}</td>
                <td className="amount-cell">
                  {(order.total ?? order.total_amount ?? 0).toLocaleString('vi-VN')} ₫
                </td>
                <td>
                  <select
                    value={order.order_status || order.status || 'pending'}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`status-select status-${order.order_status || order.status || 'pending'}`}
                  >
                    <option value="pending">⏳ Chờ</option>
                    <option value="processing">⚙️ Đang</option>
                    <option value="completed">✅ Hoàn thành</option>
                    <option value="cancelled">❌ Hủy</option>
                  </select>
                </td>
                <td>{order.created_at ? new Date(order.created_at).toLocaleDateString('vi-VN') : '-'}</td>
                <td className="actions-cell">
                  <button
                    onClick={() => handleEdit(order)}
                    className="btn-edit"
                    title="Sửa"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="btn-delete"
                    title="Xóa"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="empty-state">
          <p>📭 Không có đơn hàng</p>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
