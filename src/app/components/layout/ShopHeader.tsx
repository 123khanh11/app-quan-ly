'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/services/supabase'
import Link from 'next/link'

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
      {/* Top Info Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-6 text-sm">
            {shopInfo?.phone && (
              <a href={`tel:${shopInfo.phone}`} className="flex items-center gap-2 hover:opacity-80">
                <span>📞</span>
                <span>{shopInfo.phone}</span>
              </a>
            )}
            {shopInfo?.zalo && (
              <a href={`https://zalo.me/${shopInfo.zalo}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80">
                <span>💬</span>
                <span>Zalo: {shopInfo.zalo}</span>
              </a>
            )}
            {shopInfo?.email && (
              <a href={`mailto:${shopInfo.email}`} className="flex items-center gap-2 hover:opacity-80">
                <span>✉️</span>
                <span>{shopInfo.email}</span>
              </a>
            )}
          </div>
          <div className="flex items-center gap-4">
            {shopInfo?.facebook_url && (
              <a href={shopInfo.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <span>f</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo/Shop Name */}
          <Link href="/" className="flex items-center gap-3">
            {shopInfo?.logo_url ? (
              <img src={shopInfo.logo_url} alt={shopInfo.shop_name} className="h-12 w-auto" />
            ) : (
              <div className="text-2xl font-bold text-orange-500">{shopInfo?.shop_name}</div>
            )}
          </Link>

          {/* Address Info */}
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <span>📍</span>
            <div>
              <div className="font-semibold text-gray-800">{shopInfo?.address}</div>
              <div>{shopInfo?.ward}, {shopInfo?.district}, {shopInfo?.city}</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-semibold text-sm">
              Liên hệ
            </button>
            <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 font-semibold text-sm">
              Về chúng tôi
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex gap-6 text-sm font-semibold overflow-x-auto">
          <Link href="/" className="hover:opacity-80 whitespace-nowrap">Trang chủ</Link>
          <Link href="/products" className="hover:opacity-80 whitespace-nowrap">Sản phẩm nổi bật</Link>
          <Link href="/categories" className="hover:opacity-80 whitespace-nowrap">Danh mục</Link>
          <Link href="/promotions" className="hover:opacity-80 whitespace-nowrap">Khuyến mãi</Link>
          <Link href="/contact" className="hover:opacity-80 whitespace-nowrap">Liên hệ</Link>
        </div>
      </nav>
    </div>
  )
}
