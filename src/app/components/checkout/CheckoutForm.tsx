import { useState, useEffect } from 'react'
import { useCart } from '@/app/context/CartContext'
import { getDistricts, getWards, calculateShippingFee } from '@/services/ghn-db'

// GHN Province IDs mapping
const PROVINCE_TO_GHN_ID: Record<string, number> = {
  'Hà Nội': 201,
  'TP. Hồ Chí Minh': 202,
  'Đà Nẵng': 203,
  'Đồng Nai': 204,
  'Bình Dương': 205,
  'Bà Rịa - Vũng Tàu': 206,
  'Gia Lai': 207,
  'Khánh Hòa': 208,
  'Lâm Đồng': 209,
  'Đắk Lắk': 210,
  'Long An': 211,
  'Tiền Giang': 212,
  'Bến Tre': 213,
  'Trà Vinh': 214,
  'Vĩnh Long': 215,
  'Đồng Tháp': 216,
  'An Giang': 217,
  'Sóc Trăng': 218,
  'Kiên Giang': 219,
  'Cần Thơ': 220,
  'Vĩnh Phúc': 221,
  'Thừa Thiên Huế': 223,
  'Hải Phòng': 224,
  'Hải Dương': 225,
  'Thái Bình': 226,
  'Hà Giang': 227,
  'Tuyên Quang': 228,
  'Phú Thọ': 229,
  'Quảng Ninh': 230,
  'Nam Định': 231,
  'Hà Nam': 232,
  'Ninh Bình': 233,
  'Thanh Hóa': 234,
  'Nghệ An': 235,
  'Hà Tĩnh': 236,
  'Quảng Bình': 237,
  'Quảng Trị': 238,
  'Bình Phước': 239,
  'Tây Ninh': 240,
  'Đắk Nông': 241,
  'Quảng Ngãi': 242,
  'Quảng Nam': 243,
  'Thái Nguyên': 244,
  'Bắc Kạn': 245,
  'Cao Bằng': 246,
  'Lạng Sơn': 247,
  'Bắc Giang': 248,
  'Bắc Ninh': 249,
  'Hậu Giang': 250,
  'Cà Mau': 252,
  'Bạc Liêu': 253,
  'Yên Bái': 263,
  'Lai Châu': 264,
  'Điện Biên': 265,
  'Sơn La': 266,
  'Hòa Bình': 267,
  'Hưng Yên': 268,
  'Lào Cai': 269,
}

const VIETNAM_PROVINCES = Object.keys(PROVINCE_TO_GHN_ID)
const DEFAULT_SHIPPING_FEE = 50000

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
  onShippingFeeChange?: (fee: number) => void
  onLoadingChange?: (loading: boolean) => void
}

