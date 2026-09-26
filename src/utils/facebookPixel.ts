/**
 * Facebook Pixel Tracking Utility
 * Tracks standard events for Meta Pixel
 */

/**
 * Wait for fbp cookie to be created by Meta Pixel
 * Max wait time: 3 seconds
 */
export const waitForFbp = async (maxWait: number = 3000): Promise<string> => {
  if (typeof window === 'undefined') return ''
  
  const startTime = Date.now()
  
  while (Date.now() - startTime < maxWait) {
    const fbpCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('_fbp='))
      ?.split('=')[1]
    
    if (fbpCookie) {
      console.log('✅ [Meta Pixel] fbp cookie found after', Date.now() - startTime, 'ms')
      return fbpCookie
    }
    
    // Wait 100ms before checking again
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.warn('⏱️ [Meta Pixel] fbp cookie not found after', maxWait, 'ms')
  return ''
}

/**
 * Get fbp (Facebook Pixel ID) cookie value
 * fbp is used to identify unique users
 */
export const getFbp = (): string => {
  if (typeof window === 'undefined') return ''
  
  const fbpCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('_fbp='))
    ?.split('=')[1]
  
  if (fbpCookie) {
    console.log('🍪 [Meta Pixel] fbp cookie found:', fbpCookie)
  } else {
    console.log('⚠️ [Meta Pixel] fbp cookie NOT found - Meta Pixel may not have initialized yet')
  }
  
  return fbpCookie || ''
}

/**
 * Get fbc (Facebook Click ID) from URL parameter
 * fbc tracks the click that led to the conversion
 */
export const getFbc = (): string => {
  if (typeof window === 'undefined') return ''
  
  const fbcParam = new URLSearchParams(window.location.search).get('fbclid')
  if (fbcParam) {
    const fbc = `fb.1.${Date.now()}.${fbcParam}`
    console.log('🔗 [Meta Pixel] fbc from fbclid:', fbc)
    return fbc
  }
  
  // Try to get from sessionStorage
  const fbcStored = sessionStorage.getItem('_fbc')
  console.log('💾 [Meta Pixel] fbc from storage:', fbcStored)
  return fbcStored || ''
}

/**
 * Store fbc in sessionStorage for persistence across page loads
 */
export const storeFbc = () => {
  if (typeof window === 'undefined') return
  
  const fbclid = new URLSearchParams(window.location.search).get('fbclid')
  if (fbclid) {
    const fbc = `fb.1.${Date.now()}.${fbclid}`
    sessionStorage.setItem('_fbc', fbc)
    console.log('📍 [Meta Pixel] Stored fbc:', fbc)
  }
}

// Auto-store fbc on page load
if (typeof window !== 'undefined') {
  storeFbc()
}

export const trackPixelEvent = (eventName: string, data?: any) => {
  try {
    if (typeof window !== 'undefined') {
      // Check if fbq exists
      const fbq = (window as any).fbq
      if (fbq && typeof fbq === 'function') {
        // Add fbp and fbc to event data
        const eventData = {
          ...data,
          fbp: getFbp(),
          fbc: getFbc(),
        }
        
        // Remove empty fbp/fbc to keep data clean
        if (!eventData.fbp) delete eventData.fbp
        if (!eventData.fbc) delete eventData.fbc
        
        // Send to fbq
        fbq('track', eventName, eventData)
        console.log(`✅ [Meta Pixel] fbq('track', '${eventName}', ...)`, eventData)
        
        // Force immediate delivery
        if ((window as any).fbq && typeof (window as any).fbq === 'function') {
          try {
            // Try to force delivery using internal fbq method
            fbq('trackSingle', '1823205972392139', eventName, eventData)
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
 * Track Lead event (Khách hàng tiềm năng) with fbp + fbc (async)
 * Used when customer submits checkout form
 * Automatically waits for fbp cookie to be available
 */
export const trackLead = async (data?: any) => {
  // Wait for fbp to be available (max 2 seconds)
  const fbp = await waitForFbp(2000)
  
  const leadData = {
    ...data,
    fbp: fbp,
    fbc: getFbc(),
  }
  
  // Remove empty fbp/fbc
  if (!leadData.fbp) delete leadData.fbp
  if (!leadData.fbc) delete leadData.fbc
  
  console.log('🔔 [Meta Pixel] Tracking Lead event with fbp + fbc:', leadData)
  trackPixelEvent('Lead', leadData)
}

/**
 * Track AddToCart event with fbp + fbc (async)
 * Automatically waits for fbp cookie to be available
 */
export const trackAddToCart = async (data?: any) => {
  // Wait for fbp to be available (max 2 seconds)
  const fbp = await waitForFbp(2000)
  
  // Ensure we send proper parameters per Meta Pixel spec
  const trackData = {
    content_name: data?.content_name || 'Unknown Product',
    content_type: data?.content_type || 'product',
    content_ids: data?.content_ids || [],
    value: data?.value || 0,
    currency: data?.currency || 'VND',
    quantity: data?.quantity || 1,
    fbp: fbp,
    fbc: getFbc(),
  }
  
  // Remove empty fbp/fbc
  if (!trackData.fbp) delete trackData.fbp
  if (!trackData.fbc) delete trackData.fbc
  
  console.log('🛒 [Meta Pixel] Tracking AddToCart with fbp + fbc:', trackData)
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
