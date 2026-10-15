import { useState, useEffect } from 'react'
import { X, Chrome, Loader, LogOut, User, Plus } from 'lucide-react'
import { supabase } from '@/services/supabase'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  user?: any
  onLogout?: () => void
}

type ModalView = 'login' | 'account' | 'chooser'

export function LoginModal({ isOpen, onClose, user, onLogout }: LoginModalProps) {
  const [view, setView] = useState<ModalView>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const [savedAccounts, setSavedAccounts] = useState<string[]>([])

  // Update view based on user state
  useEffect(() => {
    if (user) {
      setView('account')
    } else {
      setView('login')
    }
  }, [user])

  // Handle OAuth callback
  useEffect(() => {
    const handleAuthChange = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session && !user) {
        onClose()
      }
    }

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event, session?.user?.email)
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

  // ===== LOGIN VIEW =====
  if (view === 'login') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold">Đăng Nhập</h2>
            <button
              onClick={() => {
                console.log('❌ Close button clicked (login form)')
                onClose()
              }}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded p-1 transition-colors"
              type="button"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-gray-600 text-center mb-6">
              Đăng nhập để tiếp tục mua sắm
            </p>

            <button
              onClick={async () => {
                try {
                  setLoading(true)
                  setError(null)
                  console.log('Starting Google login...')
                  
                  const { error: signInError } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                  })

                  if (signInError) {
                    console.error('Sign in error:', signInError)
                    setError(signInError.message || 'Lỗi đăng nhập')
                  }
                } catch (err) {
                  console.error('Error:', err)
                  setError(err instanceof Error ? err.message : 'Lỗi đăng nhập')
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
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

  // ===== ACCOUNT MENU VIEW =====
  if (view === 'account') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold">Tài Khoản</h2>
            <button
              onClick={() => {
                console.log('❌ Close button clicked (account menu)')
                onClose()
              }}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded p-1 transition-colors"
              type="button"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 pb-4 border-b">
              {user?.user_metadata?.avatar_url ? (
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
                  {user?.user_metadata?.full_name || 'Người dùng'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={async () => {
                try {
                  setLoggingOut(true)
                  console.log('🔄 Starting logout...')
                  
                  const cartBackup = localStorage.getItem('shopping_cart')
                  const favoritesBackup = localStorage.getItem('favorites')
                  
                  const { error } = await supabase.auth.signOut()
                  if (error) console.error('❌ Error:', error)
                  
                  localStorage.removeItem('supabase.auth.token')
                  localStorage.removeItem('sb-token')
                  sessionStorage.clear()
                  
                  if (cartBackup) localStorage.setItem('shopping_cart', cartBackup)
                  if (favoritesBackup) localStorage.setItem('favorites', favoritesBackup)
                  
                  onLogout?.()
                  onClose()
                  
                  setTimeout(() => {
                    window.location.href = '/'
                  }, 100)
                } catch (err) {
                  console.error('Error:', err)
                  window.location.href = '/'
                } finally {
                  setLoggingOut(false)
                }
              }}
              disabled={loggingOut}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
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
              onClick={async () => {
                try {
                  console.log('🔄 Switching account...')
                  
                  const { error } = await supabase.auth.signOut()
                  if (error) console.error('Error:', error)
                  
                  localStorage.removeItem('supabase.auth.token')
                  localStorage.removeItem('sb-token')
                  sessionStorage.clear()
                  
                  // Save current email to list
                  if (user?.email) {
                    const saved = localStorage.getItem('saved_google_accounts')
                    let accounts: string[] = saved ? JSON.parse(saved) : []
                    if (!accounts.includes(user.email)) {
                      accounts.push(user.email)
                    }
                    localStorage.setItem('saved_google_accounts', JSON.stringify(accounts))
                    console.log('💾 Saved:', accounts)
                  }
                  
                  onLogout?.()
                  
                  // Load saved accounts and show chooser
                  const saved = localStorage.getItem('saved_google_accounts')
                  const accounts = saved ? JSON.parse(saved) : []
                  setSavedAccounts(accounts)
                  setView('chooser')
                } catch (err) {
                  console.error('Error:', err)
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
            >
              <Chrome size={20} />
              Dùng Tài Khoản Khác
            </button>

            <p className="text-center text-xs text-gray-500">
              Bạn đang đăng nhập bằng Google
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ===== ACCOUNT CHOOSER VIEW =====
  if (view === 'chooser') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold">Chọn Tài Khoản</h2>
            <button
              onClick={() => {
                console.log('❌ Close button clicked (chooser)')
                setView('login')
              }}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded p-1 transition-colors"
              type="button"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-3">
            {/* Saved Accounts */}
            {savedAccounts.length > 0 && (
              <>
                <p className="text-sm text-gray-600 mb-3">Chọn tài khoản của bạn</p>
                {savedAccounts.map((email) => (
                  <button
                    key={email}
                    onClick={async () => {
                      try {
                        console.log(`🔄 Signing in with ${email}...`)
                        setLoading(true)
                        
                        const { error } = await supabase.auth.signInWithOAuth({
                          provider: 'google',
                        })

                        if (error) console.error('Error:', error)
                      } catch (err) {
                        console.error('Error:', err)
                      } finally {
                        setLoading(false)
                      }
                    }}
                    disabled={loading}
                    className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
                      <User size={20} />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{email}</p>
                    </div>
                  </button>
                ))}
                <div className="border-t pt-3 mt-3" />
              </>
            )}

            {/* Add New Account */}
            <button
              onClick={async () => {
                try {
                  console.log('🔄 Opening Google account chooser...')
                  setLoading(true)
                  
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                  })

                  if (error) console.error('Error:', error)
                } catch (err) {
                  console.error('Error:', err)
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Plus size={20} className="text-gray-600" />
              <span className="font-semibold text-gray-700">Sử dụng tài khoản khác</span>
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Bạn sẽ được chuyển đến Google để chọn hoặc tạo tài khoản
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
