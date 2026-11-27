import { useState, useEffect } from 'react'
import { Trash2, ShoppingCart, Plus, Minus } from 'lucide-react'
import { useCart } from '@/app/context/CartContext'
import { promotionService } from '@/services/promotionService'
import { CheckoutForm } from '@/app/components/checkout/CheckoutForm'

export function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [shippingFee, setShippingFee] = useState<number>(40000) // Default shipping fee
  const [loadingShipping, setLoadingShipping] = useState(false)
  const [appliedPromotion, setAppliedPromotion] = useState<any>(null)

  // Check for free shipping promotion
  useEffect(() => {
    const checkPromotions = async () => {
      let hasFreeShippingPromo = false

      // Check each cart item for free shipping promotion
      for (const item of cartItems) {
        const promotions = await promotionService.getProductPromotions(item.product_id)
        const promo = promotionService.calculatePromotion(promotions, item.quantity)
        
        if (promo && promo.promotion_type === 'free_shipping') {
          hasFreeShippingPromo = true
          setAppliedPromotion(promo)
          break
        }
      }

      // If no free shipping, use default
      if (!hasFreeShippingPromo) {
        setAppliedPromotion(null)
      }
    }

    if (cartItems.length > 0) {
      checkPromotions()
    }
  }, [cartItems])

  const totalWithShipping = cartTotal + shippingFee

    if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background w-full">
        <div className="w-full px-2 md:px-4 py-12 text-center md:max-w-6xl md:mx-auto">
          <ShoppingCart size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <h1 className="text-2xl font-bold mb-2">Giỏ hàng của bạn trống</h1>
          <p className="text-muted-foreground mb-6">Hãy thêm một số sản phẩm để tiếp tục!</p>
          <a href="/" className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-semibold hover:bg-orange-600 transition-colors">
            Tiếp Tục Mua Sắm
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full md:max-w-6xl md:mx-auto">
        <div className="px-3 md:px-4 py-8 md:py-12">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">🛒 Giỏ Hàng</h1>
        </div>

        <div className="border-t border-gray-200">
          {/* Cart Items */}
          <div>
            {/* Desktop: Table View */}
            <div className="hidden md:block bg-card border-0 border-b border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Sản Phẩm</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Thông Tin</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">Giá</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">Số Lượng</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Tổng</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cartItems.map((item) => (
                      <tr key={`${item.product_id}-${item.color}-${item.size}`} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md bg-muted"
                              />
                            )}
                            <div>
                              <p className="font-semibold text-foreground text-sm">{item.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="space-y-1">
                            {item.color && (
                              <p className="text-muted-foreground">
                                <span className="font-semibold">Màu:</span> {item.color}
                              </p>
                            )}
                            {item.size && (
                              <p className="text-muted-foreground">
                                <span className="font-semibold">Size:</span> {item.size}
                              </p>
                            )}
                            {item.sku && (
                              <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center font-semibold text-foreground">
                          {(item.price || 0).toLocaleString('vi-VN')}đ
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.color, item.size)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.product_id, parseInt(e.target.value) || 1, item.color, item.size)
                              }
                              min="1"
                              className="w-12 text-center border border-border rounded px-2 py-1"
                            />
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.color, item.size)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-primary">
                          {((item.price || 0) * item.quantity).toLocaleString('vi-VN')}đ
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => removeFromCart(item.product_id, item.color, item.size)}
                            className="p-2 hover:bg-red-500/10 text-red-600 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-200 px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 bg-muted/50">
                <button
                  onClick={clearCart}
                  className="text-red-600 font-semibold hover:underline text-sm"
                >
                  Xóa Tất Cả
                </button>
                <a href="/" className="text-primary font-semibold hover:underline text-sm">
                  ← Tiếp Tục Mua Sắm
                </a>
              </div>
            </div>

            {/* Mobile: Card View */}
            <div className="md:hidden space-y-0 pb-0">
              {cartItems.map((item) => (
                <div key={`${item.product_id}-${item.color}-${item.size}`} className="bg-white border-0 border-b border-gray-200 rounded-0 overflow-hidden shadow-none">
                  {/* Product Card */}
                  <div className="p-4 space-y-3">
                    {/* Image - Full Width */}
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded bg-gray-100"
                      />
                    )}

                    {/* Name */}
                    <p className="font-semibold text-gray-900 text-sm">{item.name}</p>

                    {/* Color & Size Info */}
                    <div className="text-xs space-y-1">
                      {item.color && (
                        <p className="text-gray-600">
                          <span className="text-gray-800 font-medium">Màu:</span> {item.color}
                        </p>
                      )}
                      {item.size && (
                        <p className="text-gray-600">
                          <span className="text-gray-800 font-medium">Size:</span> {item.size}
                        </p>
                      )}
                      {item.sku && (
                        <p className="text-gray-500">SKU: {item.sku}</p>
                      )}
                    </div>

                    {/* Price Row */}
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-xs text-gray-500">Giá:</span>
                      <span className="font-bold text-primary text-sm">{(item.price || 0).toLocaleString('vi-VN')}đ</span>
                    </div>

                    {/* Quantity Control & Total Row */}
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-1 border border-gray-300 rounded bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.color, item.size)}
                          className="px-2.5 py-1.5 hover:bg-gray-200 transition-colors text-gray-700"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.product_id, parseInt(e.target.value) || 1, item.color, item.size)
                          }
                          min="1"
                          className="w-10 text-center text-xs font-bold border-0 bg-transparent"
                        />
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.color, item.size)}
                          className="px-2.5 py-1.5 hover:bg-gray-200 transition-colors text-gray-700"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right flex-1">
                        <p className="text-xs text-gray-500">Tổng</p>
                        <p className="font-bold text-primary text-base">{((item.price || 0) * item.quantity).toLocaleString('vi-VN')}đ</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product_id, item.color, item.size)}
                        className="p-2 hover:bg-red-50 text-red-600 transition-colors flex-shrink-0"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: Order Summary - Hiển thị ngay dưới sản phẩm */}
            <div className="md:hidden bg-white rounded-0 p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tạm Tính:</span>
                <span className="font-bold text-gray-900 text-base">{cartTotal.toLocaleString('vi-VN')}đ</span>
              </div>

              {appliedPromotion && appliedPromotion.promotion_type === 'free_shipping' && (
                <div className="text-xs text-green-600 font-semibold text-right">✅ Miễn phí 📦</div>
              )}

              <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                <span className="text-lg font-bold text-gray-900">Tổng:</span>
                <span className="text-lg font-bold text-primary">
                  {cartTotal.toLocaleString('vi-VN')}đ
                </span>
              </div>

              {/* Info: Phí vận chuyển sẽ được tính tại checkout */}
              <p className="text-xs text-muted-foreground text-center mt-2">💡 Phí vận chuyển sẽ được tính khi bạn nhập địa chỉ gửi hàng</p>

              <button
                onClick={() => setIsCheckingOut(true)}
                disabled={isCheckingOut}
                className="w-full mt-3 bg-primary text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 text-base"
              >
                {isCheckingOut ? '⏳ Đang Xử Lý...' : '✅ Thanh Toán Ngay'}
              </button>

              {isCheckingOut && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                  <CheckoutForm 
                    onClose={() => setIsCheckingOut(false)} 
                    onShippingFeeChange={(fee) => {
                      const finalFee = appliedPromotion?.promotion_type === 'free_shipping' ? 0 : fee
                      setShippingFee(finalFee)
                    }}
                    onLoadingChange={setLoadingShipping}
                    appliedPromotion={appliedPromotion}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Order Summary */}
          <div className="bg-white rounded-0 p-4 md:p-6 md:sticky md:top-0 shadow-none hidden md:block lg:border-l lg:border-gray-200">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">📋 Tóm Tắt Đơn Hàng</h2>

              <div className="space-y-2 md:space-y-3">
                {/* Line 1: Tạm Tính */}
                <div className="flex justify-between items-center">
                  <span className="text-sm md:text-base text-gray-600">Tạm Tính:</span>
                  <span className="font-bold text-gray-900 text-base md:text-lg">{cartTotal.toLocaleString('vi-VN')}đ</span>
                </div>

                {/* Free Shipping Badge */}
                {appliedPromotion && appliedPromotion.promotion_type === 'free_shipping' && (
                  <div className="text-xs text-green-600 font-semibold text-right">✅ Miễn phí 📦</div>
                )}

                {/* Info: Phí sẽ tính khi checkout */}
                <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-700">
                  💡 Phí vận chuyển sẽ được tính khi bạn chọn địa chỉ gửi hàng tại thanh toán
                </div>

                {/* Line 2: Tổng */}
                <div className="flex justify-between items-center border-t border-gray-200 pt-2 md:pt-3">
                  <span className="text-lg md:text-xl font-bold text-gray-900">Tổng:</span>
                  <span className="text-lg md:text-2xl font-bold text-primary">
                    {cartTotal.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                disabled={isCheckingOut}
                className="w-full mt-4 bg-primary text-white font-bold py-3 md:py-3.5 rounded-lg hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 text-base shadow-md"
              >
                {isCheckingOut ? '⏳ Đang Xử Lý...' : '✅ Thanh Toán Ngay'}
              </button>

              {isCheckingOut && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                  <CheckoutForm 
                    onClose={() => setIsCheckingOut(false)} 
                    onShippingFeeChange={(fee) => {
                      // Apply promotion discount if applicable
                      const finalFee = appliedPromotion?.promotion_type === 'free_shipping' ? 0 : fee
                      setShippingFee(finalFee)
                    }}
                    onLoadingChange={setLoadingShipping}
                    appliedPromotion={appliedPromotion}
                  />
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  )
}
