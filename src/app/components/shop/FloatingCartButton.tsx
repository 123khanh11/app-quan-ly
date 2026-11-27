'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/app/context/CartContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export function FloatingCartButton() {
  const { cartItems } = useCart()
  const navigate = useNavigate()
  const [isClient, setIsClient] = useState(false)

  // Only render on client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Don't render on server or if no items
  if (!isClient || totalItems === 0) {
    return null
  }

  return (
    <button
      onClick={() => navigate('/cart')}
      className="fixed bottom-6 right-6 md:hidden z-40 w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center group"
      title="Xem giỏ hàng"
      aria-label={`Giỏ hàng: ${totalItems} sản phẩm`}
    >
      {/* Giỏ hàng icon */}
      <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />

      {/* Badge đếm số lượng */}
      {totalItems > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          {totalItems > 99 ? '99+' : totalItems}
        </div>
      )}

      {/* Pulsing ring effect */}
      <div className="absolute inset-0 rounded-full border-2 border-orange-300 animate-pulse opacity-50"></div>
    </button>
  )
}
