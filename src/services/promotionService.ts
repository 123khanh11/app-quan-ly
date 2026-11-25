import { supabase } from './supabase'

export interface ProductPromotion {
  id: string
  product_id: string
  min_quantity: number
  promotion_type: 'free_shipping' | 'percentage_discount' | 'fixed_discount'
  promotion_value: number
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export const promotionService = {
  /**
   * Lấy tất cả khuyến mại của một sản phẩm
   */
  async getProductPromotions(productId: string): Promise<ProductPromotion[]> {
    try {
      const { data, error } = await supabase
        .from('product_promotions')
        .select('*')
        .eq('product_id', productId)
        .eq('is_active', true)
        .order('min_quantity', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('❌ Error fetching promotions:', error)
      return []
    }
  },

  /**
   * Tính toán khuyến mại dựa trên số lượng
   * Trả về khuyến mại phù hợp nhất (số lượng cao nhất)
   */
  calculatePromotion(
    promotions: ProductPromotion[],
    quantity: number
  ): ProductPromotion | null {
    if (!promotions || promotions.length === 0) {
      return null
    }

    // Tìm khuyến mại phù hợp với số lượng (từ cao xuống)
    let applicablePromo: ProductPromotion | null = null
    for (let i = promotions.length - 1; i >= 0; i--) {
      if (quantity >= promotions[i].min_quantity) {
        applicablePromo = promotions[i]
        break
      }
    }

    return applicablePromo
  },

  /**
   * Tính giá sau khuyến mại
   */
  calculateDiscountedPrice(
    originalPrice: number,
    promotion: ProductPromotion | null
  ): number {
    if (!promotion) return originalPrice

    switch (promotion.promotion_type) {
      case 'percentage_discount':
        return originalPrice * (1 - promotion.promotion_value / 100)

      case 'fixed_discount':
        return Math.max(0, originalPrice - promotion.promotion_value)

      case 'free_shipping':
        // Khuyến mại này không ảnh hưởng đến giá sản phẩm
        return originalPrice

      default:
        return originalPrice
    }
  },

  /**
   * Tính phí ship sau khuyến mại
   */
  calculateShippingFee(
    originalFee: number,
    promotion: ProductPromotion | null
  ): number {
    if (!promotion || promotion.promotion_type !== 'free_shipping') {
      return originalFee
    }
    return 0
  },

  /**
   * Lấy label khuyến mại để hiển thị
   */
  getPromoLabel(promotion: ProductPromotion): string {
    switch (promotion.promotion_type) {
      case 'free_shipping':
        return '📦 Miễn phí ship'
      case 'percentage_discount':
        return `💰 Giảm ${promotion.promotion_value}%`
      case 'fixed_discount':
        return `💵 Giảm ${promotion.promotion_value.toLocaleString('vi-VN')}₫`
      default:
        return 'Khuyến mại'
    }
  },

  /**
   * Tính tổng tiền tiết kiệm
   */
  calculateTotalSavings(
    originalPrice: number,
    discountedPrice: number,
    quantity: number
  ): number {
    return (originalPrice - discountedPrice) * quantity
  }
}
