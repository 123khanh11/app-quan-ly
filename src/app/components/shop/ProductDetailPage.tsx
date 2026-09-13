'use client'

import { useEffect, useState } from 'react'
import { Product, supabase } from '@/services/supabase'
import { Copy, Check, ChevronLeft, ShoppingCart } from 'lucide-react'
import { useCart } from '@/app/context/CartContext'

interface ProductVariant {
  id: string
  product_id: string
  sku: string
  color?: string
  size?: string
  stock: number
  price: number
}

interface ProductDetailPageProps {
  productId: string
  onBack?: () => void
}

export function ProductDetailPage({ productId, onBack }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  // Load product and variants
  useEffect(() => {
    const loadProductData = async () => {
      if (!productId) {
        setError('Product ID not found')
        return
      }
      try {
        setLoading(true)
        
        // Load product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single()

        if (productError) throw new Error('Product not found')
        setProduct(productData)

        // Load variants
        const { data: variantsData, error: variantsError } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', productId)

        if (!variantsError && variantsData) {
          setVariants(variantsData)
          if (variantsData.length > 0) {
            setSelectedVariant(variantsData[0])
          }
        }
      } catch (err) {
        console.error('Error loading product:', err)
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    loadProductData()
  }, [productId])

  const handleCopyLink = () => {
    const url = `${window.location.origin}/products/${productId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAddToCart = () => {
    if (!product || !selectedVariant) {
      alert('Vui lòng chọn một variant')
      return
    }

    addToCart({
      product_id: product.id,
      variant_id: selectedVariant.id,
      name: product.name,
      price: selectedVariant.price,
      quantity,
      image_url: product.image_url,
      color: selectedVariant.color || '',
      size: selectedVariant.size || '',
      sku: selectedVariant.sku,
      weight: product.weight,
      length: product.length,
      width: product.width,
      height: product.height,
    })

    alert(`✅ Đã thêm "${product.name}" vào giỏ hàng`)
    if (onBack) onBack()
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={onBack}
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
              onClick={onBack}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600"
            >
              Về trang chủ
            </button>
          </div>
        ) : product ? (
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-6">
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
                    {(selectedVariant?.price || product?.price || 0).toLocaleString('vi-VN')}đ
                  </p>
                </div>

                {/* Variants Selection */}
                {variants.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-foreground">Chọn Loại Sản Phẩm</h3>
                    
                    {/* Color Variants */}
                    {variants.some(v => v.color) && (
                      <div>
                        <p className="text-sm font-semibold mb-2">Màu Sắc</p>
                        <div className="flex flex-wrap gap-2">
                          {[...new Set(variants.map(v => v.color).filter(Boolean))].map((color) => (
                            <button
                              key={color}
                              onClick={() => {
                                const variant = variants.find(v => v.color === color)
                                if (variant) setSelectedVariant(variant)
                              }}
                              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                                selectedVariant?.color === color
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Size Variants */}
                    {variants.some(v => v.size) && (
                      <div>
                        <p className="text-sm font-semibold mb-2">Kích Thước</p>
                        <div className="flex flex-wrap gap-2">
                          {[...new Set(variants.map(v => v.size).filter(Boolean))].map((size) => (
                            <button
                              key={size}
                              onClick={() => {
                                const variant = variants.find(v => v.size === size)
                                if (variant) setSelectedVariant(variant)
                              }}
                              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                                selectedVariant?.size === size
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Quantity */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Số Lượng</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 border border-border rounded-lg hover:bg-muted"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 px-3 py-2 border border-border rounded-lg text-center"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 border border-border rounded-lg hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Share Link */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <p className="font-semibold text-blue-900">
                    📱 Link Chia Sẻ Quảng Cáo
                  </p>
                  <div className="flex gap-2 flex-col md:flex-row">
                    <input
                      type="text"
                      value={`${window.location.origin}/products/${productId}`}
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
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Thêm Vào Giỏ Hàng
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
