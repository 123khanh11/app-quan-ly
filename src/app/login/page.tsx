'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/services/supabase'
import { GoogleLogin } from '@/app/components/auth/GoogleLogin'
import { LogOut } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const error = searchParams.get('error')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (data.session) {
          setUser(data.session.user)
        }
      } catch (err) {
        console.error('Error checking auth:', err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Subscribe to auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user)
        if (event === 'SIGNED_IN') {
          router.push('/')
        }
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription?.subscription.unsubscribe()
    }
  }, [router])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  // If user is logged in
  if (user) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">✅ Đã đăng nhập</h1>

            {user.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
            )}

            <div className="space-y-2 mb-6 text-left">
              <p>
                <span className="text-muted-foreground">Tên:</span>
                <br />
                <span className="font-semibold">{user.user_metadata?.full_name || user.email}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>
                <br />
                <span className="font-semibold">{user.email}</span>
              </p>
              <p>
                <span className="text-muted-foreground">ID:</span>
                <br />
                <span className="font-mono text-sm">{user.id}</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push('/')}
                className="flex-1 bg-primary text-primary-foreground font-semibold py-2 rounded hover:bg-orange-600 transition-colors"
              >
                Về Trang Chủ
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 border border-border text-foreground font-semibold py-2 rounded hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Đăng Xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Login form
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Đăng Nhập</h1>
          <p className="text-center text-muted-foreground mb-6">Đăng nhập để tiếp tục mua sắm</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              ❌ Lỗi: {error}
            </div>
          )}

          <GoogleLogin />

          <p className="text-center text-xs text-muted-foreground mt-6">
            Chúng tôi chỉ nhận email từ Google. Không yêu cầu mật khẩu.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-primary hover:underline"
          >
            ← Quay Về Trang Chủ
          </button>
        </div>
      </div>
    </div>
  )
}
