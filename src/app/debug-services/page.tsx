'use client'

import { useState } from 'react'

interface Service {
  service_id: number
  short_name: string
  service_type_id: number
}

interface ServiceResponse {
  code: number
  message: string
  data?: Service[]
}

export default function DebugServicesPage() {
  const [fromDistrict, setFromDistrict] = useState(1455) // Hà Đông
  const [toDistrict, setToDistrict] = useState(1452) // Nam Từ Liêm
  const [result, setResult] = useState<ServiceResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTest = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/ghn/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_district_id: fromDistrict,
          to_district_id: toDistrict,
        }),
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
        <h1 className="text-4xl font-bold mb-8">🔍 GHN Service Types Finder</h1>

        {/* Explanation */}
        <div className="bg-blue-900 border border-blue-700 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-3">📌 Cách Tìm service_id:</h2>
          <ol className="space-y-2 text-sm">
            <li><strong>1.</strong> Gọi API: POST /shipping-order/available-services</li>
            <li><strong>2.</strong> Truyền: from_district_id (1455 = Hà Đông)</li>
            <li><strong>3.</strong> Truyền: to_district_id (nơi giao hàng)</li>
            <li><strong>4.</strong> GHN sẽ trả về danh sách dịch vụ có sẵn</li>
            <li><strong>5.</strong> Chọn service_id từ danh sách (VD: 53320)</li>
            <li><strong>6.</strong> Dùng service_id đó khi tính phí</li>
          </ol>
        </div>

        {/* Form */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">From District ID</label>
              <input
                type="number"
                value={fromDistrict}
                onChange={(e) => setFromDistrict(Number(e.target.value))}
                className="w-full bg-gray-700 px-3 py-2 rounded text-white"
              />
              <p className="text-xs text-gray-400 mt-1">Shop: Hà Đông (1455)</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">To District ID</label>
              <input
                type="number"
                value={toDistrict}
                onChange={(e) => setToDistrict(Number(e.target.value))}
                className="w-full bg-gray-700 px-3 py-2 rounded text-white"
              />
              <p className="text-xs text-gray-400 mt-1">Test: Nam Từ Liêm (1452)</p>
            </div>
          </div>

          <button
            onClick={handleTest}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? '⏳ Fetching Services...' : '🚀 Get Available Services'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900 border border-red-700 p-4 rounded-lg mb-8 text-red-100">
            <p className="font-bold">❌ Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Status */}
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

            {/* Services List */}
            {result.data && result.data.length > 0 && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">📋 Available Services:</h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-700 border-b border-gray-600">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Service ID</th>
                        <th className="px-4 py-3 font-semibold">Name</th>
                        <th className="px-4 py-3 font-semibold">Type ID</th>
                        <th className="px-4 py-3 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {result.data.map((service) => (
                        <tr key={service.service_id} className="hover:bg-gray-700 transition-colors">
                          <td className="px-4 py-3">
                            <code className="bg-gray-900 px-2 py-1 rounded text-yellow-400 font-bold">
                              {service.service_id}
                            </code>
                          </td>
                          <td className="px-4 py-3 font-semibold">{service.short_name || 'N/A'}</td>
                          <td className="px-4 py-3">{service.service_type_id}</td>
                          <td className="px-4 py-3 text-xs text-gray-400">
                            {service.service_type_id === 1 && 'Fast (Nhanh)'}
                            {service.service_type_id === 2 && 'Standard (Chuẩn)'}
                            {service.service_type_id === 3 && 'Eco (Tiết kiệm)'}
                            {!service.short_name && 'Other'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Recommendation */}
                <div className="mt-6 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
                  <p className="text-sm text-yellow-200">
                    💡 <strong>Khuyến nghị:</strong> Sử dụng service_id có service_type_id = 2 (Standard) để cân bằng giá và thời gian.
                  </p>
                </div>
              </div>
            )}

            {/* Full Response */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">📊 Full Response JSON:</h2>
              <pre className="bg-gray-900 p-4 rounded text-xs overflow-auto max-h-96 text-green-400">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* GHN API Reference */}
        <div className="bg-gray-800 p-6 rounded-lg mt-8 border-l-4 border-green-500">
          <h2 className="text-xl font-bold mb-4">📚 GHN API Details:</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✓ API Endpoint: POST /shipping-order/available-services</li>
            <li>✓ Documentation: GHN Developer Portal</li>
            <li>✓ Service Types:</li>
            <ul className="ml-4 space-y-1 mt-2">
              <li>• 1 = Fast (Nhanh) - Tốc độ cao, giá cao</li>
              <li>• 2 = Standard (Chuẩn) - Cân bằng, được khuyên dùng</li>
              <li>• 3 = Eco (Tiết kiệm) - Rẻ nhất, tốc độ chậm</li>
            </ul>
          </ul>
        </div>
      </div>
    </div>
  )
}
