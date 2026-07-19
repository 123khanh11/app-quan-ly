import { useState } from 'react'
import { useCart } from '@/app/context/CartContext'

const VIETNAM_PROVINCES = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Hải Phòng', 'Đà Nẵng', 'Cần Thơ',
  'An Giang', 'Bà Rịa Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
  'Bến Tre', 'Bình Dương', 'Bình Phước', 'Bình Thuận', 'Cà Mau',
  'Cao Bằng', 'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai',
  'Đồng Tháp', 'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Tĩnh',
  'Hải Dương', 'Hậu Giang', 'Hòa Bình', 'Huế', 'Khánh Hòa',
  'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng', 'Lạng Sơn',
  'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình',
  'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình', 'Quảng Nam',
  'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La',
  'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế',
  'Tiền Giang', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
]

const VIETNAM_DISTRICTS = [
  'Ba Đình', 'Hoàn Kiếm', 'Tây Hồ', 'Cầu Giấy', 'Đống Đa',
  'Hai Bà Trưng', 'Thanh Xuân', 'Quận 1', 'Quận 2', 'Quận 3',
  'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8',
  'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12', 'Bình Tân'
]

const VIETNAM_WARDS = [
  'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5',
  'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10',
  'Xã 1', 'Xã 2', 'Xã 3', 'Xã 4', 'Xã 5'
]

interface CheckoutFormProps {
  onClose: () => void
}

export function CheckoutForm({ onClose }: CheckoutFormProps) {
  const { cartItems, cartTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shippingFee, setShippingFee] = useState<number>(50000)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    detailedAddress: '',
    note: '',
  })

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
      const finalShippingFee = shippingFee || 50000

      // Tạo order
      const order = await createOrder({
        total: cartTotal + finalShippingFee,
        shipping_fee: finalShippingFee,
        payment_method: 'cod',
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
      alert(`✅ Đặt hàng thành công!\n\nMã đơn hàng: ${order.id}\nPhí vận chuyển: ${finalShippingFee.toLocaleString()} VNĐ\n\nChúng tôi sẽ liên hệ bạn sớm.`)
      // Reload page to reset to home
      window.location.href = '/'
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
          {VIETNAM_PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
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
          {VIETNAM_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
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
          {VIETNAM_WARDS.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Địa chỉ chi tiết (số nhà, tên đường...)"
          value={formData.detailedAddress}
          onChange={(e) => setFormData({ ...formData, detailedAddress: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={2}
          required
        />
      </div>

      {/* Notes */}
      <textarea
        placeholder="Ghi chú (không bắt buộc)"
        value={formData.note}
        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        rows={2}
      />

      {/* Shipping Fee Summary */}
      <div className="bg-muted p-3 rounded-md">
        <div className="flex justify-between text-sm mb-2">
          <span>Tiền hàng:</span>
          <span className="font-semibold">{cartTotal.toLocaleString()} VNĐ</span>
        </div>
        <div className="flex justify-between text-sm border-t border-border pt-2">
          <span>Phí vận chuyển:</span>
          <span className="font-semibold">{shippingFee.toLocaleString()} VNĐ</span>
        </div>
        <div className="flex justify-between text-base font-bold border-t border-border pt-2 mt-2">
          <span>Tổng cộng:</span>
          <span className="text-primary">{(cartTotal + shippingFee).toLocaleString()} VNĐ</span>
        </div>
      </div>

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
