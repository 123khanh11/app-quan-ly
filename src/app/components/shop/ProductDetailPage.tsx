'use client'

import { useEffect, useState } from 'react'
import { supabase, getProductsByCategory, getProductDetails, ProductDetail } from '@/services/supabase'
import { Copy, Check, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import { useCart } from '@/app/context/CartContext'
import { useNavigate } from 'react-router-dom'

interface ProductVariant {
  id: string
  product_id: string
  sku: string
  color?: string
  size?: string
  stock: number
  price: number
  image_url?: string
}

interface ProductDetailPageProps {
  productId: string
  onBack?: () => void
}

export function ProductDetailPage({ productId, onBack }: ProductDetailPageProps) {
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<ProductDetail['variants'][0] | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [similarProducts, setSimilarProducts] = useState<any[]>([])
  const { addToCart } = useCart()
  const navigate = useNavigate()

  // Get current display images - either variant images or product images
  const displayImages = selectedVariant?.images && selectedVariant.images.length > 0 
    ? selectedVariant.images 
    : product?.product_images && product.product_images.length > 0 
      ? product.product_images 
      : []

  // Load product and variants
  useEffect(() => {
    const loadProductData = async () => {
      if (!productId) {
        setError('Product ID not found')
        return
      }
      try {
        setLoading(true)
        
        // Load product with full details including images
        const productData = await getProductDetails(productId)
        if (!productData) {
          throw new Error('Product not found')
        }
        
        setProduct(productData)
        if (productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0])
        }

        // Load similar products (same category)
        if (productData.category_id) {
          const similar = await getProductsByCategory(productData.category_id, productId)
          setSimilarProducts(similar)
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
      product_id: product.product_id,
      variant_id: selectedVariant.variant_id,
      name: product.product_name,
      price: selectedVariant.variant_price || product.product_price,
      quantity,
      image_url: selectedVariant.variant_image || product.product_image,
      color: selectedVariant.color || '',
      size: selectedVariant.size || '',
      sku: selectedVariant.sku,
    })

    alert(`✅ Đã thêm "${product.product_name}" vào giỏ hàng`)
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
            <p className="text-red-500 mb-4">❌ {error}</p>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600"
            >
              ← Quay lại trang chủ
            </button>
          </div>
        ) : product ? (
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image with Navigation */}
              <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center relative group">
                <img
                  src={
                    displayImages && displayImages.length > 0
                      ? displayImages[selectedImageIndex]?.image_url
                      : selectedVariant?.variant_image || product.product_image
                  }
                  alt={product.product_name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                
                {/* Navigation Buttons */}
                {displayImages && displayImages.length > 1 && (
                  <>
                    {/* Previous Button */}
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      title="Ảnh trước"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    
                    {/* Next Button */}
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      title="Ảnh tiếp"
                    >
                      <ChevronRight size={24} />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2.5 py-1 rounded-full text-sm font-medium">
                      {selectedImageIndex + 1} / {displayImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Title & Description */}
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-3">
                    {product.product_name}
                  </h1>
                  <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>

                {/* Price */}
                <div className="border-t border-b border-border py-4">
                  <p className="text-sm text-muted-foreground mb-1">Giá</p>
                  <p className="text-4xl font-bold text-primary">
                    {(selectedVariant?.variant_price || product.product_price || 0).toLocaleString('vi-VN')}đ
                  </p>
                </div>

                {/* Variants Selection */}
                {product.variants.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-foreground">Chọn Loại Sản Phẩm</h3>
                    
                    {/* Color Variants */}
                    {product.variants.some(v => v.color) && (
                      <div>
                        <p className="text-sm font-semibold mb-2">Màu Sắc</p>
                        <div className="flex flex-wrap gap-2">
                          {[...new Set(product.variants.map(v => v.color).filter(Boolean))].map((color) => (
                            <button
                              key={color}
                              onClick={() => {
                                const variant = product.variants.find(v => v.color === color && v.size === selectedVariant?.size)
                                if (variant) {
                                  setSelectedVariant(variant)
                                  setSelectedImageIndex(0)
                                }
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
                    {product.variants.some(v => v.size) && (
                      <div>
                        <p className="text-sm font-semibold mb-2">Kích Thước</p>
                        <div className="flex flex-wrap gap-2">
                          {[...new Set(product.variants.map(v => v.size).filter(Boolean))].map((size) => (
                            <button
                              key={size}
                              onClick={() => {
                                const variant = product.variants.find(v => v.size === size && v.color === selectedVariant?.color)
                                if (variant) {
                                  setSelectedVariant(variant)
                                  setSelectedImageIndex(0)
                                }
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

            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <div className="border-t border-border pt-6 mt-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Sản Phẩm Tương Tự</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                  {similarProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                      onClick={() => {
                        console.log('Navigating to product:', product.id)
                        navigate(`/products/${product.id}`)
                      }}
                    >
                      {/* Product Image */}
                      <div className="relative overflow-hidden aspect-[3/4] bg-muted">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-3">
                        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 text-sm leading-snug">
                          {product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {product.description}
                        </p>

                        {/* Price */}
                        <div className="mb-3">
                          <p className="text-lg font-bold text-primary">
                            {(product.price || 0).toLocaleString('vi-VN')}đ
                          </p>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart({
                              product_id: product.id,
                              variant_id: product.id,
                              name: product.name,
                              price: product.price,
                              quantity: 1,
                              image_url: product.image_url,
                              color: '',
                              size: '',
                              sku: product.sku || '',
                            })
                            alert(`✅ Đã thêm "${product.name}" vào giỏ hàng`)
                          }}
                          className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-md hover:bg-orange-600 transition-colors text-xs"
                        >
                          Thêm Vào Giỏ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
