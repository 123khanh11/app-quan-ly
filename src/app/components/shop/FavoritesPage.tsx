'use client'

import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useFavorites } from '@/app/context/FavoritesContext'
import { useCart } from '@/app/context/CartContext'

export function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites()
  const { addToCart } = useCart()

  const handleAddToCart = (product: any) => {
    addToCart({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      sku: product.sku,
      variant_id: product.product_id,
      quantity: 1,
    })
    alert('✅ Thêm vào giỏ hàng thành công!')
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background w-full flex items-center justify-center">
        <div className="text-center">
          <Heart size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <h1 className="text-2xl font-bold mb-2">❤️ Danh Sách Yêu Thích Trống</h1>
          <p className="text-muted-foreground mb-6">Hãy thêm sản phẩm yêu thích để xem ở đây!</p>
          <a href="/" className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-semibold hover:bg-orange-600 transition-colors">
            ← Tiếp Tục Mua Sắm
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background w-full py-8 px-2 md:px-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">❤️ Danh Sách Yêu Thích ({favorites.length})</h1>
          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="text-sm px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Xóa Hết
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {favorites.map((product) => (
            <div key={product.product_id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image */}
              {product.image_url && (
                <div className="aspect-square bg-muted overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                
                {product.sku && (
                  <p className="text-xs text-muted-foreground mb-2">SKU: {product.sku}</p>
                )}

                <div className="mb-4">
                  <p className="text-2xl font-bold text-primary">{product.price.toLocaleString('vi-VN')}đ</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-md font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    Thêm Giỏ
                  </button>
                  <button
                    onClick={() => removeFavorite(product.product_id)}
                    className="bg-red-100 text-red-600 p-2.5 rounded-md hover:bg-red-200 transition-colors"
                    title="Xóa khỏi yêu thích"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {product.created_at && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Thêm: {new Date(product.created_at).toLocaleDateString('vi-VN')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
