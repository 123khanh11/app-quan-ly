import { useEffect, useState } from 'react'
import { getOrderDetails, Order, OrderItem } from '@/services/supabase'
import { CheckCircle2, Clock, Truck, MapPin } from 'lucide-react'

interface OrderTrackingPageProps {
  orderId: string
}

const STATUS_STEPS = [
  { key: 'pending', label: 'Chờ Xác Nhận', icon: Clock },
  { key: 'confirmed', label: 'Đã Xác Nhận', icon: CheckCircle2 },
  { key: 'shipping', label: 'Đang Giao Hàng', icon: Truck },
  { key: 'delivered', label: 'Đã Giao Hàng', icon: CheckCircle2 },
]

export function OrderTrackingPage({ orderId }: OrderTrackingPageProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true)
        const { order, items } = await getOrderDetails(orderId)
        setOrder(order)
        setItems(items)
      } catch (err) {
        console.error('Failed to load order:', err)
        setError(err instanceof Error ? err.message : 'Không thể tải đơn hàng')
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-lg">⏳ Đang tải thông tin đơn hàng...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-red-600 text-lg font-semibold mb-4">❌ {error || 'Không tìm thấy đơn hàng'}</p>
          <a href="/" className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-semibold hover:bg-orange-600 transition-colors">
            Quay Về Trang Chủ
          </a>
        </div>
      </div>
    )
  }

  const currentStatusIndex = STATUS_STEPS.findIndex((s) => s.key === order.order_status)

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">📦 Theo Dõi Đơn Hàng</h1>
          <p className="text-muted-foreground">Mã đơn: <span className="font-mono font-semibold text-foreground">{order.id}</span></p>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-lg font-bold mb-6">Trạng Thái Đơn Hàng</h2>
          <div className="flex items-center justify-between gap-2">
            {STATUS_STEPS.map((step, index) => {
              const IconComponent = step.icon
              const isCompleted = index <= currentStatusIndex
              const isCurrent = index === currentStatusIndex

              return (
                <div key={step.key} className="flex-1">
                  {/* Step Circle */}
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-2 transition-colors ${
                      isCompleted
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <IconComponent size={24} />
                  </div>
                  {/* Step Label */}
                  <p className={`text-sm text-center font-semibold ${
                    isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </p>
                  {/* Connecting Line */}
                  {index < STATUS_STEPS.length - 1 && (
                    <div
                      className={`h-1 mx-auto mt-2 transition-colors ${
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      }`}
                      style={{ width: 'calc(100% + 8px)', marginLeft: '-4px' }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Chi Tiết Đơn Hàng</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ngày Đặt:</span>
                <span className="font-semibold">
                  {new Date(order.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Trạng Thái Thanh Toán:</span>
                <span className={`font-semibold ${
                  order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {order.payment_status === 'paid' ? '✅ Đã Thanh Toán' : '⏳ Chờ Thanh Toán'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phương Thức Thanh Toán:</span>
                <span className="font-semibold">
                  {order.payment_method === 'cash' ? 'Tiền Mặt' : 'Chuyển Khoản'}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              Địa Chỉ Giao Hàng
            </h3>
            <div className="space-y-2 text-sm">
              {order.email && (
                <div>
                  <p className="text-muted-foreground">Email:</p>
                  <p className="font-semibold">{order.email}</p>
                </div>
              )}
              {order.phone && (
                <div>
                  <p className="text-muted-foreground">Số Điện Thoại:</p>
                  <p className="font-semibold">{order.phone}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Địa Chỉ:</p>
                <p className="font-semibold">{order.shipping_address}</p>
              </div>
              {order.note && (
                <div>
                  <p className="text-muted-foreground">Ghi Chú:</p>
                  <p className="font-semibold">{order.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-8 bg-card border border-border rounded-lg overflow-hidden">
          <div className="bg-muted border-b border-border px-6 py-4">
            <h3 className="font-bold text-lg">Các Sản Phẩm</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">ID Sản Phẩm</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Số Lượng</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">Giá</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">Tổng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono">{item.variant_id}</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold">{item.quantity}</td>
                    <td className="px-6 py-4 text-right text-sm font-semibold">
                      {item.price.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-primary">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Summary */}
          <div className="border-t border-border px-6 py-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tạm Tính:</span>
              <span className="font-semibold">{(order.total - order.shipping_fee).toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phí Vận Chuyển:</span>
              <span className="font-semibold">{order.shipping_fee.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-border pt-2 mt-2">
              <span>Tổng Cộng:</span>
              <span className="text-primary">{order.total.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-semibold hover:bg-orange-600 transition-colors"
          >
            Quay Về Cửa Hàng
          </a>
        </div>
      </div>
    </div>
  )
}
