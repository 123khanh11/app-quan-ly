/**
 * Facebook Pixel Tracking Utility
 * Tracks standard events for Meta Pixel
 */

export const trackPixelEvent = (eventName: string, data?: any) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, data)
    console.log(`[Facebook Pixel] Tracked event: ${eventName}`, data)
  } else {
    console.warn(`[Facebook Pixel] fbq not available or event not tracked: ${eventName}`)
  }
}

/**
 * Track Lead event (Khách hàng tiềm năng)
 * Used when customer submits checkout form
 */
export const trackLead = (data?: any) => {
  trackPixelEvent('Lead', data)
}

/**
 * Track AddToCart event
 */
export const trackAddToCart = (data?: any) => {
  trackPixelEvent('AddToCart', data)
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
  trackPixelEvent('InitiateCheckout', data)
}

/**
 * Track ViewContent event
 */
export const trackViewContent = (data?: any) => {
  trackPixelEvent('ViewContent', data)
}
