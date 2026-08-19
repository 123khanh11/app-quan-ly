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
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
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
    <div className="min-h-screen bg-background py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-3 md:px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">🛒 Giỏ Hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 md:space-y-0">
            {/* Desktop: Table View */}
            <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden">
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

              <div className="border-t border-border px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 bg-muted/50">
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
            <div className="md:hidden space-y-3">
              {cartItems.map((item) => (
                <div key={`${item.product_id}-${item.color}-${item.size}`} className="bg-card border border-border rounded-lg p-4 space-y-3">
                  {/* Product Image & Name */}
                  <div className="flex gap-3">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md bg-muted flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm line-clamp-2">{item.name}</p>
                      {item.color && (
                        <p className="text-xs text-muted-foreground mt-1">Màu: {item.color}</p>
                      )}
                      {item.size && (
                        <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                      )}
                    </div>
                  </div>

                  {/* Price & Quantity */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Giá</p>
                      <p className="font-bold text-primary">{item.price.toLocaleString('vi-VN')}đ</p>
                    </div>
                    <div className="flex items-center gap-2 border border-border rounded-md p-1">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.color, item.size)}
                        className="p-1 hover:bg-muted rounded"
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
                        className="w-10 text-center text-sm border-0 bg-transparent"
                      />
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.color, item.size)}
                        className="p-1 hover:bg-muted rounded"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Total & Delete */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Tổng</p>
                      <p className="font-bold text-primary text-lg">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product_id, item.color, item.size)}
                      className="p-2 hover:bg-red-500/10 text-red-600 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={clearCart}
                  className="text-red-600 font-semibold hover:underline text-sm py-2"
                >
                  Xóa Tất Cả
                </button>
                <a href="/" className="text-primary font-semibold hover:underline text-sm py-2 text-center">
                  ← Tiếp Tục Mua Sắm
                </a>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-4 md:p-6 sticky top-20">
              <h2 className="text-lg md:text-xl font-bold mb-4">Tóm Tắt</h2>

              <div className="space-y-3 pb-4 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính:</span>
                  <span className="font-semibold">{cartTotal.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <div className="flex justify-between text-lg md:text-xl font-bold my-4 text-primary">
                <span>Tổng:</span>
                <span>{cartTotal.toLocaleString('vi-VN')}đ</span>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                disabled={isCheckingOut}
                className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 mb-3 text-sm md:text-base"
              >
                {isCheckingOut ? '⏳ Xử Lý...' : '✅ Thanh Toán'}
              </button>

              {isCheckingOut && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
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
