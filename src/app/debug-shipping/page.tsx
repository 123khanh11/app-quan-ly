'use client'

import { useState } from 'react'

interface ShippingFeeResponse {
  code: number
  message: string
  data?: {
    total: number
    service_fee: number
    insurance_fee: number
    pick_station_fee: number
    coupon_value: number
    r2s_fee: number
    document_return: number
    double_check: number
    cod_fee: number
    pick_remote_areas_fee: number
    deliver_remote_areas_fee: number
    cod_failed_fee: number
  }
}

export default function DebugShippingPage() {
  const [formData, setFormData] = useState({
    from_district_id: 1455,
    from_ward_code: '21617',
    to_district_id: 1452,
    to_ward_code: '21012',
    service_id: 53320, // Changed to Standard service
    weight: 300,
    length: 15,
    width: 15,
    height: 15,
  })
  const [result, setResult] = useState<ShippingFeeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }))
  }

  const handleTest = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/shipping/fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      setResult(data)

      if (!response.ok) {
        setError(`Error: ${data.message || 'Unknown error'}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🧪 Debug GHN Shipping Fee</h1>

        {/* Form */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">From District ID</label>
              <input
                type="number"
                name="from_district_id"
                value={formData.from_district_id}
                onChange={handleChange}
                className="w-full bg-gray-700 px-3 py-2 rounded text-white"
              />
              <p className="text-xs text-gray-400 mt-1">Shop: Hà Đông (1455)</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">From Ward Code</label>
              <input
                type="text"
                name="from_ward_code"
                value={formData.from_ward_code}
                onChange={handleChange}
                className="w-full bg-gray-700 px-3 py-2 rounded text-white"
              />
              <p className="text-xs text-gray-400 mt-1">Ward: 21617</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">To District ID</label>
              <input
                type="number"
                name="to_district_id"
                value={formData.to_district_id}
                onChange={handleChange}
                className="w-full bg-gray-700 px-3 py-2 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">To Ward Code</label>
              <input
                type="text"
                name="to_ward_code"
                value={formData.to_ward_code}
                onChange={handleChange}
                className="w-full bg-gray-700 px-3 py-2 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Service ID</label>
              <select
                name="service_id"
                value={formData.service_id}
                onChange={handleChange}
                className="w-full bg-gray-700 px-3 py-2 rounded text-white"
              >
                <option value={53320}>53320 - Standard (Chuẩn)</option>
                <option value={53319}>53319 - Fast (Nhanh)</option>
                <option value={53321}>53321 - Eco (Tiết kiệm)</option>
                <option value={2}>2 - Light goods (Hàng nhẹ - Legacy)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Weight (gram)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full bg-gray-700 px-3 py-2 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Length (cm)</label>
              <input
                type="number"
                name="length"
                value={formData.length}
                onChange={handleChange}
                className="w-full bg-gray-700 px-3 py-2 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Width (cm)</label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleChange}
                className="w-full bg-gray-700 px-3 py-2 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full bg-gray-700 px-3 py-2 rounded text-white"
              />
            </div>
          </div>

          <button
            onClick={handleTest}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? '⏳ Testing...' : '🚀 Test GHN Shipping Fee'}
          </button>
        </div>

        {/* Request Info */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">📡 Request JSON:</h2>
          <pre className="bg-gray-900 p-4 rounded text-sm overflow-auto max-h-60 text-green-400">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900 border border-red-700 p-4 rounded-lg mb-8 text-red-100">
            <p className="font-bold">❌ Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-6">
            {/* Response Status */}
            <div
              className={`p-6 rounded-lg border-2 ${
                result.code === 200
                  ? 'bg-green-900 border-green-700 text-green-100'
                  : 'bg-red-900 border-red-700 text-red-100'
              }`}
            >
              <p className="text-2xl font-bold">
                {result.code === 200 ? '✅ Success' : '❌ Failed'}
              </p>
              <p className="text-lg">{result.message}</p>
            </div>

            {/* Fee Details */}
            {result.data && (
              <div className="bg-gray-800 p-6 rounded-lg space-y-3">
                <h2 className="text-2xl font-bold mb-4">💰 Shipping Fee Details:</h2>

                <div className="grid grid-cols-2 gap-4">
                  {/* Main Fee */}
                  <div className="bg-gray-700 p-4 rounded border-l-4 border-yellow-500">
                    <p className="text-gray-400 text-sm">Total Fee</p>
                    <p className="text-3xl font-bold text-yellow-400">
                      {result.data.total.toLocaleString('vi-VN')}đ
                    </p>
                  </div>

                  {/* Service Fee */}
                  <div className="bg-gray-700 p-4 rounded border-l-4 border-blue-500">
                    <p className="text-gray-400 text-sm">Service Fee</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {result.data.service_fee.toLocaleString('vi-VN')}đ
                    </p>
                  </div>

                  {/* Other Fees */}
                  <div className="bg-gray-700 p-4 rounded border-l-4 border-orange-500">
                    <p className="text-gray-400 text-sm">Insurance Fee</p>
                    <p className="text-xl font-bold text-orange-400">
                      {result.data.insurance_fee.toLocaleString('vi-VN')}đ
                    </p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded border-l-4 border-purple-500">
                    <p className="text-gray-400 text-sm">COD Fee</p>
                    <p className="text-xl font-bold text-purple-400">
                      {result.data.cod_fee.toLocaleString('vi-VN')}đ
                    </p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded border-l-4 border-red-500">
                    <p className="text-gray-400 text-sm">Pick Remote Areas Fee</p>
                    <p className="text-xl font-bold text-red-400">
                      {result.data.pick_remote_areas_fee.toLocaleString('vi-VN')}đ
                    </p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded border-l-4 border-green-500">
                    <p className="text-gray-400 text-sm">Deliver Remote Areas Fee</p>
                    <p className="text-xl font-bold text-green-400">
                      {result.data.deliver_remote_areas_fee.toLocaleString('vi-VN')}đ
                    </p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded border-l-4 border-pink-500">
                    <p className="text-gray-400 text-sm">Pick Station Fee</p>
                    <p className="text-xl font-bold text-pink-400">
                      {result.data.pick_station_fee.toLocaleString('vi-VN')}đ
                    </p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded border-l-4 border-indigo-500">
                    <p className="text-gray-400 text-sm">Coupon Value</p>
                    <p className="text-xl font-bold text-indigo-400">
                      {result.data.coupon_value.toLocaleString('vi-VN')}đ
                    </p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded border-l-4 border-cyan-500">
                    <p className="text-gray-400 text-sm">R2S Fee</p>
                    <p className="text-xl font-bold text-cyan-400">
                      {result.data.r2s_fee.toLocaleString('vi-VN')}đ
                    </p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded border-l-4 border-lime-500">
                    <p className="text-gray-400 text-sm">Document Return</p>
                    <p className="text-xl font-bold text-lime-400">
                      {result.data.document_return.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>

                {/* Formula */}
                <div className="mt-6 p-4 bg-gray-900 rounded border border-gray-700">
                  <p className="text-sm font-mono text-gray-300">
                    Total = Service Fee ({result.data.service_fee}) + Insurance ({result.data.insurance_fee}) + COD ({result.data.cod_fee}) + Pick Remote ({result.data.pick_remote_areas_fee}) + Deliver Remote ({result.data.deliver_remote_areas_fee}) + ...
                  </p>
                </div>
              </div>
            )}

            {/* Full Response */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">📊 Full Response JSON:</h2>
              <pre className="bg-gray-900 p-4 rounded text-sm overflow-auto max-h-96 text-green-400">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* GHN API Reference */}
        <div className="bg-gray-800 p-6 rounded-lg mt-8 border-l-4 border-blue-500">
          <h2 className="text-xl font-bold mb-4">📚 GHN API Reference:</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✓ API Endpoint: POST /shipping-order/fee</li>
            <li>✓ Shop Location: Hà Đông, Hà Nội (District 1455, Ward 21617)</li>
            <li>✓ Service ID 2: Light goods (Hàng nhẹ)</li>
            <li>✓ Min Weight: 1000g, Min Dimensions: 20x20x20cm</li>
            <li>✓ Documentation: Check GHN API docs for more details</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
