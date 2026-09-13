'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface FavoriteProduct {
  product_id: string
  name: string
  price: number
  image_url?: string
  sku?: string
  created_at?: string
}

interface FavoritesContextType {
  favorites: FavoriteProduct[]
  addFavorite: (product: FavoriteProduct) => void
  removeFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('favorites')
      if (saved) {
        setFavorites(JSON.parse(saved))
      }
    } catch (err) {
      console.error('Error loading favorites:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('favorites', JSON.stringify(favorites))
      } catch (err) {
        console.error('Error saving favorites:', err)
      }
    }
  }, [favorites, isLoading])

  const addFavorite = (product: FavoriteProduct) => {
    setFavorites((prev) => {
      // Check if already exists
      if (prev.some((fav) => fav.product_id === product.product_id)) {
        return prev
      }
      return [
        ...prev,
        {
          ...product,
          created_at: new Date().toISOString(),
        },
      ]
    })
  }

  const removeFavorite = (productId: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.product_id !== productId))
  }

  const isFavorite = (productId: string) => {
    return favorites.some((fav) => fav.product_id === productId)
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return context
}
