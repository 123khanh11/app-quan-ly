import { useState } from 'react'
import { useCart } from '@/app/context/CartContext'
import { VIETNAM_LOCATIONS, getDistrictsByProvince, getWardsByDistrict } from '@/data/vietnamLocations'

const SHIPPING_FEE = 50000

interface CheckoutFormProps {
  onClose: () => void
}

export function CheckoutForm({ onClose }: CheckoutFormProps) {
  const { cartItems, cartTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    detailedAddress: '',
    note: '',
  })

  const districts = formData.province ? getDistrictsByProvince(formData.province) : []
  const wards = formData.district ? getWardsByDistrict(formData.province, formData.district) : []

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
          {VIETNAM_LOCATIONS.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
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
          {districts.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name}
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
          {wards.map((w) => (
            <option key={w.name} value={w.name}>
              {w.name}
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
