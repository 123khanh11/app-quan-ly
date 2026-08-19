import { useState } from 'react'
import { Trash2, ShoppingCart, Plus, Minus } from 'lucide-react'
import { useCart } from '@/app/context/CartContext'
import { CheckoutForm } from '@/app/components/checkout/CheckoutForm'

const SHIPPING_FEE = 50000

export function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const totalWithShipping = cartTotal + (cartItems.length > 0 ? SHIPPING_FEE : 0)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-12 text-center">
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
    <div className="min-h-screen bg-background">
      <div className="px-0 md:px-0">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-8 md:py-12">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">🛒 Giỏ Hàng</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-0 border-t border-gray-200">
          {/* Cart Items */}
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200">
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
                          {item.price.toLocaleString('vi-VN')}đ
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
                          {(item.price * item.quantity).toLocaleString('vi-VN')}đ
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
            <div className="md:hidden space-y-0 border-b border-gray-200">
              {cartItems.map((item) => (
                <div key={`${item.product_id}-${item.color}-${item.size}`} className="bg-white border-0 border-b border-gray-200 rounded-0 overflow-hidden shadow-none hover:shadow-none transition-shadow">
                  {/* Product Card */}
                  <div className="p-3 space-y-3">
                    {/* Image & Info Row */}
                    <div className="flex gap-3">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-md bg-gray-100 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="font-bold text-foreground text-sm line-clamp-2">{item.name}</p>
                          <div className="mt-2 space-y-1">
                            {item.color && (
                              <p className="text-xs text-gray-600">
                                <span className="text-gray-900 font-medium">Màu:</span> {item.color}
                              </p>
                            )}
                            {item.size && (
                              <p className="text-xs text-gray-600">
                                <span className="text-gray-900 font-medium">Size:</span> {item.size}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="font-bold text-primary text-base">{item.price.toLocaleString('vi-VN')}đ</p>
                      </div>
                    </div>

                    {/* Quantity & Delete Row */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-1 border border-gray-300 rounded-lg bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.color, item.size)}
                          className="p-1.5 hover:bg-gray-200 transition-colors"
                        >
                          <Minus size={16} className="text-gray-700" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.product_id, parseInt(e.target.value) || 1, item.color, item.size)
                          }
                          min="1"
                          className="w-12 text-center text-sm font-semibold border-0 bg-transparent"
                        />
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.color, item.size)}
                          className="p-1.5 hover:bg-gray-200 transition-colors"
                        >
                          <Plus size={16} className="text-gray-700" />
                        </button>
                      </div>

                      <div className="text-right flex-1">
                        <p className="text-xs text-gray-500">Tổng cộng</p>
                        <p className="font-bold text-primary text-lg">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product_id, item.color, item.size)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors flex-shrink-0"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-4 sticky bottom-0 bg-white border-t border-gray-200 -mx-3 -mb-8 px-3 py-3">
                <a href="/" className="flex items-center justify-center gap-2 px-4 py-2.5 text-primary font-semibold hover:bg-primary/5 rounded-lg transition-colors text-center">
                  ← Tiếp Tục Mua Sắm
                </a>
                <button
                  onClick={clearCart}
                  className="px-4 py-2 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors text-sm"
                >
                  🗑️ Xóa Tất Cả
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 lg:pl-0">
            <div className="bg-white border-0 border-b border-gray-200 lg:border-b-0 lg:border-l lg:border-gray-200 rounded-0 p-4 md:p-6 md:sticky md:top-0 shadow-none">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">📋 Tóm Tắt Đơn Hàng</h2>

              <div className="space-y-3 pb-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-bold text-gray-900 text-lg">{cartTotal.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <div className="py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">Tổng:</span>
                  <span className="text-2xl font-bold text-primary">{cartTotal.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                disabled={isCheckingOut}
                className="w-full mt-4 bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 text-base shadow-md"
              >
                {isCheckingOut ? '⏳ Đang Xử Lý...' : '✅ Thanh Toán Ngay'}
              </button>

              {isCheckingOut && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                  <CheckoutForm onClose={() => setIsCheckingOut(false)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
