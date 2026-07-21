import React, { useState, useEffect } from 'react';
import '../styles/SalesReportPage.css';
import { dashboardService } from '../lib/dashboardService';

function SalesReportPage() {
  const [topProducts, setTopProducts] = useState([]);
  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [salesByDate, setSalesByDate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState(30);

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [top, revenue, sales] = await Promise.all([
        dashboardService.getTopProductsBySales(10),
        dashboardService.getRevenueByCategory(),
        dashboardService.getSalesByDate(dateRange),
      ]);
      setTopProducts(top);
      setRevenueByCategory(revenue);
      setSalesByDate(sales);
      setError('');
    } catch (error) {
      setError('Lỗi tải báo cáo: ' + error.message);
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = topProducts.reduce((sum, p) => sum + (p.revenue || 0), 0);
  const totalItems = topProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const totalSales = salesByDate.reduce((sum, s) => sum + s.total, 0);

  if (loading) return <div className="sales-report-page"><div className="loading">Đang tải báo cáo...</div></div>;

  return (
    <div className="sales-report-page">
      <div className="page-header">
        <h1>📈 Báo Cáo Doanh Thu</h1>
        <button onClick={fetchReportData} className="btn-refresh">
          🔄 Làm mới
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="date-range-selector">
        <label>Thời gian:</label>
        {[7, 30, 90, 365].map(days => (
          <button
            key={days}
            onClick={() => setDateRange(days)}
            className={`range-btn ${dateRange === days ? 'active' : ''}`}
          >
            {days === 7 ? '7 Ngày' : days === 30 ? '30 Ngày' : days === 90 ? '90 Ngày' : '1 Năm'}
          </button>
        ))}
      </div>

      <div className="report-summary">
        <div className="summary-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Tổng Doanh Thu</h3>
            <p className="card-value">
              {totalSales.toLocaleString('vi-VN')} ₫
            </p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📦</div>
          <div className="card-content">
            <h3>Tổng Sản Phẩm Bán</h3>
            <p className="card-value">{totalItems}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📋</div>
          <div className="card-content">
            <h3>Số Đơn Bán</h3>
            <p className="card-value">{salesByDate.length}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Trung Bình Mỗi Đơn</h3>
            <p className="card-value">
              {salesByDate.length > 0 
                ? (totalSales / salesByDate.length).toLocaleString('vi-VN', { maximumFractionDigits: 0 })
                : 0
              } ₫
            </p>
          </div>
        </div>
      </div>

      <div className="report-sections">
        <section className="report-section">
          <h2>🏆 Top 10 Sản Phẩm Bán Chạy Nhất</h2>
          <div className="table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Xếp Hạng</th>
                  <th>Tên Sản Phẩm</th>
                  <th>Số Lượng Bán</th>
                  <th>Doanh Thu</th>
                  <th>Tỷ Lệ</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => {
                  const percentage = totalRevenue > 0 ? (product.revenue / totalRevenue * 100) : 0;
                  return (
                    <tr key={product.productId}>
                      <td className="rank">#{index + 1}</td>
                      <td className="name">{product.name}</td>
                      <td className="quantity">{product.quantity}</td>
                      <td className="revenue">
                        {product.revenue.toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="percentage">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${percentage}%` }}
                          >
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {topProducts.length === 0 && (
            <div className="empty-state">
              <p>📭 Không có dữ liệu bán hàng</p>
            </div>
          )}
        </section>

        <section className="report-section">
          <h2>🏷️ Doanh Thu Theo Danh Mục</h2>
          <div className="table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Danh Mục</th>
                  <th>Số Sản Phẩm Bán</th>
                  <th>Doanh Thu</th>
                  <th>Tỷ Lệ</th>
                </tr>
              </thead>
              <tbody>
                {revenueByCategory.map((category, index) => {
                  const totalCategoryRevenue = revenueByCategory.reduce((sum, c) => sum + c.revenue, 0);
                  const percentage = totalCategoryRevenue > 0 ? (category.revenue / totalCategoryRevenue * 100) : 0;
                  return (
                    <tr key={category.categoryId}>
                      <td className="category">{category.categoryName}</td>
                      <td className="items">{category.items}</td>
                      <td className="revenue">
                        {category.revenue.toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="percentage">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${percentage}%` }}
                          >
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {revenueByCategory.length === 0 && (
            <div className="empty-state">
              <p>📭 Không có dữ liệu theo danh mục</p>
            </div>
          )}
        </section>

        <section className="report-section">
          <h2>📅 Doanh Thu Theo Ngày</h2>
          <div className="chart-container">
            {salesByDate.length > 0 ? (
              <div className="simple-chart">
                {salesByDate.slice(-14).map((day, index) => {
                  const maxRevenue = Math.max(...salesByDate.map(d => d.total));
                  const heightPercent = maxRevenue > 0 ? (day.total / maxRevenue * 100) : 0;
                  return (
                    <div key={index} className="chart-bar-container">
                      <div 
                        className="chart-bar"
                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                        title={`${day.date}: ${day.total.toLocaleString('vi-VN')} ₫`}
                      >
                        <span className="bar-label">
                          {day.total.toLocaleString('vi-VN', { notation: 'compact' })} ₫
                        </span>
                      </div>
                      <span className="bar-date">{new Date(day.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <p>📭 Không có dữ liệu</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="report-footer">
        <p>💡 Báo cáo được cập nhật tự động. Nhấn "Làm mới" để tải dữ liệu mới nhất.</p>
      </div>
    </div>
  );
}

export default SalesReportPage;
