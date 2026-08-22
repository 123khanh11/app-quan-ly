'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/app/context/CartContext'

const DEFAULT_SHIPPING_FEE = 50000

interface District {
  district_id: number
  district_name: string
}

interface Ward {
  ward_code: string
  ward_name: string
}

interface Province {
  province_id: number
  province_name: string
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
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [loadingProvinces, setLoadingProvinces] = useState(true)
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

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true)
      try {
        const response = await fetch('/api/ghn-provinces', {
          method: 'GET',
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const result = await response.json() as any
        console.log('Provinces response:', result)

        if (result.success && Array.isArray(result.data)) {
          setProvinces(result.data)
          // Set first province as default
          if (result.data.length > 0) {
            setFormData(prev => ({ ...prev, province: String(result.data[0].province_id) }))
          }
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.warn('⚠️ Failed to load provinces:', err)
      } finally {
        setLoadingProvinces(false)
      }
    }

    loadProvinces()
  }, [])

  useEffect(() => {
    const loadDistricts = async () => {
      if (!formData.province) {
        setDistricts([])
        return
      }

      setLoadingDistricts(true)
      try {
        const provinceId = parseInt(formData.province)
        console.log('📍 Fetching districts for province:', provinceId)

        const response = await fetch(`/api/ghn-districts?province_id=${provinceId}`, {
          method: 'GET',
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const result = await response.json() as any
        console.log('Districts response:', result)

        if (result.success && Array.isArray(result.data)) {
          const formatted = result.data.map((d: any) => ({
            district_id: d.DistrictID || d.district_id,
            district_name: d.DistrictName || d.district_name,
          }))
          setDistricts(formatted)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.warn('⚠️ API failed, using mock data:', err)
        // Fallback to mock data
        const mockMap: Record<string, any[]> = {
          '201': [
            { district_id: 1, district_name: 'Hoàn Kiếm' },
            { district_id: 2, district_name: 'Ba Đình' },
            { district_id: 3, district_name: 'Tây Hồ' },
          ],
          '202': [
            { district_id: 1, district_name: 'Quận 1' },
            { district_id: 3, district_name: 'Quận 3' },
            { district_id: 8, district_name: 'Bình Chánh' },
          ],
          '203': [
            { district_id: 1, district_name: 'Hải Châu' },
            { district_id: 2, district_name: 'Thanh Khê' },
            { district_id: 3, district_name: 'Sơn Trà' },
          ],
        }
        setDistricts(mockMap[formData.province] || [])
      } finally {
        setLoadingDistricts(false)
      }
    }

    loadDistricts()
  }, [formData.province])

  useEffect(() => {
    const loadWards = async () => {
      if (!formData.districtId) {
        setWards([])
        return
      }

      setLoadingWards(true)
      try {
        console.log('📍 Fetching wards for district:', formData.districtId)

        const response = await fetch(`/api/ghn-wards?district_id=${formData.districtId}`, {
          method: 'GET',
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const result = await response.json() as any
        console.log('Wards response:', result)

        if (result.success && Array.isArray(result.data)) {
          const formatted = result.data.map((w: any) => ({
            ward_code: w.WardCode || w.ward_code,
            ward_name: w.WardName || w.ward_name,
          }))
          setWards(formatted)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.warn('⚠️ API failed, using mock data:', err)
        // Fallback to mock data
        const mockMap: Record<number, any[]> = {
          1: [
            { ward_code: '13000', ward_name: 'Bến Nghé' },
            { ward_code: '13001', ward_name: 'Bến Thành' },
            { ward_code: '13002', ward_name: 'Cầu Ông Lãnh' },
          ],
          1455: [
            { ward_code: '21617', ward_name: 'Phúc Diễn' },
            { ward_code: '21618', ward_name: 'Dương Nội' },
            { ward_code: '21619', ward_name: 'Hà Cầu' },
          ],
          3440: [
            { ward_code: '13010', ward_name: 'An Lạc' },
            { ward_code: '13011', ward_name: 'An Nhơn' },
            { ward_code: '13012', ward_name: 'Bình Hưng' },
          ],
          2: [
            { ward_code: '20000', ward_name: 'Cầu Giấy' },
            { ward_code: '20001', ward_name: 'Liễu Giai' },
          ],
          3: [
            { ward_code: '20100', ward_name: 'Phúc Tân' },
            { ward_code: '20101', ward_name: 'Láng Hạc' },
          ],
        }
        setWards(mockMap[formData.districtId] || [])
      } finally {
        setLoadingWards(false)
      }
    }

    loadWards()
  }, [formData.districtId])

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
        let totalWeight = 0
        let maxLength = 0
        let maxWidth = 0
        let totalHeight = 0

        cartItems.forEach((item) => {
          const w = item.weight || 300
          const l = item.length || 15
          const wi = item.width || 15
          const h = item.height || 15

          totalWeight += w * item.quantity
          maxLength = Math.max(maxLength, l)
          maxWidth = Math.max(maxWidth, wi)
          totalHeight += h * item.quantity
        })

        // Calculate shipping fee locally (no API call)
        // Base fee: 30,000 VND
        // Per kg: 5,000 VND
        const weight = Math.max(totalWeight, 200)
        const baseFee = 30000
        const perKgFee = 5000
        const weightKg = Math.ceil(weight / 1000)
        const additionalKg = Math.max(0, weightKg - 1)
        const shippingFee = baseFee + (additionalKg * perKgFee)

        console.log(`📦 Shipping calculation:
          Weight: ${weight}g (${weightKg}kg)
          Base fee: 30,000đ
          Additional kg: ${additionalKg} x 5,000đ = ${additionalKg * perKgFee}đ
          Total: ${shippingFee}đ`)

        setShippingFee(shippingFee)
        onShippingFeeChange?.(shippingFee)
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
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  const totalWithShipping = selectedTotal + (selectedItems.size > 0 ? shippingFee : 0)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (selectedItems.size === 0) {
      setError('Select at least one product')
      setLoading(false)
      return
    }

    if (!formData.province || !formData.district || !formData.ward || !formData.detailedAddress) {
      setError('Please fill all address fields')
      setLoading(false)
      return
    }

    try {
      const { createOrder, addOrderItem } = await import('@/services/supabase')

      const fullAddress = `${formData.detailedAddress}, ${formData.ward}, ${formData.district}, ${formData.province}`

      const order = await createOrder({
        total: totalWithShipping,
        shipping_fee: shippingFee,
        payment_method: 'cod',
        shipping_address: fullAddress,
        note: `Email: ${formData.email}\nPhone: ${formData.phone}\nNote: ${formData.note}`,
      })

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
          } catch (err) {
            console.warn('Item error:', err)
          }
        }
      }

      clearCart()
      const msg = `Order placed!\nID: ${order.id}\nTotal: ${totalWithShipping.toLocaleString()} VND`
      alert(msg)
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (err) {
      console.error('Checkout error:', err)
      const msg = err instanceof Error ? err.message : 'Error occurred'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-border pt-4">
      <div className="bg-muted p-3 rounded-md">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold">Products ({selectedItems.size}/{cartItems.length})</p>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-sm text-primary hover:underline"
          >
            {selectedItems.size === cartItems.length ? 'Deselect' : 'Select All'}
          </button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {cartItems.map((item) => {
            const itemKey = `${item.product_id}-${item.color}-${item.size}`
            const isSelected = selectedItems.has(itemKey)
            return (
              <div
                key={itemKey}
                className={`flex items-center gap-3 p-2 rounded-lg border-2 ${
                  isSelected ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.color}{item.size && ` x ${item.size}`}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 mr-3">
                  <p className="font-bold text-primary text-sm">
                    {(item.price * item.quantity).toLocaleString()} VND
                  </p>
                  <p className="text-xs">x{item.quantity}</p>
                </div>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleItem(itemKey)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-2">Contact</p>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-md text-sm mb-2"
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-md text-sm"
          required
        />
      </div>

      <div>
        <p className="text-sm font-semibold mb-2">Shipping Address</p>

        <select
          value={formData.province}
          onChange={(e) => setFormData({ ...formData, province: e.target.value, district: '', districtId: 0, ward: '', wardCode: '' })}
          disabled={loadingProvinces}
          className="w-full px-3 py-2 border border-border rounded-md text-sm mb-2 disabled:opacity-50"
          required
        >
          <option value="">Select Province</option>
          {provinces.map((p) => <option key={p.province_id} value={p.province_id}>{p.province_name}</option>)}
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
          disabled={loadingDistricts}
          className="w-full px-3 py-2 border border-border rounded-md text-sm mb-2 disabled:opacity-50"
          required
        >
          <option value="">Select District</option>
          {districts.map((d) => <option key={d.district_id} value={d.district_id}>{d.district_name}</option>)}
        </select>

        <select
          value={formData.wardCode}
          onChange={(e) => {
            const wardCode = e.target.value
            const ward = wards.find((w) => w.ward_code === wardCode)
            setFormData({ ...formData, wardCode, ward: ward?.ward_name || '' })
          }}
          disabled={!formData.districtId || loadingWards}
          className="w-full px-3 py-2 border border-border rounded-md text-sm mb-2 disabled:opacity-50"
          required
        >
          <option value="">Select Ward</option>
          {wards.map((w) => <option key={w.ward_code} value={w.ward_code}>{w.ward_name}</option>)}
        </select>

        <textarea
          placeholder="Detailed address"
          value={formData.detailedAddress}
          onChange={(e) => setFormData({ ...formData, detailedAddress: e.target.value })}
          className="w-full px-3 py-2 border border-border rounded-md text-sm resize-none"
          rows={2}
          required
        />
      </div>

      <textarea
        placeholder="Notes optional"
        value={formData.note}
        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        className="w-full px-3 py-2 border border-border rounded-md text-sm resize-none"
        rows={2}
      />

      <div className="bg-muted p-3 rounded-md space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span className="font-semibold">{selectedTotal.toLocaleString('vi-VN')}d</span>
        </div>
        <div className="flex justify-between text-sm border-t border-border pt-2">
          <span>Shipping:</span>
          <span className="font-semibold text-orange-600">
            {loadingShipping ? 'Calculating...' : `${shippingFee.toLocaleString('vi-VN')}d`}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold border-t border-border pt-2">
          <span>Total:</span>
          <span className="text-primary">{totalWithShipping.toLocaleString('vi-VN')}d</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading || selectedItems.size === 0 || loadingShipping}
          className="flex-1 bg-primary text-white font-bold py-2 rounded-md hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Checkout (${selectedItems.size})`}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 border border-border font-semibold py-2 rounded-md hover:bg-muted"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}
    </form>
  )
}
