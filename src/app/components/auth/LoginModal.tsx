import { useState, useEffect } from 'react'
import { X, Chrome, Loader } from 'lucide-react'
import { supabase } from '@/services/supabase'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle OAuth callback
  useEffect(() => {
    const handleAuthChange = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
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
  }, [onClose])

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Đăng Nhập</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
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