export function CheckoutForm({ onClose, onShippingFeeChange, onLoadingChange }: CheckoutFormProps) {
  const { cartItems, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingWards, setLoadingWards] = useState(false)
  const [shippingFee, setShippingFee] = useState<number>(DEFAULT_SHIPPING_FEE)
  const [loadingShipping, setLoadingShipping] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(cartItems.map((item) => `${item.product_id}-${item.color}-${item.size}`))
  )
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

  // Calculate shipping fee when address changes
  useEffect(() => {
    const calculateShipping = async () => {
      if (!formData.districtId || !formData.wardCode) {
        setShippingFee(DEFAULT_SHIPPING_FEE)
        onShippingFeeChange?.(DEFAULT_SHIPPING_FEE)
        onLoadingChange?.(false)
        return
      }

      setLoadingShipping(true)
      onLoadingChange?.(true)
      try {
        // Build items array for GHN API
        const items = cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          weight: item.weight || 300, // 300g default per item
          length: item.length || 15,
          width: item.width || 15,
          height: item.height || 15,
        }))

        // Calculate totals for payload
        let totalWeight = 0
        let maxLength = 0
        let maxWidth = 0
        let totalHeight = 0

        items.forEach((item) => {
          totalWeight += item.weight * item.quantity
          maxLength = Math.max(maxLength, item.length)
          maxWidth = Math.max(maxWidth, item.width)
          totalHeight += item.height * item.quantity
        })

        console.log('📦 Shipping calculation:', {
          items: cartItems.length,
          totalWeight,
          maxLength,
          maxWidth,
          totalHeight,
          to: `District ${formData.districtId}, Ward ${formData.wardCode}`,
        })

        // Call GHN API with correct parameters per their spec
        const result = await calculateShippingFee({
          service_id: 53320, // Standard service (not 2)
          from_district_id: 1455,
          from_ward_code: '21617',
          to_district_id: formData.districtId,
          to_ward_code: formData.wardCode,
          weight: Math.max(totalWeight, 200), // Min 200g
          length: Math.max(maxLength, 10),
          width: Math.max(maxWidth, 10),
          height: Math.max(totalHeight, 10),
          insurance_value: 0,
          coupon: null,
        })

        if (result.success && result.data?.total) {
          console.log('✅ Shipping fee:', result.data.total, 'đ')
          setShippingFee(result.data.total)
          onShippingFeeChange?.(result.data.total)
        } else {
          console.warn('⚠️ GHN API failed, using default:', DEFAULT_SHIPPING_FEE)
          setShippingFee(DEFAULT_SHIPPING_FEE)
          onShippingFeeChange?.(DEFAULT_SHIPPING_FEE)
        }
      } catch (err) {
        console.error('❌ Error calculating shipping:', err)
        setShippingFee(DEFAULT_SHIPPING_FEE)
        onShippingFeeChange?.(DEFAULT_SHIPPING_FEE)
      } finally {
        setLoadingShipping(false)
        onLoadingChange?.(false)
      }
    }

    calculateShipping()
  }, [formData.districtId, formData.wardCode, cartItems, onShippingFeeChange, onLoadingChange])

  const handleToggleItem = (itemKey: string) => {
    const updated = new Set(selectedItems)
    if (updated.has(itemKey)) {
      updated.delete(itemKey)
    } else {
      updated.add(itemKey)
    }
    setSelectedItems(updated)
  }

  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(
        new Set(cartItems.map((item) => `${item.product_id}-${item.color}-${item.size}`))
      )
    }
  }

  const selectedTotal = cartItems
    .filter((item) => selectedItems.has(`${item.product_id}-${item.color}-${item.size}`))
    .reduce((total, item) => total + item.price * item.quantity, 0)

  const totalWithShipping = selectedTotal + (selectedItems.size > 0 ? shippingFee : 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (selectedItems.size === 0) {
      setError('❌ Vui lòng chọn ít nhất một sản phẩm để thanh toán.')
      setLoading(false)
      return
    }

    if (!formData.province || !formData.district || !formData.ward || !formData.detailedAddress) {
      setError('❌ Vui lòng điền đầy đủ thông tin địa chỉ.')
      setLoading(false)
      return
    }

    try {
      const { createOrder, addOrderItem } = await import('@/services/supabase')

      const fullAddress = `${formData.detailedAddress}, ${formData.ward}, ${formData.district}, ${formData.province}`

      // Tạo order (với phí vận chuyển)
      const order = await createOrder({
        total: totalWithShipping,
        shipping_fee: shippingFee,
        payment_method: 'cod',
        shipping_address: fullAddress,
        note: `Email: ${formData.email}\nSĐT: ${formData.phone}\nGhi chú: ${formData.note}`,
      })

      // Add items to order (chỉ những item được chọn)
      for (const item of cartItems) {
        const itemKey = `${item.product_id}-${item.color}-${item.size}`
        if (selectedItems.has(itemKey)) {
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
      }

      // Clear cart and redirect
      clearCart()
      alert(`✅ Đặt hàng thành công!\n\nMã đơn hàng: ${order.id}\nTiền hàng: ${selectedTotal.toLocaleString()} VNĐ\nPhí vận chuyển: ${shippingFee.toLocaleString()} VNĐ\nTổng cộng: ${totalWithShipping.toLocaleString()} VNĐ\n\nChúng tôi sẽ liên hệ bạn sớm.`)
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
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-border pt-4">
      {/* Selected Items */}
      <div className="bg-muted p-3 rounded-md">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-foreground">📦 Sản Phẩm Thanh Toán ({selectedItems.size}/{cartItems.length})</p>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-sm text-primary hover:underline font-medium"
          >
            {selectedItems.size === cartItems.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          </button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {cartItems.map((item) => {
            const itemKey = `${item.product_id}-${item.color}-${item.size}`
            const isSelected = selectedItems.has(itemKey)
            return (
              <div
                key={itemKey}
                className={`flex items-center gap-3 p-2 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.color && `${item.color}`}
                    {item.size && ` • ${item.size}`}
                    {item.sku && ` • ${item.sku}`}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 mr-3">
                  <p className="font-bold text-primary text-sm">
                    {(item.price * item.quantity).toLocaleString()} VNĐ
                  </p>
                  <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                </div>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleItem(itemKey)}
                  className="w-5 h-5 cursor-pointer flex-shrink-0"
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-2">👤 Thông Tin Liên Hệ</p>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-2"
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
      </div>

      {/* Address Details */}
      <div>
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

      {/* Total - HIDDEN */}
      {/* <div className="bg-muted p-3 rounded-md space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tiền hàng:</span>
          <span className="font-semibold">{selectedTotal.toLocaleString('vi-VN')}đ</span>
        </div>
        <div className="flex justify-between text-sm border-t border-border pt-2">
          <span className="text-muted-foreground">Phí vận chuyển:</span>
          <span className="font-semibold text-orange-600">
            {loadingShipping ? '⏳ Đang tính...' : `${shippingFee.toLocaleString('vi-VN')}đ`}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold border-t border-border pt-2">
          <span>Tổng cộng:</span>
          <span className="text-primary">{totalWithShipping.toLocaleString('vi-VN')}đ</span>
        </div>
      </div> */}

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading || selectedItems.size === 0 || loadingShipping}
          className="flex-1 bg-primary text-primary-foreground font-bold py-2 rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : `✅ Thanh Toán (${selectedItems.size} sản phẩm)`}
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
