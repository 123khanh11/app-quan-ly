import { useState, useEffect } from 'react'
import { X, Chrome, Loader, LogOut, User } from 'lucide-react'
import { supabase } from '@/services/supabase'

interface LoginFormProps {
  onClose: () => void
}

interface AccountMenuProps {
  user: any
  onClose: () => void
  onLogout?: () => void
}

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  user?: any
  onLogout?: () => void
}

// Separate component for login form
function LoginForm({ onClose }: LoginFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Starting Google login...')
      
      const { error: signInError, data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })

      console.log('OAuth response:', { error: signInError, data })

      if (signInError) {
        console.error('Sign in error:', signInError)
        setError(signInError.message || 'Lỗi đăng nhập với Google')
      }
    } catch (err) {
      console.error('Google login error:', err)
      const errorMsg = err instanceof Error ? err.message : 'Lỗi đăng nhập'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 pointer-events-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full pointer-events-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b pointer-events-auto">
          <h2 className="text-xl font-bold">Đăng Nhập</h2>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('❌ Close button clicked (login form)')
              onClose()
            }}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded p-1 transition-colors pointer-events-auto flex-shrink-0"
            type="button"
            aria-label="Close login modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-center mb-6">
            Đăng nhập để tiếp tục mua sắm
          </p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              <>
                <Chrome size={20} />
                Đăng nhập bằng Google
              </>
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              ❌ {error}
            </div>
          )}

          <p className="text-center text-xs text-gray-500">
            Chúng tôi chỉ nhận email từ Google. Không yêu cầu mật khẩu.
          </p>
        </div>
      </div>
    </div>
  )
}

// Separate component for account menu
function AccountMenu({ user, onClose, onLogout }: AccountMenuProps) {
  const [loggingOut, setLoggingOut] = useState(false)
  const [isLoggingOutForSwitch, setIsLoggingOutForSwitch] = useState(false)

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      console.log('🔄 Starting logout...')
      
      // Save cart and favorites before clearing storage
      const cartBackup = localStorage.getItem('shopping_cart')
      const favoritesBackup = localStorage.getItem('favorites')
      
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('❌ Supabase signOut error:', error)
      } else {
        console.log('✅ Supabase signed out successfully')
      }
      
      // Clear auth-related storage only
      localStorage.removeItem('supabase.auth.token')
      localStorage.removeItem('sb-token')
      sessionStorage.clear()
      
      // Restore cart and favorites
      if (cartBackup) localStorage.setItem('shopping_cart', cartBackup)
      if (favoritesBackup) localStorage.setItem('favorites', favoritesBackup)
      
      console.log('✅ Auth cleared, cart & favorites preserved')
      
      onLogout?.()
      onClose()
      
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
    } catch (err) {
      console.error('❌ Logout error:', err)
      window.location.href = '/'
    } finally {
      setLoggingOut(false)
    }
  }

  const handleSwitchAccount = async () => {
    try {
      setIsLoggingOutForSwitch(true)
      console.log('🔄 Switching to different Google account...')
      
      // Sign out current user
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('❌ Sign out error:', error)
      } else {
        console.log('✅ Signed out successfully')
      }
      
      // Clear auth tokens only (keep cart)
      localStorage.removeItem('supabase.auth.token')
      localStorage.removeItem('sb-token')
      sessionStorage.clear()
      
      console.log('✅ Ready to login with different account')
      
      // Call parent's logout handler to update user state
      onLogout?.()
      
      // Keep modal open for new login - DON'T close
      setIsLoggingOutForSwitch(false)
    } catch (err) {
      console.error('❌ Switch account error:', err)
      setIsLoggingOutForSwitch(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 pointer-events-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full pointer-events-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b pointer-events-auto">
          <h2 className="text-xl font-bold">Tài Khoản</h2>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('❌ Close button clicked (account menu)')
              onClose()
            }}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded p-1 transition-colors pointer-events-auto flex-shrink-0"
            type="button"
            aria-label="Close account menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3 pb-4 border-b">
            {user.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Avatar" 
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <User size={24} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {user.user_metadata?.full_name || 'Người dùng'}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loggingOut ? (
              <>
                <Loader size={20} className="animate-spin" />
                Đang đăng xuất...
              </>
            ) : (
              <>
                <LogOut size={20} />
                Đăng Xuất
              </>
            )}
          </button>

          {/* Switch Account Button */}
          <button
            onClick={handleSwitchAccount}
            disabled={isLoggingOutForSwitch}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOutForSwitch ? (
              <>
                <Loader size={20} className="animate-spin" />
                Đang chuyển...
              </>
            ) : (
              <>
                <Chrome size={20} />
                Dùng Tài Khoản Khác
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-500">
            Bạn đang đăng nhập bằng Google
          </p>
        </div>
      </div>
    </div>
  )
}

// Main component
export function LoginModal({ isOpen, onClose, user, onLogout }: LoginModalProps) {
  // Handle OAuth callback
  useEffect(() => {
    const handleAuthChange = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session && !user) {
        // User logged in successfully
        onClose()
      }
    }

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          onClose()
        }
      }
    )

    handleAuthChange()

    return () => {
      subscription?.subscription.unsubscribe()
    }
  }, [onClose, user])

  if (!isOpen) {
    return null
  }

  // Show the appropriate component based on user state
  if (user) {
    return <AccountMenu user={user} onClose={onClose} onLogout={onLogout} />
  }

  return <LoginForm onClose={onClose} />
}
