import React, { useState } from 'react';
import '../styles/LoginPage.css';
import { supabase } from '../lib/supabaseClient';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      onLoginSuccess();
    } catch (error) {
      setError(error.message || 'Lỗi đăng nhập. Vui lòng thử lại.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setError('');
      setIsSignUp(false);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
    } catch (error) {
      setError(error.message || 'Lỗi đăng ký. Vui lòng thử lại.');
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          scopes: 'email profile',
        },
      });

      if (error) throw error;

      onLoginSuccess();
    } catch (error) {
      setError(error.message || 'Lỗi đăng nhập Gmail. Vui lòng thử lại.');
      console.error('Google login error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>📦 Quản Lý Kho Hàng</h1>
          <p>Hệ thống quản lý đơn hàng và sản phẩm</p>
        </div>

        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="login-form">
          <h2>{isSignUp ? 'Đăng ký' : 'Đăng nhập'}</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : (isSignUp ? 'Đăng ký' : 'Đăng nhập')}
          </button>

          <div style={{ margin: '15px 0', textAlign: 'center', color: '#666', fontSize: '14px' }}>
            hoặc
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#DB4437',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              marginBottom: '15px',
              transition: 'background-color 0.3s',
              opacity: loading ? 0.6 : 1,
            }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#C5221F')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#DB4437')}
          >
            📧 {isSignUp ? 'Đăng ký bằng Gmail' : 'Đăng nhập bằng Gmail'}
          </button>

          <div className="form-footer">
            <p>
              {isSignUp ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
              >
                {isSignUp ? 'Đăng nhập' : 'Đăng ký'}
              </button>
            </p>
          </div>
        </form>

        <div className="login-info">
          <h3>Demo Account:</h3>
          <p>Email: demo@example.com</p>
          <p>Password: demo123456</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
