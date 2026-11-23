'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface VariantProduct {
  sku: string
  color?: string
  size?: string
  price: number
  stock: number
}

interface VariantModalProps {
  variant: {
    color?: string
    size?: string
    variant_id: string
  } | null
  products: VariantProduct[]
  isOpen: boolean
  onClose: () => void
}

export function VariantModal({ variant, products, isOpen, onClose }: VariantModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen || !variant) {
    return null
  }

  const variantLabel = `${variant.color || 'Không có màu'}${variant.size ? ' - ' + variant.size : ''}`

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <div
          className="bg-card rounded-t-lg sm:rounded-lg border border-border w-full sm:max-w-md max-h-[90vh] flex flex-col shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-4 sm:px-6">
            <h2 className="text-lg font-bold text-foreground leading-tight pr-4">
              Sản phẩm thuộc loại<br className="sm:hidden" /> {variantLabel}
            </h2>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label="Đóng"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {products.length > 0 ? (
              <div className="divide-y divide-border">
                {products.map((product) => (
                  <div
                    key={product.sku}
                    className="px-4 py-3 sm:px-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">
                        {product.color && <span>{product.color}</span>}
                        {product.color && product.size && <span> - </span>}
                        {product.size && <span>{product.size}</span>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        SKU: {product.sku}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right ml-4">
                      <div className="text-sm font-bold text-primary">
                        {product.price.toLocaleString('vi-VN')}đ
                      </div>
                      <div className={`text-xs mt-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 sm:px-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Không có sản phẩm trong loại này
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-4 py-3 sm:px-6 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 bg-muted text-foreground font-semibold py-2 rounded-lg hover:bg-muted/80 transition-colors text-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
