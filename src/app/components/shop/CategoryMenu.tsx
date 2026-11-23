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

      const parents = (data || [])
        .filter(cat => cat.parent_id === null)
        .map(parent => ({
          ...parent,
          children: (data || []).filter(
            child => child.parent_id === parent.id
          )
        }))

      setParentCategories(parents)
    } catch (err) {
      console.error('Error loading categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (child: Category) => {
    onSelectCategory(child.id, child.name)
    setExpandedId(null)
  }

  if (loading) {
    return <div className="text-white text-sm">Loading...</div>
  }

  return (
    <div className="w-full">
      {/* MOBILE MENU */}
      <div className="flex flex-col gap-1 md:hidden">
        {parentCategories.map(parent => (
          <div key={parent.id} className="w-full">
            <button
              type="button"
              onClick={() =>
                setExpandedId(
                  expandedId === parent.id ? null : parent.id
                )
              }
              className="flex items-center justify-between w-full px-2 py-3 text-left text-white text-sm font-semibold hover:bg-blue-800 rounded-md"
            >
              <span className="break-words">
                {parent.name}
              </span>
              {parent.children && parent.children.length > 0 && (
                <span className="ml-2 flex-shrink-0">
                  {expandedId === parent.id ? '▲' : '▼'}
                </span>
              )}
            </button>

            {/* MOBILE SUBCATEGORIES */}
            {expandedId === parent.id &&
              parent.children &&
              parent.children.length > 0 && (
                <div className="flex flex-col bg-blue-950 rounded-md mt-1 mb-2 border border-blue-700 max-h-[60vh] overflow-y-auto">
                  {parent.children.map(child => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => handleSelect(child)}
                      className="w-full text-left px-5 py-3 text-sm text-white hover:bg-blue-800 border-b border-blue-800 last:border-b-0 break-words"
                    >
                      {child.name}
                    </button>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex md:flex-row md:items-center md:gap-6">
        {parentCategories.map(parent => (
          <div key={parent.id} className="relative group">
            <button
              type="button"
              onClick={() =>
                setExpandedId(
                  expandedId === parent.id ? null : parent.id
                )
              }
              className="flex items-center gap-1 text-white text-sm font-semibold whitespace-nowrap hover:opacity-90"
            >
              {parent.name}
              {parent.children && parent.children.length > 0 && (
                <span className="text-xs">▼</span>
              )}
            </button>

            {/* DESKTOP DROPDOWN */}
            {parent.children && parent.children.length > 0 && (
              <div
                className={`absolute left-0 top-full mt-2 bg-blue-900 border border-blue-700 rounded-md shadow-lg z-50 min-w-max max-h-[70vh] overflow-y-auto transition-opacity ${
                  expandedId === parent.id
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                } group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto`}
              >
                {parent.children.map(child => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => handleSelect(child)}
                    className="block w-full text-left px-4 py-3 text-sm text-white hover:bg-blue-800 whitespace-nowrap"
                  >
                    {child.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
