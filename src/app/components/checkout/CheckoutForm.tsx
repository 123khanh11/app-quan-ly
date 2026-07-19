import { useState, useEffect } from 'react'
import { useCart } from '@/app/context/CartContext'
import { calculateShippingFee, getDistricts, getWards } from '@/services/ghn-api'

// GHN Province IDs mapping
const PROVINCE_TO_GHN_ID: Record<string, number> = {
  'Hà Nội': 1,
  'TP. Hồ Chí Minh': 202,
  'Hải Phòng': 15,
  'Đà Nẵng': 48,
  'Cần Thơ': 236,
  'An Giang': 202,
  'Bà Rịa Vũng Tàu': 221,
  'Bắc Giang': 6,
  'Bắc Kạn': 7,
  'Bạc Liêu': 226,
  'Bến Tre': 214,
  'Bình Dương': 208,
  'Bình Phước': 211,
  'Bình Thuận': 220,
  'Cà Mau': 227,
  'Cao Bằng': 4,
  'Đắk Lắk': 33,
  'Đắk Nông': 34,
  'Điện Biên': 11,
  'Đồng Nai': 218,
  'Đồng Tháp': 215,
  'Gia Lai': 30,
  'Hà Giang': 2,
  'Hà Nam': 20,
  'Hà Tĩnh': 23,
  'Hải Dương': 18,
  'Hậu Giang': 224,
  'Hòa Bình': 14,
  'Huế': 42,
  'Khánh Hòa': 25,
  'Kiên Giang': 229,
  'Kon Tum': 28,
  'Lai Châu': 12,
  'Lâm Đồng': 37,
  'Lạng Sơn': 9,
  'Lào Cai': 10,
  'Long An': 213,
  'Nam Định': 21,
  'Nghệ An': 22,
  'Ninh Bình': 36,
  'Ninh Thuận': 36,
  'Phú Thọ': 26,
  'Phú Yên': 27,
  'Quảng Bình': 40,
  'Quảng Nam': 49,
  'Quảng Ngãi': 51,
  'Quảng Ninh': 3,
  'Quảng Trị': 41,
  'Sóc Trăng': 225,
  'Sơn La': 24,
  'Tây Ninh': 209,
  'Thái Bình': 19,
  'Thái Nguyên': 17,
  'Thanh Hóa': 38,
  'Thừa Thiên Huế': 42,
  'Tiền Giang': 216,
  'Tuyên Quang': 8,
  'Vĩnh Long': 223,
  'Vĩnh Phúc': 16,
  'Yên Bái': 5,
}

const VIETNAM_PROVINCES = Object.keys(PROVINCE_TO_GHN_ID)

interface District {
  district_id: number
  district_name: string
}

interface Ward {
  ward_code: string
  ward_name: string
}

interface CheckoutFormProps {
  onClose: () => void
}

