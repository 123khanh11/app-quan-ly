'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/services/supabase'
import { ShopHeader } from '@/app/components/layout/ShopHeader'
import { Copy, Check, ChevronLeft } from 'lucide-react'

interface ProductDetailProps {
  productId: string
  onClose?: () => void
}

export function ProductDetail({ productId, onClose }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Load product
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setError('Product ID not found')
        return
      }
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) throw new Error('Failed to load product')
        const data = await response.json()
        setProduct(data.product)
      } catch (err) {
        console.error('Error loading product:', err)
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [productId])

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?product=${productId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGoBack = () => {
    if (onClose) {
      onClose()
    } else {
      window.history.back()
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <ShopHeader />
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-primary hover:text-orange-600 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          Quay lại
        </button>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">⏳ Đang tải sản phẩm...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">❌ {error}</p>
            <button
              onClick={handleGoBack}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600"
            >
              Về trang chủ
            </button>
          </div>
        ) : product ? (
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {product.name}
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    {product.description}
                  </p>
                </div>

                {/* Price */}
                <div className="border-t border-b border-border py-4">
                  <p className="text-sm text-muted-foreground mb-1">Giá</p>
                  <p className="text-4xl font-bold text-primary">
                    {product.price.toLocaleString('vi-VN')}đ
                  </p>
                </div>

                {/* SKU */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mã SKU</p>
                  <p className="font-mono text-foreground">{product.sku}</p>
                </div>

                {/* Share Link */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <p className="font-semibold text-blue-900">
                    📱 Link Chia Sẻ Quảng Cáo
                  </p>
                  <div className="flex gap-2 flex-col md:flex-row">
                    <input
                      type="text"
                      value={`${window.location.origin}/?product=${productId}`}
                      readOnly
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-white font-mono text-sm"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check size={18} />
                          Đã copy
                        </>
                      ) : (
                        <>
                          <Copy size={18} />
                          Copy Link
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-blue-700">
                    ✓ Bạn có thể chia sẻ link này trên Facebook, Tiktok, hay các nền tảng khác để quảng cáo sản phẩm
                  </p>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleGoBack}
                  className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Xem Chi Tiết & Thêm Vào Giỏ
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
