import React, { useState, useEffect } from 'react';
import '../styles/OrdersPage.css';
import { orderService } from '../lib/orderService';

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
    user_id: '',
    total: '',
    shipping_fee: '',
    payment_method: 'cod',
    payment_status: 'pending',
    order_status: 'pending',
    shipping_address: '',
    note: '',
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
      if (!formData.total) {
        alert('Vui lòng nhập tổng tiền');
        return;
      }

      if (editingId) {
        await orderService.updateOrder(editingId, formData);
        alert('Cập nhật thành công!');
      } else {
        await orderService.createOrder(formData);
        alert('Tạo đơn hàng thành công!');
      }

      await fetchOrders();
      resetForm();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = (order) => {
    setFormData({
      user_id: order.user_id || '',
      total: order.total || '',
      shipping_fee: order.shipping_fee || '',
      payment_method: order.payment_method || 'cod',
      payment_status: order.payment_status || 'pending',
      order_status: order.order_status || 'pending',
      shipping_address: order.shipping_address || '',
      note: order.note || '',
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

  const resetForm = () => {
    setFormData({
      user_id: '',
      total: '',
      shipping_fee: '',
      payment_method: 'cod',
      payment_status: 'pending',
      order_status: 'pending',
      shipping_address: '',
      note: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.order_status === filterStatus);

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
              <label>Tổng Tiền *</label>
              <input
                type="number"
                name="total"
                value={formData.total}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Phí Vận Chuyển</label>
              <input
                type="number"
                name="shipping_fee"
                value={formData.shipping_fee}
                onChange={handleInputChange}
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Phương Thức Thanh Toán</label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleInputChange}
              >
                <option value="cod">Thanh toán khi nhận</option>
                <option value="card">Thẻ tín dụng</option>
                <option value="bank">Chuyển khoản</option>
                <option value="wallet">Ví điện tử</option>
              </select>
            </div>

            <div className="form-group">
              <label>Trạng Thái Thanh Toán</label>
              <select
                name="payment_status"
                value={formData.payment_status}
                onChange={handleInputChange}
              >
                <option value="pending">⏳ Chờ thanh toán</option>
                <option value="completed">✅ Đã thanh toán</option>
                <option value="failed">❌ Thất bại</option>
              </select>
            </div>

            <div className="form-group">
              <label>Trạng Thái Đơn Hàng</label>
              <select
                name="order_status"
                value={formData.order_status}
                onChange={handleInputChange}
              >
                <option value="pending">⏳ Chờ xử lý</option>
                <option value="processing">⚙️ Đang xử lý</option>
                <option value="completed">✅ Hoàn thành</option>
                <option value="cancelled">❌ Hủy bỏ</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Địa Chỉ Giao Hàng</label>
              <textarea
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleInputChange}
                placeholder="Số nhà, đường, phường, quận, thành phố"
                rows="2"
              />
            </div>

            <div className="form-group full-width">
              <label>Ghi Chú</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                rows="2"
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
              <th>Tổng Tiền</th>
              <th>Phí Vận Chuyển</th>
              <th>Phương Thức TT</th>
              <th>Trạng Thái TT</th>
              <th>Trạng Thái Đơn</th>
              <th>Ngày Tạo</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td className="id-cell">#{order.id.slice(0, 8)}</td>
                <td className="amount-cell">
                  {order.total?.toLocaleString('vi-VN')} ₫
                </td>
                <td className="fee-cell">
                  {order.shipping_fee?.toLocaleString('vi-VN') || '0'} ₫
                </td>
                <td className="payment-method-cell">
                  {order.payment_method === 'cod' ? 'COD' : 
                   order.payment_method === 'card' ? 'Thẻ' :
                   order.payment_method === 'bank' ? 'Chuyển khoản' : 'Ví'}
                </td>
                <td className="payment-status-cell">
                  <span className={`badge payment-${order.payment_status}`}>
                    {order.payment_status === 'pending' ? '⏳ Chờ' :
                     order.payment_status === 'completed' ? '✅ OK' : '❌ Thất bại'}
                  </span>
                </td>
                <td className="order-status-cell">
                  <select
                    value={order.order_status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`status-select status-${order.order_status}`}
                  >
                    <option value="pending">⏳ Chờ</option>
                    <option value="processing">⚙️ Đang</option>
                    <option value="completed">✅ OK</option>
                    <option value="cancelled">❌ Hủy</option>
                  </select>
                </td>
                <td>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                <td className="actions-cell">
                  <button
                    onClick={() => {
                      setSelectedOrder(selectedOrder?.id === order.id ? null : order);
                    }}
                    className="btn-view"
                    title="Xem chi tiết"
                  >
                    👁️
                  </button>
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

      {selectedOrder && (
        <div className="order-detail-popup">
          <div className="popup-content">
            <button className="close-btn" onClick={() => setSelectedOrder(null)}>✕</button>
            <h3>Chi Tiết Đơn Hàng</h3>
            <div className="detail-content">
              <p><strong>ID:</strong> {selectedOrder.id}</p>
              <p><strong>Tổng Tiền:</strong> {selectedOrder.total?.toLocaleString('vi-VN')} ₫</p>
              <p><strong>Phí Vận Chuyển:</strong> {selectedOrder.shipping_fee?.toLocaleString('vi-VN')} ₫</p>
              <p><strong>Địa Chỉ Giao Hàng:</strong></p>
              <p className="address-text">{selectedOrder.shipping_address || '(Không có)'}</p>
              <p><strong>Ghi Chú:</strong> {selectedOrder.note || '(Không có)'}</p>
              <p><strong>Ngày Tạo:</strong> {new Date(selectedOrder.created_at).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 && (
        <div className="empty-state">
          <p>📭 Không có đơn hàng</p>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
