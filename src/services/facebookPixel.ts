/**
 * Facebook Pixel Helper Service
 * Handles sending conversion events to Facebook Pixel
 */

interface PurchaseEventData {
  value: number // Total amount in VND
  currency: string // 'VND'
  content_name?: string // Order name or description
  content_type?: string // 'product' or 'product_group'
  contents?: Array<{
    id: string // Product ID
    quantity: number
    title?: string
    price?: number
  }>
  num_items?: number
  fbp?: string // Facebook Pixel ID
  fbc?: string // Facebook Click ID
}

export const facebookPixelService = {
  /**
   * Send Purchase event to Facebook Pixel
   * This should be called when user clicks "Xác Nhận" to start checkout
   */
  trackPurchase: (data: PurchaseEventData) => {
    try {
      // Check if fbq (Facebook Pixel) is available
      if (typeof window !== 'undefined' && (window as any).fbq) {
        const fbq = (window as any).fbq

        // Log to console for debugging
        console.log('📊 Facebook Pixel Purchase Event:', {
          value: data.value,
          currency: data.currency,
          num_items: data.num_items,
          content_type: data.content_type || 'product_group',
        })

        // Send Purchase event
        fbq('track', 'Purchase', {
          value: data.value,
          currency: data.currency,
          content_name: data.content_name || 'Order',
          content_type: data.content_type || 'product_group',
          content_ids: data.contents ? data.contents.map(c => c.id) : [],
          contents: data.contents || [],
          num_items: data.num_items || 1,
          fbp: data.fbp,
          fbc: data.fbc,
        })

        console.log('✅ Purchase event sent to Facebook Pixel')
      } else {
        console.warn('⚠️ Facebook Pixel (fbq) not loaded yet')
      }
    } catch (error) {
      console.error('❌ Error tracking purchase to Facebook Pixel:', error)
    }
  },
}
