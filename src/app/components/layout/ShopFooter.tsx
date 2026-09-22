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
  description?: string
}

export function ShopFooter() {
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null)

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
      }
    }

    loadShopInfo()
  }, [])

  if (!shopInfo) return null

  return (
    <footer className="bg-gray-900 text-gray-300 py-6 md:py-8 px-2 md:px-4 mt-8 md:mt-12 w-full">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* About */}
        <div>
          <h3 className="text-white font-bold text-lg mb-3">{shopInfo.shop_name}</h3>
          <p className="text-sm leading-relaxed mb-4">{shopInfo.description}</p>
          <div className="space-y-2 text-sm">
            <p>📍 {shopInfo.address}</p>
            <p>{shopInfo.ward}, {shopInfo.district}, {shopInfo.city}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-bold text-lg mb-3">Liên hệ</h3>
          <div className="space-y-2 text-sm">
            {shopInfo.phone && (
              <p>
                📞 <a href={`tel:${shopInfo.phone}`} className="hover:text-white">
                  {shopInfo.phone}
                </a>
              </p>
            )}
            {shopInfo.zalo && (
              <p>
                💬 <a href={`https://zalo.me/${shopInfo.zalo}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Zalo: {shopInfo.zalo}
                </a>
              </p>
            )}
            {shopInfo.email && (
              <p>
                ✉️ <a href={`mailto:${shopInfo.email}`} className="hover:text-white">
                  {shopInfo.email}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
        <p>© 2026 {shopInfo.shop_name}. Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  )
}
