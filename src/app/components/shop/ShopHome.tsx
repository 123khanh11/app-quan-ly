import { useEffect, useState } from 'react'
import { Heart, ShoppingCart, Search } from 'lucide-react'
import { getProducts, Product } from '@/services/supabase'
import { useCart } from '@/app/context/CartContext'
import { ProductDetailModal } from './ProductDetailModal'

interface ShopHomeProps {
  selectedCategoryId: string
  selectedCategoryName: string
  onClearCategory: () => void
}

export function ShopHome({ selectedCategoryId, selectedCategoryName, onClearCategory }: ShopHomeProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [wishlist, setWishlist] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const { addToCart } = useCart()

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wishlist')
    if (saved) setWishlist(JSON.parse(saved))
  }, [])

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const data = await getProducts()
        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Filter products
  useEffect(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    let updatedProducts = products

    if (selectedCategoryId) {
      updatedProducts = updatedProducts.filter((product) => product.category_id === selectedCategoryId)
    }

    if (normalizedQuery !== '') {
      updatedProducts = updatedProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(normalizedQuery) ||
          p.description?.toLowerCase().includes(normalizedQuery)
      )
    }

    setFilteredProducts(updatedProducts)
  }, [searchQuery, products, selectedCategoryId])

  const toggleWishlist = (productId: string) => {
    const updated = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId]
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    })
    alert('✅ Đã thêm vào giỏ hàng!')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary to-orange-500 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Chào Mừng Đến Cửa Hàng Thời Trang Đẹp</h1>
          <p className="text-lg opacity-90">Khám phá bộ sưu tập thời trang tuyệt vời của chúng tôi</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8 space-y-4">
          {selectedCategoryId && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
              <div>
                <p className="text-sm text-muted-foreground">Bộ lọc danh mục</p>
                <p className="text-lg font-semibold">{selectedCategoryName}</p>
              </div>
              <button
                type="button"
                onClick={onClearCategory}
                className="text-sm text-primary hover:text-orange-600"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
          <div className="flex items-center border border-border rounded-lg overflow-hidden bg-card">
            <Search size={20} className="ml-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">⏳ Đang tải sản phẩm...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Không tìm thấy sản phẩm</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full" />
                Sản Phẩm ({filteredProducts.length})
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden aspect-[3/4] bg-muted cursor-pointer" onClick={() => setSelectedProductId(product.id)}>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleWishlist(product.id)
                      }}
                      className={`absolute top-2 right-2 p-2 rounded-full shadow transition-colors ${
                        wishlist.includes(product.id)
                          ? 'bg-primary text-white'
                          : 'bg-white/90 text-muted-foreground opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Heart
                        size={18}
                        fill={wishlist.includes(product.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2 text-sm leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div className="mb-3">
                      <p className="text-lg font-bold text-primary">
                        {product.price.toLocaleString('vi-VN')}đ
                      </p>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      Thêm Vào Giỏ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProductId && (
        <ProductDetailModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  )
}
