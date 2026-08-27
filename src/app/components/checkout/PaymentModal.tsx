'use client'

import { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'
import { generateVietQRUrl, getBankTransferDetails, formatTransferContent } from '@/services/vietqr'

interface PaymentModalProps {
  orderId: string
  orderTotal: number
  onClose: () => void
  onConfirmPayment: (paymentMethod: 'bank_transfer' | 'cod') => void
}

export function PaymentModal({ orderId, orderTotal, onClose, onConfirmPayment }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'cod'>('cod')
  const [copied, setCopied] = useState(false)

  const transferContent = formatTransferContent(orderId)
  const bankDetails = getBankTransferDetails(transferContent)
  const qrUrl = generateVietQRUrl(orderTotal, transferContent)

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(bankDetails.accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyContent = () => {
    navigator.clipboard.writeText(transferContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirm = () => {
    onConfirmPayment(paymentMethod)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border sticky top-0 bg-white">
          <h2 className="text-xl font-bold">Chọn Phương Thức Thanh Toán</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Payment Method Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* COD Option */}
            <button
              onClick={() => setPaymentMethod('cod')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                paymentMethod === 'cod'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary'
              }`}
            >
              <div className="font-bold text-lg mb-2">💵 Thanh Toán Khi Nhận Hàng</div>
              <p className="text-sm text-muted-foreground">
                Bạn sẽ thanh toán khi nhận hàng từ shipper. Đơn hàng sẽ được gửi ngay.
              </p>
            </button>

            {/* Bank Transfer Option */}
            <button
              onClick={() => setPaymentMethod('bank_transfer')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                paymentMethod === 'bank_transfer'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary'
              }`}
            >
              <div className="font-bold text-lg mb-2">🏦 Chuyển Khoản Ngân Hàng</div>
              <p className="text-sm text-muted-foreground">
                Chuyển khoản qua MB Bank và nhận hàng nhanh. Quét QR hoặc nhập thông tin.
              </p>
            </button>
          </div>

          {/* Bank Transfer Details */}
          {paymentMethod === 'bank_transfer' && (
            <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Số Tiền</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={orderTotal.toLocaleString('vi-VN')}
                      readOnly
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-white"
                    />
                    <span className="text-sm font-medium">VNĐ</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Ngân Hàng</p>
                  <input
                    type="text"
                    value={bankDetails.bank}
                    readOnly
                    className="w-full px-3 py-2 border border-border rounded-lg bg-white"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Số Tài Khoản</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bankDetails.accountNumber}
                      readOnly
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-white font-mono"
                    />
                    <button
                      onClick={handleCopyAccount}
                      className="p-2 hover:bg-white rounded-lg border border-border"
                    >
                      {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Nội Dung Chuyển Khoản</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={transferContent}
                      readOnly
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-white font-mono font-bold"
                    />
                    <button
                      onClick={handleCopyContent}
                      className="p-2 hover:bg-white rounded-lg border border-border"
                    >
                      {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    💡 Dùng nội dung này để mã đơn hàng của bạn được xác nhận tự động
                  </p>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center pt-4 border-t border-blue-200">
                <p className="text-sm font-medium mb-3">Quét Mã QR</p>
                <img
                  src={qrUrl}
                  alt="VietQR"
                  className="w-48 h-48 border border-border rounded-lg"
                />
              </div>
            </div>
          )}

          {/* COD Info */}
          {paymentMethod === 'cod' && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-2">
              <p className="font-medium text-green-900">ℹ️ Thông Tin Thanh Toán Khi Nhận Hàng</p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>✓ Thanh toán tiền mặt khi nhận hàng từ shipper</li>
                <li>✓ Không cần chuyển khoản trước</li>
                <li>✓ Kiểm tra hàng trước khi thanh toán</li>
                <li>✓ Đơn hàng sẽ được xử lý ngay</li>
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-border bg-muted">
          <button
            onClick={onClose}
            className="flex-1 border border-border font-semibold py-2 rounded-lg hover:bg-white"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-primary text-white font-semibold py-2 rounded-lg hover:bg-orange-600"
          >
            Xác Nhận
          </button>
        </div>
      </div>
    </div>
  )
}
