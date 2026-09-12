'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/services/supabase'
import { CategoryMenu } from '../shop/CategoryMenu'
import { Menu, X } from 'lucide-react'

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

export function ShopHeader({ onNavigate, onSelectCategory }: { onNavigate?: (page: string) => void; onSelectCategory?: (categoryId: string, categoryName: string) => void }) {
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      {/* Mobile: Header Row 1 - Logo + Hamburger + Icons */}
      <div className="bg-blue-950 text-white py-2 px-2 w-full md:hidden">
        <div className="flex items-center justify-between gap-2">
          {/* Logo - Mobile Small */}
          <a href="/" className="flex items-center flex-shrink-0">
            {shopInfo?.logo_url ? (
              <img src={shopInfo.logo_url} alt={shopInfo?.shop_name} className="h-12 w-auto object-contain" />
            ) : (
              <div className="text-white font-bold text-sm">
                {shopInfo?.shop_name || 'Shop'}
              </div>
            )}
          </a>

          {/* Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-blue-800 rounded transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Icons - RIGHT (Mobile) */}
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate?.('favorites')} className="flex flex-col items-center gap-0.5 hover:opacity-80 text-xs cursor-pointer">
              <span className="text-lg">❤️</span>
            </button>
            <button onClick={() => onNavigate?.('cart')} className="flex flex-col items-center gap-0.5 hover:opacity-80 text-xs cursor-pointer">
              <span className="text-lg">🛒</span>
            </button>
            <button onClick={() => onNavigate?.('account')} className="flex flex-col items-center gap-0.5 hover:opacity-80 text-xs cursor-pointer">
              <span className="text-lg">👤</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-900 text-white px-2 py-3 space-y-2 border-t border-blue-800">
          <a href="/" className="block py-2 px-2 hover:bg-blue-800 rounded text-sm font-semibold">
            Sản phẩm mới
          </a>
          <a href="/" className="block py-2 px-2 hover:bg-blue-800 rounded text-sm font-semibold">
            Hàng Bán Chạy
          </a>
          <a href="/" className="block py-2 px-2 hover:bg-blue-800 rounded text-sm font-semibold">
            Liên hệ
          </a>
          <div className="py-2 px-2 border-t border-blue-800">
            <CategoryMenu onSelectCategory={(id, name) => {
              onSelectCategory?.(id, name)
              setMobileMenuOpen(false)
            }} />
          </div>
        </div>
      )}

      {/* Mobile: Search Bar */}
      <div className="md:hidden bg-blue-950 text-white px-2 py-3 w-full">
        <div className="flex items-center bg-white rounded-md overflow-hidden">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="flex-1 px-3 py-2 text-sm text-gray-800 outline-none"
          />
          <button className="px-3 py-2 bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600">
            Tìm
          </button>
        </div>
      </div>

      {/* Desktop: Full Header */}
      <div className="hidden md:block bg-blue-950 text-white py-3 px-4 w-full">
        <div className="flex items-center justify-between gap-6 min-w-0">
          {/* Logo - Desktop */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0 min-w-0">
            {shopInfo?.logo_url ? (
              <img src={shopInfo.logo_url} alt={shopInfo?.shop_name} className="h-20 w-auto object-contain" />
            ) : (
              <div className="text-white font-bold text-lg">
                {shopInfo?.shop_name || 'Shop'}
              </div>
            )}
          </a>

          {/* Search Bar + Nav - CENTER */}
          <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
            {/* Search Bar */}
            <div className="w-full max-w-md">
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

            {/* Navigation Bar - Dynamic Categories */}
            <nav className="flex gap-6 text-xs font-semibold whitespace-nowrap">
              <a href="/" className="hover:opacity-90">Sản phẩm mới</a>
              <a href="/" className="hover:opacity-90">Hàng Bán Chạy</a>
              <CategoryMenu onSelectCategory={onSelectCategory || (() => {})} />
              <a href="/" className="hover:opacity-90">Liên hệ</a>
            </nav>
          </div>

          {/* Icons - RIGHT (Desktop) */}
          <div className="flex items-center gap-6 flex-shrink-0 min-w-0">
            <button onClick={() => onNavigate?.('favorites')} className="flex flex-col items-center gap-1 hover:opacity-80 text-xs cursor-pointer">
              <span className="text-xl">❤️</span>
              <span>Yêu thích</span>
            </button>
            <button onClick={() => onNavigate?.('cart')} className="flex flex-col items-center gap-1 hover:opacity-80 text-xs cursor-pointer">
              <span className="text-xl">🛒</span>
              <span>Giỏ hàng</span>
            </button>
            <button onClick={() => onNavigate?.('account')} className="flex flex-col items-center gap-1 hover:opacity-80 text-xs cursor-pointer">
              <span className="text-xl">👤</span>
              <span>Tài khoản</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orange Banner */}
      <div className="bg-orange-500 text-white py-2 px-2 md:px-4 w-full text-center">
        <div className="text-xs md:text-sm font-semibold">
          KHÁM PHÁ CÁC GIẢI PHÁP PHỤ TÙNG XE MÁY & NÔNG NGHIỆP CỦA CHÚNG TÔI
        </div>
      </div>
    </div>
  )
}
