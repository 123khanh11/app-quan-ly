import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/services/supabase'

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
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Load cart from database when user logs in
  useEffect(() => {
    const checkAuthAndLoadCart = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (user) {
          setCurrentUserId(user.id)
          // Load from database
          await loadCartFromDatabase(user.id)
        } else {
          setCurrentUserId(null)
          // Load from localStorage for guest users
          loadCartFromLocalStorage()
        }
      } catch (err) {
        console.error('Failed to check auth:', err)
        loadCartFromLocalStorage()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndLoadCart()

    // Listen to auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setCurrentUserId(session.user.id)
          loadCartFromDatabase(session.user.id)
        } else {
          setCurrentUserId(null)
          // Clear cart when logging out
          setCartItems([])
        }
      }
    )

    return () => {
      subscription?.subscription.unsubscribe()
    }
  }, [])

  // Load cart from localStorage
  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('shopping_cart')
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      } else {
        setCartItems([])
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err)
      setCartItems([])
    }
  }

  // Load cart from database
  const loadCartFromDatabase = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_carts')
        .select('cart_data')
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No cart exists yet, create empty one
          await createEmptyCart(userId)
          setCartItems([])
        } else {
          console.error('Failed to load cart:', error)
          setCartItems([])
        }
      } else if (data?.cart_data) {
        setCartItems(data.cart_data)
      } else {
        setCartItems([])
      }
    } catch (err) {
      console.error('Failed to load cart from database:', err)
      setCartItems([])
    }
  }

  // Create empty cart for new user
  const createEmptyCart = async (userId: string) => {
    try {
      await supabase
        .from('user_carts')
        .insert([{ user_id: userId, cart_data: [] }])
    } catch (err) {
      console.warn('Failed to create cart:', err)
    }
  }

  // Save cart to database (if logged in) and localStorage (always)
  const saveCart = async (items: CartItem[]) => {
    // Always save to localStorage for backup
    localStorage.setItem('shopping_cart', JSON.stringify(items))

    // Save to database if logged in
    if (currentUserId) {
      try {
        await supabase
          .from('user_carts')
          .upsert(
            { user_id: currentUserId, cart_data: items },
            { onConflict: 'user_id' }
          )
      } catch (err) {
        console.error('Failed to save cart to database:', err)
      }
    }
  }

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) =>
          i.product_id === item.product_id &&
          i.color === item.color &&
          i.size === item.size
      )
      
      const newItems = existingItem
        ? prevItems.map((i) =>
            i.product_id === item.product_id && i.color === item.color && i.size === item.size
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        : [...prevItems, item]
      
      saveCart(newItems)
      return newItems
    })
  }

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter(
        (i) =>
          !(
            i.product_id === productId &&
            i.color === color &&
            i.size === size
          )
      )
      saveCart(newItems)
      return newItems
    })
  }

  const updateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size)
      return
    }
    setCartItems((prevItems) => {
      const newItems = prevItems.map((i) =>
        i.product_id === productId && i.color === color && i.size === size
          ? { ...i, quantity }
          : i
      )
      saveCart(newItems)
      return newItems
    })
  }

  const clearCart = () => {
    const newItems: CartItem[] = []
    saveCart(newItems)
    setCartItems(newItems)
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
        isLoading,
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
