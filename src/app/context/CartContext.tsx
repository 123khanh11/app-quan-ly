import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id?: string
  product_id: string
  variant_id?: string
  name: string
  price: number
  quantity: number
  image_url?: string
  weight?: number
  length?: number
  width?: number
  height?: number
  color?: string
  size?: string
  sku?: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string, color?: string, size?: string) => void
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shopping_cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to load cart from localStorage:', e)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shopping_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      // Tìm item với cùng product_id, color, size
      const existingItem = prevItems.find(
        (i) =>
          i.product_id === item.product_id &&
          i.color === item.color &&
          i.size === item.size
      )
      if (existingItem) {
        return prevItems.map((i) =>
          i.product_id === item.product_id && i.color === item.color && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prevItems, item]
    })
  }

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (i) =>
          !(
            i.product_id === productId &&
            i.color === color &&
            i.size === size
          )
      )
    )
  }

  const updateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size)
      return
    }
    setCartItems((prevItems) =>
      prevItems.map((i) =>
        i.product_id === productId && i.color === color && i.size === size
          ? { ...i, quantity }
          : i
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
