'use client'

import { useEffect, useState } from 'react'
import { supabase, getProductsByCategory, getProductDetails, ProductDetail } from '@/services/supabase'
import { promotionService, ProductPromotion } from '@/services/promotionService'
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import { useCart } from '@/app/context/CartContext'
import { useNavigate } from 'react-router-dom'
import { trackAddToCart } from '@/utils/facebookPixel'
import { VariantModal } from './VariantModal'

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
  onNavigate?: (page: string) => void
}

export function ProductDetailPage({ productId, onBack, onNavigate }: ProductDetailPageProps) {
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ProductDetail['variants'][0] | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [similarProducts, setSimilarProducts] = useState<any[]>([])
  const [selectedVariantForModal, setSelectedVariantForModal] = useState<ProductDetail['variants'][0] | null>(null)
  const [promotions, setPromotions] = useState<ProductPromotion[]>([])
  const [currentPromo, setCurrentPromo] = useState<ProductPromotion | null>(null)
  const [finalPrice, setFinalPrice] = useState(0)
  const { addToCart } = useCart()
  const navigate = useNavigate()

  // Get current display images:
  // - If variant selected: show only that variant's images
  // - If no variant selected: show all variant images (from all variants combined)
  // - Fallback to product images
  const displayImages = selectedVariant?.images && selectedVariant.images.length > 0 
    ? selectedVariant.images 
    : product?.allVariantImages && product.allVariantImages.length > 0
      ? product.allVariantImages
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

        // Load promotions for this product
        const promos = await promotionService.getProductPromotions(productData.product_id)
        setPromotions(promos)

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

  // Update promotion and final price when quantity or variant changes
  useEffect(() => {
    if (!product || !selectedVariant) return

    // Calculate applicable promotion
    const promo = promotionService.calculatePromotion(promotions, quantity)
    setCurrentPromo(promo)

    // Calculate final price
    const price = selectedVariant.variant_price || product.product_price || 0
    const discountedPrice = promotionService.calculateDiscountedPrice(price, promo)
    setFinalPrice(discountedPrice)
  }, [quantity, promotions, product, selectedVariant])

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) {
      alert('Vui lòng chọn một variant')
      return
    }

    const weightInGrams = (selectedVariant.weight_kg ?? 0.5) * 1000
    
    console.log('🛒 [AddToCart] Selected variant:', {
      variant_id: selectedVariant.variant_id,
      product_name: product.product_name,
      weight_kg_raw: selectedVariant.weight_kg,
      weight_grams: weightInGrams,
      length_cm: selectedVariant.length_cm,
      width_cm: selectedVariant.width_cm,
      height_cm: selectedVariant.height_cm,
      quantity,
    })

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
      weight: weightInGrams, // Convert kg to gram (default 0.5kg = 500g)
      length: selectedVariant.length_cm ?? 20,
      width: selectedVariant.width_cm ?? 20,
      height: selectedVariant.height_cm ?? 20,
    })

    // Track AddToCart event for Meta Pixel
    await trackAddToCart({
      content_name: product.product_name,
      content_type: 'product',
      content_ids: [selectedVariant.variant_id],
      value: (selectedVariant.variant_price || product.product_price) * quantity,
      currency: 'VND',
      quantity: quantity,
      color: selectedVariant.color,
      size: selectedVariant.size,
    })

    alert(`✅ Đã thêm "${product.product_name}" vào giỏ hàng`)
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
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
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600"
            >
              ← Quay lại trang chủ
            </button>
          </div>
        ) : product ? (
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            {/* 1. Product Title */}
            <h1 className="text-3xl font-bold text-foreground">
              {product.product_name}
            </h1>

            {/* 2. Current Promotion Badge */}
            {currentPromo && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {currentPromo.promotion_type === 'free_shipping' && '📦'}
                    {currentPromo.promotion_type === 'percentage_discount' && '💰'}
                    {currentPromo.promotion_type === 'fixed_discount' && '💵'}
                  </span>
                  <div>
                    <p className="font-bold text-primary text-lg">
                      {promotionService.getPromoLabel(currentPromo)}
                    </p>
                    {currentPromo.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {currentPromo.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. All Available Promotions */}
            {promotions.length > 0 && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h3 className="font-bold text-green-700 mb-2">⚡ Các Khuyến Mại Khả Dụng</h3>
                <ul className="space-y-2">
                  {promotions.map((promo) => (
                    <li key={promo.id} className="text-sm text-green-800">
                      <span className="font-semibold">Mua từ {promo.min_quantity} sản phẩm:</span>
                      <span className="ml-2">{promotionService.getPromoLabel(promo)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 5. Mobile-only Price */}
            <div className="border-t border-b border-border py-4 md:hidden space-y-2">
              <p className="text-sm text-muted-foreground mb-1">Giá</p>
              {currentPromo && currentPromo.promotion_type !== 'free_shipping' && (
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl line-through text-muted-foreground">
                    {(selectedVariant?.variant_price || product.product_price || 0).toLocaleString('vi-VN')}đ
                  </p>
                  <p className="text-4xl font-bold text-primary">
                    {finalPrice.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              )}
              {!currentPromo || currentPromo.promotion_type === 'free_shipping' ? (
                <p className="text-4xl font-bold text-primary">
                  {(selectedVariant?.variant_price || product.product_price || 0).toLocaleString('vi-VN')}đ
                </p>
              ) : null}
            </div>



            {/* 4. Image + Desktop Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Product Image */}
              <div>
                <div className="aspect-square bg-white rounded-lg overflow-hidden flex items-center justify-center relative group border border-border">
                  <img
                    src={
                      displayImages && displayImages.length > 0
                        ? displayImages[selectedImageIndex]?.image_url
                        : selectedVariant?.variant_image || product.product_image
                    }
                    alt={product.product_name}
                    className="w-full h-full object-contain hover:scale-110 transition-transform duration-300"
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
              </div>

              {/* Right Column: Description, Desktop Price, Desktop Variants */}
              <div className="space-y-6">
                {/* Description */}
                {(selectedVariant?.description || product.description) && (
                  <div 
                    className="text-base text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: selectedVariant?.description || product.description || ''
                    }}
                  />
                )}

                {/* Desktop-only Price */}
                <div className="border-t border-b border-border py-4 hidden md:block space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">Giá</p>
                  {currentPromo && currentPromo.promotion_type !== 'free_shipping' && (
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-3">
                        <p className="text-2xl line-through text-muted-foreground">
                          {(selectedVariant?.variant_price || product.product_price || 0).toLocaleString('vi-VN')}đ
                        </p>
                        <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">
                          -{Math.round(((selectedVariant?.variant_price || product.product_price || 0) - finalPrice) / (selectedVariant?.variant_price || product.product_price || 0) * 100)}%
                        </span>
                      </div>
                      <p className="text-4xl font-bold text-primary">
                        {finalPrice.toLocaleString('vi-VN')}đ
                      </p>
                      <p className="text-sm text-green-600 font-semibold">
                        💰 Tiết kiệm: {((selectedVariant?.variant_price || product.product_price || 0) - finalPrice).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  )}
                  {!currentPromo || currentPromo.promotion_type === 'free_shipping' ? (
                    <p className="text-4xl font-bold text-primary">
                      {(selectedVariant?.variant_price || product.product_price || 0).toLocaleString('vi-VN')}đ
                    </p>
                  ) : null}
                </div>

                {/* Variants Selector - Visible on all screen sizes */}
                {product.variants.length > 0 && (
                  <div className="space-y-4 w-full overflow-visible">
                    <h3 className="font-bold text-foreground">Chọn Loại Sản Phẩm</h3>
                    <p className="text-xs text-muted-foreground">(Tổng {product.variants.length} variants)</p>
                    
                    {/* Color Variants */}
                    {product.variants.some(v => v.color) && (
                      <div>
                        <p className="text-sm font-semibold mb-2">Màu Sắc</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {[...new Set(product.variants.map(v => v.color).filter(Boolean))].map((color, idx) => {
                            const variant = product.variants.find(v => v.color === color && (v.size === selectedVariant?.size || !selectedVariant?.size))
                            return (
                              <button
                                key={`color-${color}-${idx}`}
                                onClick={() => {
                                  if (variant) {
                                    setSelectedVariant(variant)
                                    setSelectedImageIndex(0)
                                  }
                                }}
                                className={`px-6 py-3 rounded-lg border-2 transition-colors font-semibold text-base ${
                                  selectedVariant?.color === color
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary'
                                }`}
                              >
                                {color}
                              </button>
                            )
                          })}
                        </div>
                        {/* View All Colors Button */}
                        <button
                          onClick={() => {
                            const firstColorVariant = product.variants.find(v => v.color)
                            if (firstColorVariant) {
                              setSelectedVariantForModal(firstColorVariant)
                            }
                          }}
                          className="mt-2 text-sm text-primary hover:text-orange-600 font-semibold transition-colors"
                        >
                          Xem tất cả ›
                        </button>
                      </div>
                    )}

                    {/* Size Variants */}
                    {product.variants.some(v => v.size) && (
                      <div>
                        <p className="text-sm font-semibold mb-2">Kích Thước</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {[...new Set(product.variants.map(v => v.size).filter(Boolean))].map((size, idx) => {
                            const variant = product.variants.find(v => v.size === size && (v.color === selectedVariant?.color || !selectedVariant?.color))
                            return (
                              <button
                                key={`size-${size}-${idx}`}
                                onClick={() => {
                                  if (variant) {
                                    setSelectedVariant(variant)
                                    setSelectedImageIndex(0)
                                  }
                                }}
                                className={`px-6 py-3 rounded-lg border-2 transition-colors font-semibold text-base ${
                                  selectedVariant?.size === size
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary'
                                }`}
                              >
                                {size}
                              </button>
                            )
                          })}
                        </div>
                        {/* View All Sizes Button */}
                        <button
                          onClick={() => {
                            const firstSizeVariant = product.variants.find(v => v.size)
                            if (firstSizeVariant) {
                              setSelectedVariantForModal(firstSizeVariant)
                            }
                          }}
                          className="mt-2 text-sm text-primary hover:text-orange-600 font-semibold transition-colors"
                        >
                          Xem tất cả ›
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 5. Quantity Selector */}
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

            {/* 6. Action Buttons - Add to Cart + Buy Now */}
            <div className="grid grid-cols-2 gap-3">
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="bg-muted text-foreground font-bold py-3 rounded-lg hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:inline">Thêm Vào Giỏ</span>
                <span className="sm:hidden">Giỏ</span>
              </button>

              {/* Buy Now Button */}
              <button
                onClick={() => {
                  handleAddToCart()
                  setTimeout(() => onNavigate?.('checkout'), 500)
                }}
                className="bg-primary text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <span className="hidden sm:inline">🛍️ Mua Ngay</span>
                <span className="sm:hidden">Mua</span>
              </button>
            </div>

            {/* 7. Quick Checkout Summary - Mobile Only */}
            {selectedVariant && (
              <div className="md:hidden bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg p-4 space-y-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">Thanh toán nhanh</p>
                  
                  {/* Price per item */}
                  <p className="text-2xl font-bold text-primary">
                    {finalPrice.toLocaleString('vi-VN')}đ/cái
                  </p>
                  
                  {/* Quantity total */}
                  <p className="text-sm text-muted-foreground mt-1">
                    x {quantity} = {(finalPrice * quantity).toLocaleString('vi-VN')}đ
                  </p>

                  {/* Discount display */}
                  {currentPromo && currentPromo.promotion_type !== 'free_shipping' && (
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      💰 Tiết kiệm: {((selectedVariant?.variant_price || product.product_price || 0) - finalPrice).toLocaleString('vi-VN')}đ/cái
                    </p>
                  )}

                  {/* Shipping fee */}
                  <div className="border-t border-orange-200 mt-3 pt-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Phí ship:</span>
                      {currentPromo?.promotion_type === 'free_shipping' ? (
                        <span className="text-green-600 font-bold">Miễn phí 📦</span>
                      ) : (
                        <span>40,000đ</span>
                      )}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="text-center mt-2">
                    <p className="text-xs text-muted-foreground">Tổng cộng:</p>
                    <p className="text-2xl font-bold text-primary">
                      {(finalPrice * quantity + (currentPromo?.promotion_type === 'free_shipping' ? 0 : 40000)).toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded p-2 text-center text-sm text-muted-foreground border border-orange-200">
                  <p>{selectedVariant.color ? `Màu: ${selectedVariant.color}` : ''} {selectedVariant.size ? `| Kích: ${selectedVariant.size}` : ''}</p>
                </div>
              </div>
            )}


          </div>
        ) : null}
      </div>

      {/* Variant Modal */}
      <VariantModal
        variant={selectedVariantForModal}
        products={
          selectedVariantForModal
            ? product?.variants
                .filter(
                  v =>
                    (selectedVariantForModal.color && v.color === selectedVariantForModal.color) ||
                    (selectedVariantForModal.size && v.size === selectedVariantForModal.size)
                )
                .map(v => ({
                  sku: v.sku,
                  color: v.color,
                  size: v.size,
                  price: v.variant_price || product?.product_price || 0,
                  stock: v.stock,
                })) || []
            : []
        }
        isOpen={!!selectedVariantForModal}
        onClose={() => setSelectedVariantForModal(null)}
      />
    </div>
  )
}
