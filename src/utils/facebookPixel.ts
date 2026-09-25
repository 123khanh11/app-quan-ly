/**
 * Facebook Pixel Tracking Utility
 * Tracks standard events for Meta Pixel
 */

export const trackPixelEvent = (eventName: string, data?: any) => {
  try {
    if (typeof window !== 'undefined') {
      // Check if fbq exists
      const fbq = (window as any).fbq
      if (fbq && typeof fbq === 'function') {
        // Send to fbq
        fbq('track', eventName, data || {})
        console.log(`✅ [Meta Pixel] fbq('track', '${eventName}', ...)`, data)
        
        // Force immediate delivery
        if ((window as any).fbq && typeof (window as any).fbq === 'function') {
          try {
            // Try to force delivery using internal fbq method
            fbq('trackSingle', '1823205972392139', eventName, data || {})
            console.log(`📤 [Meta Pixel] Forced single track for: ${eventName}`)
          } catch (e) {
            console.log(`📝 [Meta Pixel] Single track not available, using standard track`)
          }
        }
        
        // Verify fbq.queue has the event
        if ((window as any)._fbq && (window as any)._fbq.queue) {
          console.log(`📊 [Meta Pixel] Queue length:`, (window as any)._fbq.queue.length)
        }
        
        // Additional verification: check if fbq internals exist
        console.log(`🔍 [Meta Pixel] fbq.loaded:`, fbq.loaded)
        console.log(`🔍 [Meta Pixel] fbq.version:`, fbq.version)
        
        return true
      } else {
        console.warn(`⚠️ [Meta Pixel] fbq function not available`)
        // Check if window has _fbq (internal reference)
        if ((window as any)._fbq) {
          console.warn(`⚠️ [Meta Pixel] _fbq exists but fbq alias is missing`)
        }
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
  console.log('🔔 [Meta Pixel] Tracking Lead event with data:', data)
  trackPixelEvent('Lead', data || {})
}

/**
 * Track AddToCart event
 */
export const trackAddToCart = (data?: any) => {
  // Ensure we send proper parameters per Meta Pixel spec
  const trackData = {
    content_name: data?.content_name || 'Unknown Product',
    content_type: data?.content_type || 'product',
    content_ids: data?.content_ids || [],
    value: data?.value || 0,
    currency: data?.currency || 'VND',
    quantity: data?.quantity || 1,
  }
  
  console.log('🛒 [Meta Pixel] Tracking AddToCart with proper format:', trackData)
  trackPixelEvent('AddToCart', trackData)
}

/**
 * Track Purchase event
 */
export const trackPurchase = (value: number, currency: string = 'VND') => {
  console.log(`💳 [Meta Pixel] Tracking Purchase event: ${value} ${currency}`)
  trackPixelEvent('Purchase', {
    value: value,
    currency: currency,
  })
}

/**
 * Track InitiateCheckout event
 */
export const trackInitiateCheckout = (data?: any) => {
  console.log('💰 [Meta Pixel] Tracking InitiateCheckout event')
  trackPixelEvent('InitiateCheckout', data || {})
}

/**
 * Track ViewContent event
 */
export const trackViewContent = (data?: any) => {
  console.log('👁️ [Meta Pixel] Tracking ViewContent event')
  trackPixelEvent('ViewContent', data || {})
}
