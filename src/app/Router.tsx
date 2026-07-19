import { useState, useEffect } from 'react'
import { ShopHome } from './components/shop/ShopHome'
import LoginPage from './pages/login'
import AuthCallbackPage from './pages/auth/callback'

export function Router() {
  const [currentPage, setCurrentPage] = useState('home')

  // Listen to URL changes
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      if (path === '/login') {
        setCurrentPage('login')
      } else if (path === '/auth/callback') {
        setCurrentPage('auth-callback')
      } else {
        setCurrentPage('home')
      }
    }

    window.addEventListener('popstate', handlePopState)
    handlePopState() // Initial check

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Handle navigation
  const navigate = (page: string) => {
    setCurrentPage(page)
    if (page === 'login') {
      window.history.pushState({}, '', '/login')
    } else if (page === 'auth-callback') {
      window.history.pushState({}, '', '/auth/callback')
    } else {
      window.history.pushState({}, '', '/')
    }
  }

  switch (currentPage) {
    case 'login':
      return <LoginPage />
    case 'auth-callback':
      return <AuthCallbackPage />
    default:
      return <ShopHome />
  }
}
