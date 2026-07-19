import crypto from 'crypto'

// J&T API Configuration
const JNT_CONFIG = {
  USERNAME: process.env.REACT_APP_JNT_USERNAME || '',
  API_KEY: process.env.REACT_APP_JNT_API_KEY || '',
  KEY: process.env.REACT_APP_JNT_KEY || '6a35d330a55de6883ceeaca03cc4871c', // Default key from docs
  ORDER_URL: process.env.REACT_APP_JNT_ORDER_URL || '',
  TRACK_URL: process.env.REACT_APP_JNT_TRACK_URL || '',
  RATE_URL: process.env.REACT_APP_JNT_RATE_URL || '',
  CANCEL_URL: process.env.REACT_APP_JNT_CANCEL_URL || '',
}

// Generate signature (MD5 + Base64)
function generateSignature(data: string, key: string): string {
  const md5Hash = crypto.createHash('md5').update(data + key).digest('hex')
  return Buffer.from(md5Hash).toString('base64')
}

// Create Order with J&T
export async function createJNTOrder(orderData: {
  orderid: string
  shipper_name: string
  shipper_contact: string
  shipper_phone: string
  shipper_addr: string
  origin_code: string
  receiver_name: string
  receiver_phone: string
  receiver_addr: string
  receiver_zip: string
  destination_code: string
  receiver_area: string
  qty: number
  weight: number
  goodsdesc: string
  servicetype: number
  insurance: number
  orderdate: string
  item_name: string
  cod: number
  sendstarttime: string
  sendendtime: string
  expresstype: string
  goodsvalue: number
}) {
  try {
    const detail = {
      username: JNT_CONFIG.USERNAME,
      api_key: JNT_CONFIG.API_KEY,
      ...orderData,
    }

    const dataJson = JSON.stringify({ detail: [detail] })
    const signature = generateSignature(dataJson, JNT_CONFIG.KEY)

    const formData = new FormData()
    formData.append('data_param', dataJson)
    formData.append('data_sign', signature)

    const response = await fetch(JNT_CONFIG.ORDER_URL, {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (result.success) {
      return {
        success: true,
        awb: result.detail[0]?.awb_no,
        etd: result.detail[0]?.etd,
        message: result.desc,
      }
    } else {
      return {
        success: false,
        error: result.detail[0]?.reason || 'Failed to create order',
        message: result.desc,
      }
    }
  } catch (error) {
    console.error('JNT Create Order Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Track Order with J&T
export async function trackJNTOrder(awb: string) {
  try {
    const requestData = {
      awb: awb,
      eccompanyid: JNT_CONFIG.USERNAME,
    }

    const jsonData = JSON.stringify(requestData)

    const response = await fetch(JNT_CONFIG.TRACK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${JNT_CONFIG.USERNAME}:${JNT_CONFIG.API_KEY}`).toString('base64'),
      },
      body: jsonData,
    })

    const result = await response.json()

    return result
  } catch (error) {
    console.error('JNT Track Error:', error)
    return {
      error_id: '500',
      error_message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Get Shipping Rate
export async function getJNTRate(params: {
  weight: number
  sendSiteCode: string
  destAreaCode: string
}) {
  try {
    const data = {
      weight: params.weight,
      sendSiteCode: params.sendSiteCode,
      destAreaCode: params.destAreaCode,
      cusName: JNT_CONFIG.USERNAME,
      productType: 'EZ',
    }

    const dataJson = JSON.stringify(data)
    const signature = generateSignature(dataJson, JNT_CONFIG.KEY)

    const formData = new FormData()
    formData.append('data', dataJson)
    formData.append('sign', signature)

    const response = await fetch(JNT_CONFIG.RATE_URL, {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (result.is_success === 'true') {
      const services = JSON.parse(result.content)
      return {
        success: true,
        services: services,
      }
    } else {
      return {
        success: false,
        error: result.message,
      }
    }
  } catch (error) {
    console.error('JNT Rate Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Cancel Order
export async function cancelJNTOrder(orderid: string, remark: string) {
  try {
    const detail = {
      username: JNT_CONFIG.USERNAME,
      api_key: JNT_CONFIG.API_KEY,
      orderid: orderid,
      remark: remark,
    }

    const dataJson = JSON.stringify({ detail: [detail] })
    const signature = generateSignature(dataJson, JNT_CONFIG.KEY)

    const formData = new FormData()
    formData.append('data_param', dataJson)
    formData.append('data_sign', signature)

    const response = await fetch(JNT_CONFIG.CANCEL_URL, {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (result.success) {
      return {
        success: true,
        message: result.desc,
      }
    } else {
      return {
        success: false,
        error: result.detail[0]?.reason || 'Failed to cancel order',
      }
    }
  } catch (error) {
    console.error('JNT Cancel Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
