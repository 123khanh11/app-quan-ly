/**
 * VietQR Service - Generate QR codes for bank transfers
 * Specs: https://vietqr.io/
 */

export interface VietQRPayload {
  bank_id: string // Mã ngân hàng
  account_number: string // Số tài khoản
  amount?: number // Số tiền (VND)
  description: string // Nội dung chuyển khoản
  account_name?: string // Tên tài khoản
}

// MB Bank code for VietQR
const MB_BANK_ID = '970422'
const MB_ACCOUNT = '0865816910'

/**
 * Generate VietQR QR code image URL
 * @param accountNumber - Bank account number
 * @param amount - Amount in VND (optional)
 * @param description - Transfer description (e.g., order ID)
 * @returns QR code image URL
 */
export function generateVietQRUrl(
  amount: number | undefined,
  description: string,
  accountNumber: string = MB_ACCOUNT,
  bankId: string = MB_BANK_ID
): string {
  // VietQR API format
  const params = new URLSearchParams({
    accountNo: accountNumber,
    accountName: 'E-Commerce Store',
    acqId: bankId,
    addInfo: description,
    template: 'compact',
  })

  if (amount && amount > 0) {
    params.append('amount', String(amount))
  }

  return `https://img.vietqr.io/image/${bankId}-${accountNumber}-compact.png?${params.toString()}`
}

/**
 * Get bank transfer details for manual entry
 */
export function getBankTransferDetails(description: string) {
  return {
    bank: 'MB Bank (Ngân hàng Quân đội)',
    accountNumber: MB_ACCOUNT,
    accountName: 'E-Commerce Store',
    description: description,
    bankCode: MB_BANK_ID,
  }
}

/**
 * Format transfer content for Excel-like display
 */
export function formatTransferContent(orderId: string): string {
  return `DH${orderId.substring(0, 8).toUpperCase()}`
}
