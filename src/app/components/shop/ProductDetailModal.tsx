import { useState, useEffect } from 'react'
import { X, ShoppingCart, Heart } from 'lucide-react'
import { useCart } from '@/app/context/CartContext'
import { getProductDetails, ProductDetail } from '@/services/supabase'

interface ProductDetailModalProps {
  productId: string
  onClose: () => void
}

export function ProductDetailModal({ productId, onClose }: ProductDetailModalProps) {
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<typeof product extends ProductDetail ? ProductDetail['variants'][0] | null : null>(null)
  const [quantity, setQuantity] = useState(1)
  const [liked, setLiked] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const data = await getProductDetails(productId)
        setProduct(data)
        if (data?.variants.length > 0) {
          setSelectedVariant(data.variants[0])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi tải sản phẩm')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return

    addToCart({
      product_id: product.product_id,
      name: product.product_name,
      price: selectedVariant.variant_price || product.product_price,
      quantity,
      image_url: selectedVariant.variant_image || product.product_image,
    })

    alert('✅ Đã thêm vào giỏ hàng!')
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <p className="text-center">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <p className="text-center text-red-600">{error || 'Không tìm thấy sản phẩm'}</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-orange-600"
          >
            Đóng
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-foreground">{product.product_name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images */}
          <div className="flex flex-col gap-4">
            <div className="bg-muted rounded-lg overflow-hidden aspect-square">
              <img
                src={selectedVariant?.variant_image || product.product_image}
                alt={product.product_name}
                className="w-full h-full object-cover hover:scale-110 transition-transform"
              />
            </div>

            {/* Variant Images */}
            {product.variants.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.variant_id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`w-16 h-16 rounded-lg border-2 flex-shrink-0 overflow-hidden transition-all ${
                      selectedVariant?.variant_id === variant.variant_id
                        ? 'border-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <img
                      src={variant.variant_image || product.product_image}
                      alt={`${variant.color} - ${variant.size}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            {/* Category & Price */}
            <div>
              <p className="text-sm text-muted-foreground">{product.category_name}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold text-primary">
                  {(selectedVariant?.variant_price || product.product_price).toLocaleString()} VNĐ
                </span>
                {product.original_price > (selectedVariant?.variant_price || product.product_price) && (
                  <span className="text-lg text-muted-foreground line-through">
                    {product.original_price.toLocaleString()} VNĐ
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Mô tả</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Variants Selection */}
            {product.variants.length > 0 && selectedVariant && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Lựa chọn</h3>

                {/* Color */}
                {selectedVariant.color && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Màu sắc: <span className="font-bold">{selectedVariant.color}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(product.variants.map((v) => v.color))].map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            const variant = product.variants.find((v) => v.color === color)
                            if (variant) setSelectedVariant(variant)
                          }}
                          className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            selectedVariant.color === color
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size */}
                {selectedVariant.size && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Kích thước: <span className="font-bold">{selectedVariant.size}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(product.variants.map((v) => v.size))].map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            const variant = product.variants.find((v) => v.size === size)
                            if (variant) setSelectedVariant(variant)
                          }}
                          className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            selectedVariant.size === size
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Info */}
                <div className="mb-3 p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Tồn kho: </span>
                    <span className={selectedVariant.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                      {selectedVariant.stock > 0 ? `${selectedVariant.stock} sản phẩm` : 'Hết hàng'}
                    </span>
                  </p>
                  {selectedVariant.sku && (
                    <p className="text-xs text-muted-foreground mt-1">SKU: {selectedVariant.sku}</p>
                  )}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Số lượng</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 h-10 border border-border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary"
                  min="1"
                  max={selectedVariant?.stock || 1}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={selectedVariant && quantity >= selectedVariant.stock}
                  className="w-10 h-10 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Thêm vào giỏ
              </button>
              <button
                onClick={() => setLiked(!liked)}
                className={`w-12 h-12 border-2 rounded-lg transition-all flex items-center justify-center ${
                  liked
                    ? 'bg-red-50 border-red-300 text-red-500'
                    : 'border-border hover:border-red-300 hover:text-red-400'
                }`}
              >
                <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
