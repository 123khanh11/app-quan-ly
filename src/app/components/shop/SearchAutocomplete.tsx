'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, Product } from '@/services/supabase'
import { Search } from 'lucide-react'

export function SearchAutocomplete() {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const navigate = useNavigate()

  // Load all products once
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getProducts()
        setAllProducts(products)
      } catch (err) {
        console.error('Failed to load products:', err)
      }
    }
    loadProducts()
  }, [])

  // Filter suggestions as user types
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    ).slice(0, 5)

    setSuggestions(filtered)
    setShowSuggestions(true)
  }, [searchQuery, allProducts])

  const handleSearch = (productId?: string) => {
    if (productId) {
      navigate(`/products/${productId}`)
    } else if (searchQuery.trim()) {
      // Search by name - filter and navigate to home with filter
      const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (filtered.length > 0) {
        navigate(`/products/${filtered[0].id}`)
      }
    }
    setSearchQuery('')
    setShowSuggestions(false)
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center bg-white rounded-md overflow-hidden">
        <Search size={18} className="ml-3 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
          className="flex-1 px-3 py-2 text-sm text-gray-800 outline-none"
        />
        <button
          onClick={() => handleSearch()}
          className="px-4 py-2 bg-blue-700 text-white font-semibold text-sm hover:bg-blue-800"
        >
          Tìm
        </button>
      </div>

      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50">
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSearch(product.id)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-primary font-bold">
                    {(product.price || 0).toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
