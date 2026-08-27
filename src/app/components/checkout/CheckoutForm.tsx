'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/app/context/CartContext'
import { supabase } from '@/services/supabase'
import { PaymentModal } from './PaymentModal'

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
  const [userId, setUserId] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
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
    paymentMethod: 'cod' as 'cod' | 'bank_transfer',
  })

  // Get user ID on mount
  useEffect(() => {
    const getUserId = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user?.id) {
          setUserId(session.user.id)
        }
      } catch (err) {
        console.error('Error getting user ID:', err)
      }
    }
    getUserId()
  }, [])

  // Load provinces
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true)
      try {
        const response = await fetch('/api/ghn-provinces')
        if (!response.ok) throw new Error('Failed to load provinces')
        const result = await response.json() as any
        if (result.success && Array.isArray(result.data)) {
          setProvinces(result.data)
          if (result.data.length > 0) {
            setFormData(prev => ({ ...prev, province: String(result.data[0].province_id) }))
          }
        }
      } catch (err) {
        console.warn('Failed to load provinces:', err)
      } finally {
        setLoadingProvinces(false)
      }
    }
    loadProvinces()
  }, [])

  // Load districts
  useEffect(() => {
    const loadDistricts = async () => {
      if (!formData.province) {
        setDistricts([])
        return
      }
      setLoadingDistricts(true)
      try {
        const response = await fetch(`/api/ghn-districts?province_id=${formData.province}`)
        if (!response.ok) throw new Error('Failed to load districts')
        const result = await response.json() as any
        if (result.success && Array.isArray(result.data)) {
          setDistricts(result.data.map((d: any) => ({
            district_id: d.DistrictID || d.district_id,
            district_name: d.DistrictName || d.district_name,
          })))
        }
      } catch (err) {
        console.warn('Failed to load districts:', err)
      } finally {
        setLoadingDistricts(false)
      }
    }
    loadDistricts()
  }, [formData.province])

  // Load wards
  useEffect(() => {
    const loadWards = async () => {
      if (!formData.districtId) {
        setWards([])
        return
      }
      setLoadingWards(true)
      try {
        const response = await fetch(`/api/ghn-wards?district_id=${formData.districtId}`)
        if (!response.ok) throw new Error('Failed to load wards')
        const result = await response.json() as any
        if (result.success && Array.isArray(result.data)) {
          setWards(result.data.map((w: any) => ({
            ward_code: w.WardCode || w.ward_code,
            ward_name: w.WardName || w.ward_name,
          })))
        }
      } catch (err) {
        console.warn('Failed to load wards:', err)
      } finally {
        setLoadingWards(false)
      }
    }
    loadWards()
  }, [formData.districtId])

  // Calculate shipping fee
  useEffect(() => {
    const calculateShipping = async () => {
      if (!formData.districtId || !formData.wardCode) {
        setShippingFee(DEFAULT_SHIPPING_FEE)
        return
      }
      setLoadingShipping(true)
      try {
        let totalWeight = 0
        cartItems.forEach((item) => {
          totalWeight += (item.weight || 300) * item.quantity
        })
        const response = await fetch('/api/shipping-fee', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_type_id: 2,
            to_district_id: formData.districtId,
            to_ward_code: formData.wardCode,
            weight: Math.max(totalWeight, 200),
            length: 15,
            width: 15,
            height: 15,
            insurance_value: selectedTotal,
          }),
        })
        if (!response.ok) throw new Error('Failed to calculate shipping')
        const result = await response.json() as any
        if (result.success && result.data) {
          setShippingFee(result.data.total || DEFAULT_SHIPPING_FEE)
        }
      } catch (err) {
        console.warn('Failed to calculate shipping:', err)
        setShippingFee(DEFAULT_SHIPPING_FEE)
      } finally {
        setLoadingShipping(false)
      }
    }
    calculateShipping()
  }, [formData.districtId, formData.wardCode, cartItems])

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
      setSelectedItems(new Set(cartItems.map((item) => `${item.product_id}-${item.color}-${item.size}`)))
    }
  }

  const selectedTotal = cartItems
    .filter((item) => selectedItems.has(`${item.product_id}-${item.color}-${item.size}`))
    .reduce((sum, item) => sum + item.price * item.quantity, 0)

  const totalWithShipping = selectedTotal + (selectedItems.size > 0 ? shippingFee : 0)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (selectedItems.size === 0) {
      setError('Select at least one product')
      return
    }
    if (!formData.province || !formData.district || !formData.ward || !formData.detailedAddress) {
      setError('Please fill all address fields')
      return
    }
    setShowPaymentModal(true)
  }

  const handlePaymentConfirm = async (paymentMethod: 'bank_transfer' | 'cod') => {
    setShowPaymentModal(false)
    setLoading(true)
    setError(null)

    try {
      const fullAddress = `${formData.detailedAddress}, ${formData.ward}, ${formData.district}, ${formData.province}`
      const orderItems = cartItems
        .filter((item) => selectedItems.has(`${item.product_id}-${item.color}-${item.size}`))
        .filter((item) => item.product_id && item.variant_id)
        .map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          product_name: item.name || 'Unknown',
          quantity: item.quantity || 1,
          price: item.price || 0,
          color: item.color || '',
          size: item.size || '',
          sku: item.sku || '',
          weight_kg: item.weight ? item.weight / 1000 : null,
          length_cm: item.length || null,
          width_cm: item.width || null,
          height_cm: item.height || null,
        }))

      if (orderItems.length === 0) {
        throw new Error('No valid products selected')
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: {
            user_id: userId,
            total: totalWithShipping,
            shipping_fee: shippingFee,
            payment_method: paymentMethod,
            payment_status: paymentMethod === 'bank_transfer' ? 'pending' : 'cod',
            order_status: 'pending',
            shipping_address: fullAddress,
            customer_email: formData.email,
            customer_phone: formData.phone,
            note: formData.note,
          },
          items: orderItems,
        }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to create order')

      clearCart()
      alert(`Order placed!\nID: ${result.order.id}\nTotal: ${totalWithShipping.toLocaleString()} VND`)
      window.location.href = '/'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 border-t border-border pt-4">
        <div className="bg-muted p-3 rounded-md">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold">Products ({selectedItems.size}/{cartItems.length})</p>
            <button type="button" onClick={handleSelectAll} className="text-sm text-primary hover:underline">
              {selectedItems.size === cartItems.length ? 'Deselect' : 'Select All'}
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {cartItems.map((item) => {
              const itemKey = `${item.product_id}-${item.color}-${item.size}`
              return (
                <div key={itemKey} className={`flex items-center gap-3 p-2 rounded-lg border-2 ${selectedItems.has(itemKey) ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.color}{item.size && ` x ${item.size}`}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-primary text-sm">{(item.price * item.quantity).toLocaleString()} VND</p>
                    <p className="text-xs">x{item.quantity}</p>
                  </div>
                  <input type="checkbox" checked={selectedItems.has(itemKey)} onChange={() => handleToggleItem(itemKey)} className="w-5 h-5 cursor-pointer" />
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">Contact</p>
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-border rounded-md text-sm mb-2" required />
          <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border border-border rounded-md text-sm" required />
        </div>

        <div>
          <p className="text-sm font-semibold mb-2">Shipping Address</p>
          <select value={formData.province} onChange={(e) => setFormData({ ...formData, province: e.target.value, district: '', districtId: 0, ward: '', wardCode: '' })} className="w-full px-3 py-2 border border-border rounded-md text-sm mb-2" required>
            <option value="">Select Province</option>
            {provinces.map((p) => <option key={p.province_id} value={p.province_id}>{p.province_name}</option>)}
          </select>

          <select value={formData.districtId} onChange={(e) => { const id = parseInt(e.target.value); const d = districts.find((x) => x.district_id === id); setFormData({ ...formData, districtId: id, district: d?.district_name || '', ward: '', wardCode: '' }); }} className="w-full px-3 py-2 border border-border rounded-md text-sm mb-2" required>
            <option value="">Select District</option>
            {districts.map((d) => <option key={d.district_id} value={d.district_id}>{d.district_name}</option>)}
          </select>

          <select value={formData.wardCode} onChange={(e) => { const w = wards.find((x) => x.ward_code === e.target.value); setFormData({ ...formData, wardCode: e.target.value, ward: w?.ward_name || '' }); }} className="w-full px-3 py-2 border border-border rounded-md text-sm mb-2" required>
            <option value="">Select Ward</option>
            {wards.map((w) => <option key={w.ward_code} value={w.ward_code}>{w.ward_name}</option>)}
          </select>

          <textarea placeholder="Detailed address" value={formData.detailedAddress} onChange={(e) => setFormData({ ...formData, detailedAddress: e.target.value })} className="w-full px-3 py-2 border border-border rounded-md text-sm resize-none" rows={2} required />
        </div>

        <textarea placeholder="Notes (optional)" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} className="w-full px-3 py-2 border border-border rounded-md text-sm resize-none" rows={2} />

        <div className="bg-muted p-3 rounded-md space-y-2">
          <div className="flex justify-between text-sm"><span>Subtotal:</span><span className="font-semibold">{selectedTotal.toLocaleString('vi-VN')}đ</span></div>
          <div className="flex justify-between text-sm border-t border-border pt-2"><span>Shipping:</span><span className="font-semibold">{loadingShipping ? 'Calculating...' : `${shippingFee.toLocaleString('vi-VN')}đ`}</span></div>
          <div className="flex justify-between text-base font-bold border-t border-border pt-2"><span>Total:</span><span className="text-primary">{totalWithShipping.toLocaleString('vi-VN')}đ</span></div>
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={loading || selectedItems.size === 0} className="flex-1 bg-primary text-white font-bold py-2 rounded-md hover:bg-orange-600 disabled:opacity-50">
            {loading ? 'Processing...' : `Checkout (${selectedItems.size})`}
          </button>
          <button type="button" onClick={onClose} className="flex-1 border border-border font-semibold py-2 rounded-md hover:bg-muted">
            Cancel
          </button>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">{error}</div>}
      </form>

      {showPaymentModal && <PaymentModal orderId="new" orderTotal={totalWithShipping} onClose={() => setShowPaymentModal(false)} onConfirmPayment={handlePaymentConfirm} />}
    </>
  )
}
