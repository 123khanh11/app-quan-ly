// ========================================
// Address Parser
// File: src/lib/parseAddress.js
// ========================================

/**
 * Parse shipping address từ format string
 * Format: "Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
 * 
 * Trả về:
 * {
 *   detail: "Số 123 Đường Lê Lợi",           // Địa chỉ chi tiết
 *   ward: "Phường Bến Thành",                // Xã/Phường
 *   district: "Quận 1",                       // Quận/Huyện
 *   province: "TP. Hồ Chí Minh"               // Tỉnh/Thành phố
 * }
 */
export function parseAddress(address) {
  if (!address || address.trim() === '') {
    return {
      detail: '',
      ward: '',
      district: '',
      province: ''
    }
  }

  // Format: "detail, ward, district, province"
  const parts = address.split(', ')

  return {
    detail: (parts[0] || '').trim(),
    ward: (parts[1] || '').trim(),
    district: (parts[2] || '').trim(),
    province: (parts[3] || '').trim()
  }
}

/**
 * Lấy tóm tắt địa chỉ
 * VD: "Quận 1, TP. Hồ Chí Minh"
 */
export function getAddressSummary(address) {
  const addr = parseAddress(address)
  const parts = []
  
  if (addr.district) parts.push(addr.district)
  if (addr.province) parts.push(addr.province)
  
  return parts.join(', ') || 'Chưa có thông tin'
}

/**
 * Lấy địa chỉ đầy đủ
 * VD: "TP. Hồ Chí Minh, Quận 1, Phường Bến Thành, Số 123 Đường Lê Lợi"
 */
export function getFullAddress(address) {
  const addr = parseAddress(address)
  const parts = []
  
  if (addr.province) parts.push(addr.province)
  if (addr.district) parts.push(addr.district)
  if (addr.ward) parts.push(addr.ward)
  if (addr.detail) parts.push(addr.detail)
  
  return parts.join(', ') || 'Chưa có thông tin'
}

/**
 * Format địa chỉ thành HTML (với icons)
 */
export function formatAddressHTML(address) {
  const addr = parseAddress(address)
  
  if (!addr.province && !addr.district && !addr.ward && !addr.detail) {
    return '<p style="color: #999;">Chưa có thông tin địa chỉ</p>'
  }

  let html = ''
  
  if (addr.province) {
    html += `<p><strong>🏙️ Tỉnh/Thành phố:</strong> ${addr.province}</p>`
  }
  
  if (addr.district) {
    html += `<p><strong>🏘️ Quận/Huyện:</strong> ${addr.district}</p>`
  }
  
  if (addr.ward) {
    html += `<p><strong>🏘️ Xã/Phường:</strong> ${addr.ward}</p>`
  }
  
  if (addr.detail) {
    html += `<p><strong>🏠 Địa chỉ chi tiết:</strong> ${addr.detail}</p>`
  }
  
  return html
}

/**
 * Tạo địa chỉ từ các phần riêng
 * Ngược lại với parseAddress
 */
export function buildAddress(detail, ward, district, province) {
  const parts = []
  
  if (detail) parts.push(detail)
  if (ward) parts.push(ward)
  if (district) parts.push(district)
  if (province) parts.push(province)
  
  return parts.join(', ')
}
