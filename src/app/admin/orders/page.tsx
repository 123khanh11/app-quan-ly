'use client'

import { useEffect, useState } from 'react'
import { getAllOrders, Order, OrderItem } from '@/services/supabase'
import { ChevronDown, Package, Loader } from 'lucide-react'

interface OrderWithItems extends Order {
  items: OrderItem[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)
        const data = await getAllOrders()
        setOrders(data)
        console.log('📊 Loaded orders:', data)
      } catch (err) {
        console.error('Failed to load orders:', err)
        setError(err instanceof Error ? err.message : 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
          <Loader className="animate-spin" size={24} />
          <p className="text-lg">Đang tải đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-red-600 text-lg font-semibold">❌ {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">📋 Quản Lý Đơn Hàng</h1>
          <p className="text-muted-foreground">Tổng cộng: <span className="font-bold text-foreground">{orders.length}</span> đơn hàng</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <Package size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-foreground">Mã: {order.id?.slice(0, 8)}...</p>
                        <p className="text-sm text-muted-foreground">
                          {order.created_at && new Date(order.created_at).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <p className="text-sm text-muted-foreground">Khách hàng</p>
                        <p className="font-semibold text-foreground">{order.customer_email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tổng tiền</p>
                        <p className="font-bold text-primary text-lg">
                          {order.total?.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.order_status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {order.order_status === 'pending' ? '⏳ Chờ' : 
                           order.order_status === 'processing' ? '📦 Xử lý' : 
                           order.order_status === 'shipped' ? '🚚 Giao' : '✅ Hoàn'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Order Details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-border bg-muted/30 px-6 py-4 space-y-6">
                    {/* Customer Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Email</p>
                        <p className="font-semibold text-foreground text-sm">{order.customer_email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Điện thoại</p>
                        <p className="font-semibold text-foreground text-sm">{order.customer_phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Phương thức</p>
                        <p className="font-semibold text-foreground text-sm">
                          {order.payment_method === 'cod' ? 'COD' : order.payment_method || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Thanh toán</p>
                        <p className={`font-semibold text-sm ${
                          order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {order.payment_status === 'paid' ? '✅ Đã' : '⏳ Chờ'}
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">Địa chỉ giao hàng</p>
                      <p className="text-sm text-foreground bg-background/50 rounded p-3 border border-border">
                        {order.shipping_address || 'N/A'}
                      </p>
                    </div>

                    {/* Order Items */}
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase mb-3">
                        Sản phẩm ({order.items?.length || 0})
                      </p>
                      {order.items && order.items.length > 0 ? (
                        <div className="space-y-2 bg-background/50 rounded p-3 border border-border">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between pb-2 border-b border-border/50 last:border-0 last:pb-0">
                              <div className="flex-1">
                                <p className="font-semibold text-foreground">{item.product_name}</p>
                                <div className="text-xs text-muted-foreground space-y-1">
                                  {item.color && <p>🎨 Màu: {item.color}</p>}
                                  {item.size && <p>📏 Size: {item.size}</p>}
                                  {item.sku && <p>🏷️ SKU: {item.sku}</p>}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">Số lượng: <span className="font-bold">{item.quantity}</span></p>
                                <p className="text-sm">Giá: <span className="font-bold">{item.price?.toLocaleString('vi-VN')}đ</span></p>
                                <p className="text-sm font-bold text-primary">
                                  Tổng: {(Number(item.price) * item.quantity).toLocaleString('vi-VN')}đ
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Không có sản phẩm</p>
                      )}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-background/50 rounded p-3 border border-border space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tạm tính:</span>
                        <span className="font-semibold">{order.total?.toLocaleString('vi-VN')}đ</span>
                      </div>
                      {order.shipping_fee && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Phí vận chuyển:</span>
                          <span className="font-semibold">{order.shipping_fee.toLocaleString('vi-VN')}đ</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-bold border-t border-border/50 pt-2">
                        <span>Tổng cộng:</span>
                        <span className="text-primary">
                          {(Number(order.total) + (Number(order.shipping_fee) || 0)).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>

                    {/* Notes */}
                    {order.note && (
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase mb-2">Ghi chú</p>
                        <p className="text-sm text-foreground bg-background/50 rounded p-3 border border-border whitespace-pre-wrap">
                          {order.note}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
