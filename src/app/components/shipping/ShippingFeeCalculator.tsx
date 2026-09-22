'use client'

import { useState, useEffect } from 'react'
import {
  useShippingFee,
  formatShippingFee,
  getShippingFeeBreakdown,
  type ShippingFeeParams,
} from '@/hooks/useShippingFee'
import { getDistricts, getWards, type District, type Ward } from '@/services/ghn-db'

interface ShippingFeeCalculatorProps {
  provinceId?: number // Default province to load districts
  onFeeCalculated?: (fee: number) => void
  autoCalculate?: boolean // Auto-calculate when params change
}

/**
 * Component to calculate shipping fee
 * Features:
 * - Select destination province, district, ward
 * - Input package weight & dimensions
 * - Calculate and display fee breakdown
 * - Show estimated fee if GHN API fails
 */
export function ShippingFeeCalculator({
  provinceId = 1, // Hà Nội
  onFeeCalculated,
  autoCalculate = false,
}: ShippingFeeCalculatorProps) {
  const { loading, data, error, warning, calculateFee, reset } = useShippingFee()

  // Form state
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null)
  const [selectedWard, setSelectedWard] = useState<string | null>(null)

  // Package params
  const [weight, setWeight] = useState(1000) // gram
  const [length, setLength] = useState(20) // cm
  const [width, setWidth] = useState(20) // cm
  const [height, setHeight] = useState(20) // cm
  const [hasInsurance, setHasInsurance] = useState(false)
  const [insuranceValue, setInsuranceValue] = useState(0)

  // Load districts on mount
  useEffect(() => {
    loadDistricts()
  }, [provinceId])

  // Load wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      loadWards(selectedDistrict)
    }
  }, [selectedDistrict])

  // Auto-calculate when params change
  useEffect(() => {
    if (autoCalculate && selectedDistrict && selectedWard) {
      const timer = setTimeout(() => {
        handleCalculate()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [selectedDistrict, selectedWard, weight, length, width, height, insuranceValue, autoCalculate])

  // Notify parent when fee changes
  useEffect(() => {
    if (data?.total && onFeeCalculated) {
      onFeeCalculated(data.total)
    }
  }, [data?.total, onFeeCalculated])

  async function loadDistricts() {
    try {
      const result = await getDistricts(provinceId)
      if (result.success && result.districts) {
        setDistricts(result.districts)
        if (result.districts.length > 0) {
          setSelectedDistrict(result.districts[0].district_id)
        }
      } else {
        console.error('Failed to load districts:', result.error)
      }
    } catch (err) {
      console.error('Error loading districts:', err)
    }
  }

  async function loadWards(districtId: number) {
    try {
      const result = await getWards(districtId)
      if (result.success && result.wards) {
        setWards(result.wards)
        if (result.wards.length > 0) {
          setSelectedWard(result.wards[0].ward_code)
        }
      } else {
        console.error('Failed to load wards:', result.error)
      }
    } catch (err) {
      console.error('Error loading wards:', err)
    }
  }

  async function handleCalculate() {
    if (!selectedDistrict || !selectedWard) {
      alert('Vui lòng chọn khu vực giao hàng')
      return
    }

    const params: ShippingFeeParams = {
      to_district_id: selectedDistrict,
      to_ward_code: selectedWard,
      weight: Math.max(weight, 200),
      length: Math.max(length, 10),
      width: Math.max(width, 10),
      height: Math.max(height, 10),
    }

    if (hasInsurance && insuranceValue > 0) {
      params.insurance_value = insuranceValue
    }

    await calculateFee(params)
  }

  const breakdown = data ? getShippingFeeBreakdown(data) : []

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Tính phí vận chuyển</h2>

      {/* Location Selection */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quận/Huyện giao hàng
          </label>
          <select
            value={selectedDistrict || ''}
            onChange={(e) => setSelectedDistrict(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 border shadow-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((d) => (
              <option key={d.district_id} value={d.district_id}>
                {d.district_name}
              </option>
            ))}
          </select>
        </div>

        {/* Ward */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phường/Xã giao hàng
          </label>
          <select
            value={selectedWard || ''}
            onChange={(e) => setSelectedWard(e.target.value)}
            disabled={!selectedDistrict || wards.length === 0}
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 border shadow-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
          >
            <option value="">Chọn phường/xã</option>
            {wards.map((w) => (
              <option key={w.ward_code} value={w.ward_code}>
                {w.ward_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Package Dimensions */}
      <div className="mb-6">
        <h3 className="mb-4 font-medium text-gray-900">Thông tin bưu kiện</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cân nặng (g)
            </label>
            <input
              type="number"
              min="200"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 border shadow-sm focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">{(weight / 1000).toFixed(2)} kg</p>
          </div>

          {/* Length */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dài (cm)
            </label>
            <input
              type="number"
              min="10"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 border shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rộng (cm)
            </label>
            <input
              type="number"
              min="10"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 border shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cao (cm)
            </label>
            <input
              type="number"
              min="10"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 border shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Insurance */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={hasInsurance}
            onChange={(e) => setHasInsurance(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Bảo hiểm hàng hóa</span>
        </label>
        {hasInsurance && (
          <div className="mt-2">
            <input
              type="number"
              min="0"
              placeholder="Giá trị bảo hiểm (VNĐ)"
              value={insuranceValue}
              onChange={(e) => setInsuranceValue(Number(e.target.value))}
              className="w-full rounded-md border-gray-300 px-3 py-2 border shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Warning message */}
      {warning && (
        <div className="mb-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-700">
          {warning}
        </div>
      )}

      {/* Calculate button */}
      <button
        onClick={handleCalculate}
        disabled={loading || !selectedDistrict || !selectedWard}
        className="mb-6 w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Đang tính toán...' : 'Tính phí vận chuyển'}
      </button>

      {/* Fee Result */}
      {data && (
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600">Tổng phí vận chuyển</p>
            <p className="text-3xl font-bold text-blue-600">
              {formatShippingFee(data.total)}
            </p>
          </div>

          {/* Breakdown */}
          {breakdown.length > 0 && (
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <p className="font-medium text-gray-700">Chi tiết:</p>
              {breakdown.map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium text-gray-900">
                    {formatShippingFee(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
