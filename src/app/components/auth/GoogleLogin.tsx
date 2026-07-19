import { useState } from 'react'
import { Chrome, Loader } from 'lucide-react'
import { supabase } from '@/services/supabase'

export function GoogleLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signInError) {
        setError(signInError.message)
      }
    } catch (err) {
      console.error('Google login error:', err)
      setError(err instanceof Error ? err.message : 'Lỗi đăng nhập')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
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
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          ❌ {error}
        </div>
      )}
    </div>
  )
}
