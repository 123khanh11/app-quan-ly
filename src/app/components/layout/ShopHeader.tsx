'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/services/supabase'

interface ShopInfo {
  id: string
  shop_name: string
  phone: string
  zalo: string
  address: string
  city: string
  district: string
  ward: string
  email?: string
  facebook_url?: string
  logo_url?: string
  description?: string
}

export function ShopHeader() {
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadShopInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('shop_info')
          .select('*')
          .limit(1)
          .single()

        if (error) throw error
        setShopInfo(data)
      } catch (err) {
        console.error('Error loading shop info:', err)
      } finally {
        setLoading(false)
      }
    }

    loadShopInfo()
  }, [])

  if (loading) return null

  return (
    <div className="w-full">
      {/* Top Blue Bar - with icons */}
      <div className="bg-blue-900 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-6">
          <div className="flex items-center gap-8 text-sm">
            {shopInfo?.phone && (
              <a href={`tel:${shopInfo.phone}`} className="flex items-center gap-2 hover:opacity-80">
                <span>☎</span>
                <span>{shopInfo.phone}</span>
              </a>
            )}
          </div>
          <div className="flex items-center gap-8">
            <a href="/" className="flex flex-col items-center gap-1 hover:opacity-80 text-xs">
              <span className="text-xl">🏠</span>
              <span>Cửa Hàng</span>
            </a>
            <a href="/" className="flex flex-col items-center gap-1 hover:opacity-80 text-xs">
              <span className="text-xl">❤️</span>
              <span>Yêu thích</span>
            </a>
            <a href="/" className="flex flex-col items-center gap-1 hover:opacity-80 text-xs">
              <span className="text-xl">🛒</span>
              <span>Giỏ hàng</span>
            </a>
            <a href="/" className="flex flex-col items-center gap-1 hover:opacity-80 text-xs">
              <span className="text-xl">👤</span>
              <span>Tài khoản</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header - Logo + Search */}
      <div className="bg-blue-900 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            {shopInfo?.logo_url ? (
              <img src={shopInfo.logo_url} alt={shopInfo?.shop_name} className="h-14 w-auto object-contain" />
            ) : (
              <div className="text-white font-bold text-sm">
                {shopInfo?.shop_name || 'Shop'}
              </div>
            )}
          </a>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center bg-white rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="flex-1 px-3 py-2 text-sm text-gray-800 outline-none"
              />
              <button className="px-4 py-2 bg-blue-700 text-white font-semibold text-sm hover:bg-blue-800">
                Tìm
              </button>
            </div>
          </div>

          {/* Icons - Right */}
          <div className="flex-shrink-0">
          </div>
        </div>
      </div>

      {/* Navigation Bar - Blue */}
      <nav className="bg-blue-800 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex gap-8 text-sm font-semibold overflow-x-auto">
          <a href="/" className="hover:opacity-90 whitespace-nowrap">Sản phẩm mới</a>
          <a href="/" className="hover:opacity-90 whitespace-nowrap">Hàng Bán Chạy</a>
          <a href="/" className="hover:opacity-90 whitespace-nowrap">PHỤ TÙNG XE MÁY</a>
          <a href="/" className="hover:opacity-90 whitespace-nowrap">MÁY NÔNG NGHIỆP</a>
          <a href="/" className="hover:opacity-90 whitespace-nowrap">BẢO DƯỠNG</a>
          <a href="/" className="hover:opacity-90 whitespace-nowrap">Liên hệ</a>
        </div>
      </nav>

      {/* Orange Banner */}
      <div className="bg-orange-500 text-white py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto text-sm font-semibold">
          KHÁM PHÁ CÁC GIẢI PHÁP PHỤ TÙNG XE MÁY & NÔNG NGHIỆP CỦA CHÚNG TÔI
        </div>
      </div>
    </div>
  )
}
