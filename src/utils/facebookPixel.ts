/**
 * Facebook Pixel Tracking Utility
 * Tracks standard events for Meta Pixel
 */

export const trackPixelEvent = (eventName: string, data?: any) => {
  try {
    if (typeof window !== 'undefined') {
      // Wait for fbq to be available
      if ((window as any).fbq) {
        (window as any).fbq('track', eventName, data || {})
        console.log(`✅ [Meta Pixel] Event tracked: ${eventName}`, data)
        return true
      } else {
        console.warn(`⚠️ [Meta Pixel] fbq not available yet for event: ${eventName}`)
        // Retry after a short delay
        setTimeout(() => {
          if ((window as any).fbq) {
            (window as any).fbq('track', eventName, data || {})
            console.log(`✅ [Meta Pixel] Event tracked (retry): ${eventName}`, data)
          }
        }, 500)
        return false
      }
    }
  } catch (error) {
    console.error(`❌ [Meta Pixel] Error tracking event: ${eventName}`, error)
    return false
  }
}

/**
 * Track Lead event (Khách hàng tiềm năng)
 * Used when customer submits checkout form
 */
export const trackLead = (data?: any) => {
  console.log('🔔 [Meta Pixel] Attempting to track Lead event...')
  trackPixelEvent('Lead', data || {})
}

/**
 * Track AddToCart event
 */
export const trackAddToCart = (data?: any) => {
  trackPixelEvent('AddToCart', data || {})
}

/**
 * Track Purchase event
 */
export const trackPurchase = (value: number, currency: string = 'VND') => {
  trackPixelEvent('Purchase', {
    value: value,
    currency: currency,
  })
}

/**
 * Track InitiateCheckout event
 */
export const trackInitiateCheckout = (data?: any) => {
  trackPixelEvent('InitiateCheckout', data || {})
}

/**
 * Track ViewContent event
 */
export const trackViewContent = (data?: any) => {
  trackPixelEvent('ViewContent', data || {})
}