export function CheckoutForm({ onClose }: CheckoutFormProps) {
  const { cartItems, cartTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shippingFee, setShippingFee] = useState<number>(50000)
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingWards, setLoadingWards] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    province: '',
    district: '',
    districtId: 0,
    ward: '',
    wardCode: '',
    detailedAddress: '',
    note: '',
  })

  // Load districts when province changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (!formData.province) {
        setDistricts([])
        return
      }

      setLoadingDistricts(true)
      try {
        const result = await getDistricts(PROVINCE_TO_GHN_ID[formData.province])
        if (result.success && result.districts) {
          setDistricts(result.districts)
        } else {
          console.error('Failed to load districts:', result.error)
          setDistricts([])
        }
      } catch (err) {
        console.error('Error loading districts:', err)
        setDistricts([])
      } finally {
        setLoadingDistricts(false)
      }
    }

    loadDistricts()
  }, [formData.province])

  // Load wards when district changes
  useEffect(() => {
    const loadWards = async () => {
      if (!formData.districtId) {
        setWards([])
        return
      }

      setLoadingWards(true)
      try {
        const result = await getWards(formData.districtId)
        if (result.success && result.wards) {
          setWards(result.wards)
        } else {
          console.error('Failed to load wards:', result.error)
          setWards([])
        }
      } catch (err) {
        console.error('Error loading wards:', err)
        setWards([])
      } finally {
        setLoadingWards(false)
      }
    }

    loadWards()
  }, [formData.districtId])

  // Calculate shipping fee when district/ward changes
  useEffect(() => {
    const calculateShipping = async () => {
      if (!formData.districtId || !formData.wardCode) {
        setShippingFee(50000) // Default fee
        return
      }

      try {
        // Calculate total weight and dimensions from cart items
        // Default: 500g per item, 20x20x20cm per item
        let totalWeight = 0
        let totalLength = 0
        let totalWidth = 0
        let totalHeight = 0

        cartItems.forEach((item) => {
          // Weight: default 500g per item
          totalWeight += (item.weight || 500) * item.quantity

          // Dimensions: default 20x20x20cm per item
          totalLength = Math.max(totalLength, item.length || 20)
          totalWidth = Math.max(totalWidth, item.width || 20)
          totalHeight += (item.height || 20) * item.quantity
        })

        // Ensure minimum values
        totalWeight = Math.max(totalWeight, 1000) // min 1kg
        totalLength = Math.max(totalLength, 20)
        totalWidth = Math.max(totalWidth, 20)
        totalHeight = Math.max(totalHeight, 20)

        // Shop location: Hà Đông, Hà Nội (Phường Dương Nội)
        // District ID for Hà Đông: 1455
        // Ward code for Phường Dương Nội: 21617
        
        // Get service type first (service_id = 2 for light goods)
        const result = await calculateShippingFee({
          service_id: 2, // Light goods (Hàng nhẹ)
          from_district_id: 1455, // Hà Đông, Hà Nội
          from_ward_code: '21617', // Phường Dương Nội
          to_district_id: formData.districtId,
          to_ward_code: formData.wardCode,
          weight: totalWeight,
          length: totalLength,
          width: totalWidth,
          height: totalHeight,
          insurance_value: 0,
          coupon: null,
        })

        if (result.success && result.data) {
          setShippingFee(result.data.total || 50000)
        } else {
          console.error('Failed to calculate shipping:', result.error)
          setShippingFee(50000) // Fallback
        }
      } catch (err) {
        console.error('Error calculating shipping fee:', err)
        setShippingFee(50000) // Fallback
      }
    }

    calculateShipping()
  }, [formData.districtId, formData.wardCode, cartItems])

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
          onChange={(e) => setFormData({ ...formData, province: e.target.value, district: '', districtId: 0, ward: '', wardCode: '' })}
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
          value={formData.districtId}
          onChange={(e) => {
            const districtId = parseInt(e.target.value)
            const district = districts.find((d) => d.district_id === districtId)
            setFormData({
              ...formData,
              districtId,
              district: district?.district_name || '',
              ward: '',
              wardCode: '',
            })
          }}
          disabled={!formData.province || loadingDistricts}
          className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-2 disabled:opacity-50"
          required
        >
          <option value="">-- {loadingDistricts ? 'Đang tải...' : 'Chọn Quận/Huyện'} --</option>
          {districts.map((d) => (
            <option key={d.district_id} value={d.district_id}>
              {d.district_name}
            </option>
          ))}
        </select>

        <select
          value={formData.wardCode}
          onChange={(e) => {
            const wardCode = e.target.value
            const ward = wards.find((w) => w.ward_code === wardCode)
            setFormData({
              ...formData,
              wardCode,
              ward: ward?.ward_name || '',
            })
          }}
          disabled={!formData.districtId || loadingWards}
          className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-2 disabled:opacity-50"
          required
        >
          <option value="">-- {loadingWards ? 'Đang tải...' : 'Chọn Xã/Phường'} --</option>
          {wards.map((w) => (
            <option key={w.ward_code} value={w.ward_code}>
              {w.ward_name}
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
