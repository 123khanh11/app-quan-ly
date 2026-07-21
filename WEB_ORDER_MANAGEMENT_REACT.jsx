// ========================================
// Order Management Component (React)
// File: src/components/OrderManagement.jsx
// ========================================

import React, { useEffect, useState } from 'react'
import { getOrders, updateOrderStatus, searchOrders, getOrdersByStatus } from '../lib/orderService'
import { parseAddress, formatAddressHTML, getAddressSummary } from '../lib/parseAddress'
import './OrderManagement.css'

export default function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Load orders on mount
  useEffect(() => {
    loadOrders()
  }, [])

  // Filter orders when status or search changes
  useEffect(() => {
    filterOrders()
  }, [orders, selectedStatus, searchQuery])

  const loadOrders = async () => {
    setLoading(true)
    const data = await getOrders()
    setOrders(data)
    setLoading(false)
  }

  const filterOrders = async () => {
    let results = orders

    // Filter by status
    if (selectedStatus !== 'all') {
      results = results.filter(o => o.order_status === selectedStatus)
    }

    // Search
    if (searchQuery.trim()) {
      results = await searchOrders(searchQuery)
    }

    setFilteredOrders(results)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    const success = await updateOrderStatus(orderId, newStatus)
    if (success) {
      setOrders(orders.map(o =>
        o.id === orderId ? { ...o, order_status: newStatus } : o
      ))
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: '⏳ Chờ xử lý', color: '#ff9800' },
      processing: { text: '🔄 Đang xử lý', color: '#2196f3' },
      shipped: { text: '📦 Đã gửi', color: '#00bcd4' },
      completed: { text: '✅ Hoàn thành', color: '#4caf50' },
      cancelled: { text: '❌ Đã hủy', color: '#f44336' }
    }
    return statusMap[status] || { text: status, color: '#999' }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>⏳ Đang tải...</div>
  }

  return (
    <div className="order-management">
      <h1>📦 Quản Lý Đơn Hàng</h1>

      {/* Filter & Search */}
      <div className="controls">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo địa chỉ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <div className="status-filters">
          <button
            className={`filter-btn ${selectedStatus === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('all')}
          >
            Tất cả ({orders.length})
          </button>
          <button
            className={`filter-btn ${selectedStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('pending')}
          >
            Chờ xử lý
          </button>
          <button
            className={`filter-btn ${selectedStatus === 'processing' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('processing')}
          >
            Đang xử lý
          </button>
          <button
            className={`filter-btn ${selectedStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('completed')}
          >
            Hoàn thành
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          📭 Không có đơn hàng
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => {
            const addr = parseAddress(order.shipping_address)
            const statusInfo = getStatusBadge(order.order_status)

            return (
              <div key={order.id} className="order-card">
                {/* Header */}
                <div className="order-header">
                  <div>
                    <h3>Đơn #{order.id.substring(0, 8).toUpperCase()}</h3>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div
                    className="status-badge"
                    style={{ backgroundColor: statusInfo.color }}
                  >
                    {statusInfo.text}
                  </div>
                </div>

                {/* 📋 Thông Tin Cơ Bản */}
                <div className="section info-section">
                  <h4>📋 Thông Tin Cơ Bản</h4>
                  <p><strong>Mã đơn:</strong> {order.id.substring(0, 8).toUpperCase()}</p>
                  <p><strong>Khách hàng:</strong> {order.user_id ? order.user_id.substring(0, 8) : 'N/A'}</p>
                  <p><strong>Ngày tạo:</strong> {new Date(order.created_at).toLocaleString('vi-VN')}</p>
                </div>

                {/* 📍 Address */}
                <div className="section address-section">
                  <h4>📍 Địa Chỉ Giao Hàng</h4>
                  {addr.province || addr.district || addr.ward || addr.detail ? (
                    <div className="address-info">
                      {addr.province && <p><strong>🏙️ Tỉnh/Thành phố:</strong> {addr.province}</p>}
                      {addr.district && <p><strong>🏘️ Quận/Huyện:</strong> {addr.district}</p>}
                      {addr.ward && <p><strong>🏘️ Xã/Phường:</strong> {addr.ward}</p>}
                      {addr.detail && <p><strong>🏠 Chi tiết:</strong> {addr.detail}</p>}
                    </div>
                  ) : (
                    <p style={{ color: '#999', fontStyle: 'italic' }}>Chưa có thông tin</p>
                  )}
                </div>

                {/* 💰 Money & Payment */}
                <div className="section money-section">
                  <h4>💰 Thông Tin Thanh Toán</h4>
                  <p>
                    <strong>Tổng tiền:</strong> {formatCurrency(order.total)}
                  </p>
                  {order.shipping_fee > 0 && (
                    <p>
                      <strong>Phí giao hàng:</strong> {formatCurrency(order.shipping_fee)}
                    </p>
                  )}
                  {order.payment_method && (
                    <p>
                      <strong>Phương thức thanh toán:</strong>{' '}
                      {order.payment_method === 'cod' ? '💵 COD' : '🏦 Chuyển khoản'}
                    </p>
                  )}
                  {order.payment_status && (
                    <p>
                      <strong>Trạng thái thanh toán:</strong> {order.payment_status}
                    </p>
                  )}
                </div>

                {/* 📝 Note */}
                {order.note && (
                  <div className="section note-section">
                    <h4>📝 Ghi Chú</h4>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{order.note}</p>
                  </div>
                )}

                {/* 📌 Status Update */}
                <div className="section actions">
                  <h4>⚙️ Cập Nhật Trạng Thái</h4>
                  <select
                    value={order.order_status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">⏳ Chờ xử lý</option>
                    <option value="processing">🔄 Đang xử lý</option>
                    <option value="shipped">📦 Đã gửi</option>
                    <option value="completed">✅ Hoàn thành</option>
                    <option value="cancelled">❌ Đã hủy</option>
                  </select>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Refresh Button */}
      <button onClick={loadOrders} className="refresh-btn">
        🔄 Làm mới
      </button>
    </div>
  )
}
