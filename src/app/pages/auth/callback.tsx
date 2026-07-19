import { useEffect } from 'react'
import { supabase } from '@/services/supabase'

export default function AuthCallbackPage() {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase tự động xử lý callback
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth error:', error)
          window.location.href = '/login?error=' + encodeURIComponent(error.message)
          return
        }

        if (data.session) {
          // Đăng nhập thành công
          console.log('User:', data.session.user)
          window.location.href = '/'
        } else {
          window.location.href = '/login'
        }
      } catch (err) {
        console.error('Callback error:', err)
        window.location.href = '/login'
      }
    }

    handleCallback()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Đang xác thực...</p>
      </div>
    </div>
  )
}
