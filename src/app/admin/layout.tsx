import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🔧 Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Quản lý cửa hàng</p>
          </div>
          <nav className="flex items-center gap-6">
            <a href="/admin/orders" className="font-semibold text-foreground hover:text-primary transition-colors">
              📋 Đơn Hàng
            </a>
            <a href="/" className="font-semibold text-muted-foreground hover:text-primary transition-colors">
              ← Quay lại cửa hàng
            </a>
          </nav>
        </div>
      </header>

      {/* Content */}
      {children}
    </div>
  )
}
