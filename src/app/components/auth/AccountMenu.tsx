import { useState } from 'react'
import { supabase } from '@/services/supabase'
import { ChevronDown, LogOut, User } from 'lucide-react'

interface AccountMenuProps {
  user: any
  onLogoutSuccess?: () => void
}

export function AccountMenu({ user, onLogoutSuccess }: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('Initiating logout...')
      
      // Sign out from Supabase
      const { error: logoutError } = await supabase.auth.signOut()
      
      if (logoutError) {
        console.error('Logout error:', logoutError)
        setError('Lỗi đăng xuất: ' + logoutError.message)
        return
      }
      
      console.log('✅ Logged out successfully')
      
      // Clear local state
      setIsOpen(false)
      
      // Callback on success
      if (onLogoutSuccess) {
        onLogoutSuccess()
      }
      
      // Reload page to clear all state
      window.location.reload()
      
    } catch (err) {
      console.error('Logout exception:', err)
      const errorMsg = err instanceof Error ? err.message : 'Lỗi không xác định'
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Account Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-800 transition-colors"
      >
        {user?.user_metadata?.avatar_url ? (
          <>
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Avatar" 
              className="w-6 h-6 rounded-full"
            />
            <span className="hidden md:inline text-sm">{user?.user_metadata?.full_name || 'User'}</span>
          </>
        ) : (
          <>
            <User size={20} />
            <span className="hidden md:inline text-sm">Tài khoản</span>
          </>
        )}
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-lg z-50 border border-gray-200">
          {/* User Info */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            {user?.user_metadata?.avatar_url && (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full mb-2"
              />
            )}
            <p className="font-semibold text-sm truncate">
              {user?.user_metadata?.full_name || user?.email}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false)
                // TODO: Navigate to order tracking
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              📦 Đơn hàng của tôi
            </button>

            <button
              onClick={() => {
                setIsOpen(false)
                // TODO: Navigate to profile
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              👤 Hồ sơ
            </button>
          </div>

          {/* Logout Button */}
          <div className="p-2 border-t border-gray-200">
            {error && (
              <div className="px-3 py-2 mb-2 text-xs text-red-600 bg-red-50 rounded">
                ❌ {error}
              </div>
            )}
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang đăng xuất...
                </>
              ) : (
                <>
                  <LogOut size={16} />
                  Đăng xuất
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Close menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
