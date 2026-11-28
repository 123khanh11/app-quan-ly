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
   * This should be called after successful order creation
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

  /**
   * Send AddToCart event to Facebook Pixel
   */
  trackAddToCart: (data: {
    value: number
    currency: string
    content_name?: string
    content_id?: string
    quantity?: number
  }) => {
    try {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        const fbq = (window as any).fbq

        console.log('📊 Facebook Pixel AddToCart Event:', {
          value: data.value,
          currency: data.currency,
        })

        fbq('track', 'AddToCart', {
          value: data.value,
          currency: data.currency,
          content_name: data.content_name,
          content_id: data.content_id,
          quantity: data.quantity || 1,
        })

        console.log('✅ AddToCart event sent to Facebook Pixel')
      }
    } catch (error) {
      console.error('❌ Error tracking AddToCart:', error)
    }
  },

  /**
   * Send InitiateCheckout event to Facebook Pixel
   */
  trackInitiateCheckout: (data: {
    value: number
    currency: string
    num_items: number
  }) => {
    try {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        const fbq = (window as any).fbq

        console.log('📊 Facebook Pixel InitiateCheckout Event:', {
          value: data.value,
          currency: data.currency,
          num_items: data.num_items,
        })

        fbq('track', 'InitiateCheckout', {
          value: data.value,
          currency: data.currency,
          num_items: data.num_items,
          content_type: 'product_group',
        })

        console.log('✅ InitiateCheckout event sent to Facebook Pixel')
      }
    } catch (error) {
      console.error('❌ Error tracking InitiateCheckout:', error)
    }
  },
}
