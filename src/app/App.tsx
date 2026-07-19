import { useState } from "react";
import { Search, ShoppingCart, Heart, Home, LogIn, LogOut } from "lucide-react";
import { CartProvider, useCart } from "@/app/context/CartContext";
import { ShopHome } from "@/app/components/shop/ShopHome";
import { CartPage } from "@/app/components/shop/Cart";
import { OrderTrackingPage } from "@/app/components/shop/OrderTracking";
import { supabase } from "@/services/supabase";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<"shop" | "cart" | "order">("shop");
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const { cartCount } = useCart();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentPage("order");
  };

  return (
    <div
      className="min-h-screen bg-background"
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
    >
      {/* ── HEADER ── */}
      <header className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          {/* Top row */}
          <div className="flex items-center gap-4 py-3">
            {/* Logo */}
            <button
              onClick={() => setCurrentPage("shop")}
              className="flex-shrink-0 mr-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-xl font-extrabold tracking-tight text-foreground uppercase">
                Thời Trang<span className="text-primary"> Đẹp</span>
              </span>
            </button>

            {/* Search - Only on shop page */}
            {currentPage === "shop" && (
              <div className="flex-1 max-w-xl">
                <div className="flex items-center border border-border rounded-md overflow-hidden bg-input-background">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="flex-1 px-3 py-2 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  />
                  <button className="px-4 py-2 bg-primary text-primary-foreground hover:bg-orange-600 transition-colors">
                    <Search size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Icons */}
            <div className="flex items-center gap-4 ml-auto">
              <button
                onClick={() => setCurrentPage("shop")}
                className="flex flex-col items-center gap-0.5 text-foreground hover:text-primary transition-colors group"
              >
                <Home size={20} strokeWidth={1.5} />
                <span className="text-xs text-muted-foreground group-hover:text-primary">Cửa Hàng</span>
              </button>
              <button className="flex flex-col items-center gap-0.5 text-foreground hover:text-primary transition-colors group">
                <Heart size={20} strokeWidth={1.5} />
                <span className="text-xs text-muted-foreground group-hover:text-primary">Yêu thích</span>
              </button>
              <button
                onClick={() => setCurrentPage("cart")}
                className="flex flex-col items-center gap-0.5 text-foreground hover:text-primary transition-colors group relative"
              >
                <div className="relative">
                  <ShoppingCart size={20} strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-primary">Giỏ hàng</span>
              </button>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex flex-col items-center gap-0.5 text-foreground hover:text-primary transition-colors group"
                >
                  <LogOut size={20} strokeWidth={1.5} />
                  <span className="text-xs text-muted-foreground group-hover:text-primary">Đăng Xuất</span>
                </button>
              ) : (
                <button
                  onClick={() => {/* Placeholder for login */}}
                  className="flex flex-col items-center gap-0.5 text-foreground hover:text-primary transition-colors group"
                >
                  <LogIn size={20} strokeWidth={1.5} />
                  <span className="text-xs text-muted-foreground group-hover:text-primary">Đăng Nhập</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── PAGE CONTENT ── */}
      <main>
        {currentPage === "shop" && <ShopHome />}
        {currentPage === "cart" && <CartPage />}
        {currentPage === "order" && <OrderTrackingPage orderId={selectedOrderId} />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
