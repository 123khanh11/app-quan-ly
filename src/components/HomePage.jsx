import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';
import { dashboardService } from '../lib/dashboardService';

function HomePage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardSummary();
      setSummary(data);
      setError('');
    } catch (error) {
      setError('Lỗi tải dữ liệu: ' + error.message);
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="home-page"><div className="loading">Đang tải dữ liệu...</div></div>;
  if (error) return <div className="home-page"><div className="error">{error}</div></div>;
  if (!summary) return <div className="home-page"><div className="error">Không có dữ liệu</div></div>;

  return (
    <div className="home-page">
      <div className="dashboard-header">
        <h1>📊 Bảng Điều Khiển</h1>
        <button onClick={fetchDashboardData} className="btn-refresh">
          🔄 Làm mới
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card revenue-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Tổng Doanh Thu</h3>
            <p className="stat-value">
              {summary.totalRevenue.toLocaleString('vi-VN')} ₫
            </p>
            <p className="stat-date">
              Hôm nay: {summary.todayRevenue.toLocaleString('vi-VN')} ₫
            </p>
          </div>
        </div>

        <div className="stat-card orders-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Tổng Đơn Hàng</h3>
            <p className="stat-value">{summary.totalOrders}</p>
            <p className="stat-date">
              Hôm nay: {summary.todayOrders}
            </p>
          </div>
        </div>

        <div className="stat-card products-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Số Sản Phẩm</h3>
            <p className="stat-value">{summary.totalProducts}</p>
            <p className="stat-date">
              Tổng kho: {summary.totalStock}
            </p>
          </div>
        </div>

        <div className="stat-card category-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <h3>Danh Mục</h3>
            <p className="stat-value">{summary.totalCategories}</p>
            <p className="stat-date">
              Tổng danh mục sản phẩm
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>📊 Trạng Thái Đơn Hàng</h2>
        <div className="status-grid">
          <div className="status-item pending">
            <span className="status-label">⏳ Chờ xử lý</span>
            <span className="status-value">{summary.statusBreakdown.pending}</span>
          </div>
          <div className="status-item processing">
            <span className="status-label">⚙️ Đang xử lý</span>
            <span className="status-value">{summary.statusBreakdown.processing}</span>
          </div>
          <div className="status-item completed">
            <span className="status-label">✅ Hoàn thành</span>
            <span className="status-value">{summary.statusBreakdown.completed}</span>
          </div>
          <div className="status-item cancelled">
            <span className="status-label">❌ Hủy bỏ</span>
            <span className="status-value">{summary.statusBreakdown.cancelled}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-info">
        <p>💡 Dữ liệu được cập nhật liên tục. Nhấn "Làm mới" để tải dữ liệu mới nhất.</p>
      </div>
    </div>
  );
}

export default HomePage;
