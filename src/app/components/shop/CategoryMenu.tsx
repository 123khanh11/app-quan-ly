'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/services/supabase'

interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  children?: Category[]
}

interface CategoryMenuProps {
  onSelectCategory: (categoryId: string, categoryName: string) => void
}

export function CategoryMenu({ onSelectCategory }: CategoryMenuProps) {
  const [parentCategories, setParentCategories] = useState<Category[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error) throw error

      // Build hierarchy
      const parents = data.filter(cat => cat.parent_id === null)
      parents.forEach(parent => {
        parent.children = data.filter(cat => cat.parent_id === parent.id)
      })

      setParentCategories(parents)
    } catch (err) {
      console.error('Error loading categories:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-white text-sm">Loading...</div>

  return (
    <div className="flex gap-6">
      {parentCategories.map(parent => (
        <div key={parent.id} className="relative group">
          <button
            onClick={() => setExpandedId(expandedId === parent.id ? null : parent.id)}
            className="text-white text-sm font-semibold hover:opacity-90 flex items-center gap-1"
          >
            {parent.name}
            {parent.children && parent.children.length > 0 && (
              <span className="text-xs">▼</span>
            )}
          </button>

          {/* Dropdown - Subcategories - FULL WIDTH */}
          {parent.children && parent.children.length > 0 && (
            <div className="absolute left-0 top-full mt-2 bg-blue-900 border border-blue-700 rounded-md shadow-lg z-50 min-w-max opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
              {parent.children.map(child => (
                <button
                  key={child.id}
                  onClick={() => {
                    onSelectCategory(child.id, child.name)
                    setExpandedId(null)
                  }}
                  className="block w-full text-left px-4 py-3 text-sm text-white hover:bg-blue-800 transition-colors whitespace-nowrap"
                >
                  {child.name}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
