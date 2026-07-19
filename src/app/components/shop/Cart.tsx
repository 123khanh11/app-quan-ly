import { useState } from 'react'
import { Trash2, ShoppingCart, Plus, Minus } from 'lucide-react'
import { useCart } from '@/app/context/CartContext'
import { CheckoutForm } from '@/app/components/checkout/CheckoutForm'

const SHIPPING_FEE = 50000

// Vietnamese provinces data
const PROVINCES = [
  { id: 1, name: 'Hà Nội', districts: ['Ba Đình', 'Hoàn Kiếm', 'Tây Hồ', 'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Thanh Xuân'] },
  { id: 2, name: 'TP. Hồ Chí Minh', districts: ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 7', 'Bình Thạnh'] },
  { id: 3, name: 'Hải Phòng', districts: ['Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Kiến An', 'Đô Sơn'] },
  { id: 4, name: 'Đà Nẵng', districts: ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu'] },
  { id: 5, name: 'Cần Thơ', districts: ['Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn', 'Thốt Nốt'] },
]

const WARDS = ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5']

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
  const [locating, setLocating] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    detailedAddress: '',
    note: '',
  })

  const selectedProvince = PROVINCES.find(p => p.name === formData.province)
  const districts = selectedProvince?.districts || []

  const handleLocate = () => {
    setLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setFormData({
            ...formData,
            detailedAddress: `Vĩ độ: ${latitude.toFixed(4)}, Kinh độ: ${longitude.toFixed(4)}`,
          })
          setLocating(false)
        },
        (error) => {
          console.error('Geolocation error:', error)
          setError('❌ Không thể lấy vị trí hiện tại. Vui lòng kiểm tra cài đặt GPS.')
          setLocating(false)
        }
      )
    } else {
      setError('❌ Trình duyệt không hỗ trợ định vị.')
      setLocating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.province || !formData.district || !formData.ward || !formData.detailedAddress) {
      setError('❌ Vui lòng điền đầy đủ thông tin địa chỉ.')
      setLoading(false)
      return
    }

    try {
      const { createOrder, addOrderItem } = await import('@/services/supabase')

      const fullAddress = `${formData.detailedAddress}, ${formData.ward}, ${formData.district}, ${formData.province}`

      // Tạo order
      const order = await createOrder({
        total: cartTotal,
        shipping_fee: SHIPPING_FEE,
        payment_method: 'cash',
        shipping_address: fullAddress,
        note: `Email: ${formData.email}\nSĐT: ${formData.phone}\nGhi chú: ${formData.note}`,
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
      {/* Contact Info */}
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

      {/* Address Details */}
      <div className="pt-2 border-t border-border">
        <p className="text-sm font-semibold text-foreground mb-2">📍 Địa Chỉ Chi Tiết</p>
        
        <select
          value={formData.province}
          onChange={(e) => setFormData({ ...formData, province: e.target.value, district: '', ward: '' })}
          className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-2"
          required
        >
          <option value="">-- Chọn Tỉnh/Thành phố --</option>
          {PROVINCES.map(p => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>

        <select
          value={formData.district}
          onChange={(e) => setFormData({ ...formData, district: e.target.value, ward: '' })}
          disabled={!formData.province}
          className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-2 disabled:opacity-50"
          required
        >
          <option value="">-- Chọn Quận/Huyện --</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={formData.ward}
          onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
          disabled={!formData.district}
          className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-2 disabled:opacity-50"
          required
        >
          <option value="">-- Chọn Xã/Phường --</option>
          {WARDS.map(w => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>

        {/* Detailed Address + GPS */}
        <div className="flex gap-2 mb-2">
          <textarea
            placeholder="Địa chỉ chi tiết (số nhà, tên đường...)"
            value={formData.detailedAddress}
            onChange={(e) => setFormData({ ...formData, detailedAddress: e.target.value })}
            className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={2}
            required
          />
          <button
            type="button"
            onClick={handleLocate}
            disabled={locating}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-1 text-sm font-semibold"
            title="Dùng GPS để lấy vị trí hiện tại"
          >
            <MapPin size={16} />
            {locating ? 'Đang...' : 'GPS'}
          </button>
        </div>
      </div>

      {/* Notes */}
      <textarea
        placeholder="Ghi chú (không bắt buộc)"
        value={formData.note}
        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        rows={2}
      />

      {/* Buttons */}
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
