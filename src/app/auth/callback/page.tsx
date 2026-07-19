import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/services/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase tự động xử lý callback
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth error:', error)
          router.push('/login?error=' + error.message)
          return
        }

        if (data.session) {
          // Đăng nhập thành công
          console.log('User:', data.session.user)
          router.push('/')
        } else {
          router.push('/login')
        }
      } catch (err) {
        console.error('Callback error:', err)
        router.push('/login')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Đang xác thực...</p>
      </div>
    </div>
  )
}
