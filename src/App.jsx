import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import OrdersPage from './components/OrdersPage';
import ProductsPage from './components/ProductsPage';
import InventoryPage from './components/InventoryPage';
import SalesReportPage from './components/SalesReportPage';
import CategoriesPage from './components/CategoriesPage';
import { supabase } from './lib/supabaseClient';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        setCurrentPage('login');
      }
    });
    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
      if (!data?.session?.user) {
        setCurrentPage('login');
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setCurrentPage('login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Lỗi đăng xuất: ' + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (!user) {
    return <LoginPage onLoginSuccess={() => setCurrentPage('home')} />;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            📦 Quản Lý Kho Hàng
          </div>
          <ul className="nav-menu">
            <li>
              <button
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => setCurrentPage('home')}
              >
                🏠 Trang chủ
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'orders' ? 'active' : ''}`}
                onClick={() => setCurrentPage('orders')}
              >
                📋 Đơn hàng
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'products' ? 'active' : ''}`}
                onClick={() => setCurrentPage('products')}
              >
                📦 Sản phẩm
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'inventory' ? 'active' : ''}`}
                onClick={() => setCurrentPage('inventory')}
              >
                📊 Kho hàng
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'sales' ? 'active' : ''}`}
                onClick={() => setCurrentPage('sales')}
              >
                📈 Báo cáo
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'categories' ? 'active' : ''}`}
                onClick={() => setCurrentPage('categories')}
              >
                🏷️ Danh mục
              </button>
            </li>
            <li>
              <button
                className="nav-link logout"
                onClick={handleLogout}
              >
                🚪 Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'orders' && <OrdersPage />}
        {currentPage === 'products' && <ProductsPage />}
        {currentPage === 'inventory' && <InventoryPage />}
        {currentPage === 'sales' && <SalesReportPage />}
        {currentPage === 'categories' && <CategoriesPage />}
      </main>
    </div>
  );
}

export default App;
