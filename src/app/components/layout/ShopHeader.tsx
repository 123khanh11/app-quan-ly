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
      {/* Top Info Bar - Dark Blue */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-2 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-6">
            {shopInfo?.phone && (
              <a href={`tel:${shopInfo.phone}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span>📞</span>
                <span>{shopInfo.phone}</span>
              </a>
            )}
            {shopInfo?.email && (
              <a href={`mailto:${shopInfo.email}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity hidden md:flex">
                <span>✉️</span>
                <span>{shopInfo.email}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b-4 border-blue-600 py-3 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo/Shop Name */}
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity flex-shrink-0">
            {shopInfo?.logo_url ? (
              <img src={shopInfo.logo_url} alt={shopInfo.shop_name} className="h-16 w-auto object-contain" />
            ) : (
              <div>
                <div className="text-2xl font-bold text-blue-900">{shopInfo?.shop_name}</div>
                <div className="text-xs text-orange-600 font-semibold">Machine</div>
              </div>
            )}
          </a>

          {/* Address Info - Hidden on mobile */}
          <div className="text-sm text-gray-700 flex items-center gap-2 hidden md:flex flex-1 mx-6">
            <span>📍</span>
            <div>
              <div className="font-semibold text-gray-900">{shopInfo?.address}</div>
              <div className="text-xs text-gray-600">{shopInfo?.ward}, {shopInfo?.district}, {shopInfo?.city}</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex gap-2 flex-shrink-0">
          </div>
        </div>
      </div>

      {/* Navigation Bar - Orange */}
      <nav className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex gap-8 text-sm font-semibold overflow-x-auto">
          <a href="/" className="hover:opacity-90 transition-opacity whitespace-nowrap">Trang chủ</a>
          <a href="/products" className="hover:opacity-90 transition-opacity whitespace-nowrap">Sản phẩm nổi bật</a>
          <a href="/categories" className="hover:opacity-90 transition-opacity whitespace-nowrap">Danh mục</a>
          <a href="/promotions" className="hover:opacity-90 transition-opacity whitespace-nowrap">Khuyến mãi</a>
          <a href="/contact" className="hover:opacity-90 transition-opacity whitespace-nowrap">Liên hệ</a>
        </div>
      </nav>
    </div>
  )
}
