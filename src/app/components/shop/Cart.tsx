import { useState } from 'react'
import { Trash2, ShoppingCart, Plus, Minus } from 'lucide-react'
import { useCart } from '@/app/context/CartContext'

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
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">🛒 Giỏ Hàng Của Bạn</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Sản Phẩm</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">Giá</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">Số Lượng</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Tổng</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cartItems.map((item) => (
                      <tr key={item.product_id} className="hover:bg-muted/30 transition-colors">
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
                              <p className="font-semibold text-foreground">{item.name}</p>
                              <p className="text-xs text-muted-foreground">ID: {item.product_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center font-semibold text-foreground">
                          {item.price.toLocaleString('vi-VN')}đ
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.product_id, parseInt(e.target.value) || 1)
                              }
                              min="1"
                              className="w-12 text-center border border-border rounded px-2 py-1"
                            />
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
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
                            onClick={() => removeFromCart(item.product_id)}
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

              <div className="border-t border-border px-4 py-4 flex justify-between items-center bg-muted/50">
                <button
                  onClick={clearCart}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Xóa Tất Cả
                </button>
                <a href="/" className="text-primary font-semibold hover:underline">
                  ← Tiếp Tục Mua Sắm
                </a>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
              <h2 className="text-lg font-bold mb-4">Tóm Tắt Đơn Hàng</h2>

              <div className="space-y-3 pb-4 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính:</span>
                  <span className="font-semibold">{cartTotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển:</span>
                  <span className="font-semibold">{SHIPPING_FEE.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold my-4 text-primary">
                <span>Tổng Cộng:</span>
                <span>{totalWithShipping.toLocaleString('vi-VN')}đ</span>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                disabled={isCheckingOut}
                className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                {isCheckingOut ? '⏳ Xử Lý...' : '✅ Thanh Toán'}
              </button>

              {isCheckingOut && (
                <div className="space-y-3">
                  {/* Checkout Form */}
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

function CheckoutForm({ onClose }: { onClose: () => void }) {
  const { cartItems, cartTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    note: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { createOrder, addOrderItem } = await import('@/services/supabase')

      // Tạo order với những cột thực tế
      const order = await createOrder({
        total: cartTotal,
        shipping_fee: SHIPPING_FEE,
        payment_method: 'cash',
        shipping_address: formData.address,
        note: `Email: ${formData.email}\nSĐT: ${formData.phone}`,
      })

      // Add items to order
      for (const item of cartItems) {
        try {
          await addOrderItem({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          })
        } catch (itemError) {
          console.warn('Warning adding item:', itemError)
        }
      }

      // Clear cart and redirect
      clearCart()
      alert(`✅ Đặt hàng thành công!\n\nMã đơn hàng: ${order.id}\n\nChúng tôi sẽ liên hệ bạn sớm.`)
      window.location.href = `/order/${order.id}`
    } catch (error) {
      console.error('Checkout error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Không xác định'
      setError(`❌ Lỗi: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border-t border-border pt-3">
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
      <input
        type="tel"
        placeholder="Số điện thoại"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
      <textarea
        placeholder="Địa chỉ giao hàng"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        rows={3}
        required
      />
      <textarea
        placeholder="Ghi chú (không bắt buộc)"
        value={formData.note}
        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        rows={2}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary text-primary-foreground font-bold py-2 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Đặt Hàng'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 border border-border text-foreground font-semibold py-2 rounded-md hover:bg-muted transition-colors"
        >
          Hủy
        </button>
      </div>
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}
    </form>
  )
}
