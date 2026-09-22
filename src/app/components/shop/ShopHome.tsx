import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import { getProducts, Product } from '@/services/supabase'
import { useCart } from '@/app/context/CartContext'
import { useFavorites } from '@/app/context/FavoritesContext'
import { ProductDetail } from '@/app/pages/ProductDetail'

interface ShopHomeProps {
  selectedCategoryId: string
  selectedCategoryName: string
  onClearCategory: () => void
}

export function ShopHome({ selectedCategoryId, selectedCategoryName, onClearCategory }: ShopHomeProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const data = await getProducts()
        console.log('Loaded products:', data)
        console.log('Total products:', data.length)
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

  const toggleWishlist = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id)
    } else {
      addFavorite({
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        sku: product.sku,
      })
    }
  }

  const handleAddToCart = (product: Product) => {
    // Navigate to product detail page with URL
    navigate(`/products/${product.id}`)
  }

  // If no products are filtered, show all products
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full max-w-6xl mx-auto px-2 md:px-4 py-8">
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
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">⏳ Đang tải sản phẩm...</p>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Không tìm thấy sản phẩm</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full" />
                Sản Phẩm ({displayProducts.length})
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              {displayProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden aspect-[3/4] bg-muted cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleWishlist(product)
                      }}
                      className={`absolute top-2 right-2 p-2 rounded-full shadow transition-colors ${
                        isFavorite(product.id)
                          ? 'bg-primary text-white'
                          : 'bg-white/90 text-muted-foreground opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Heart
                        size={18}
                        fill={isFavorite(product.id) ? 'currentColor' : 'none'}
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
                        {(product.price || 0).toLocaleString('vi-VN')}đ
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
    </div>
  )
}
