import { useState, useEffect } from "react";
import { Search, ShoppingCart, Heart, Home, LogIn, LogOut, X } from "lucide-react";
import { CartProvider, useCart } from "@/app/context/CartContext";
import { ShopHome } from "@/app/components/shop/ShopHome";
import { CartPage } from "@/app/components/shop/Cart";
import { OrderTrackingPage } from "@/app/components/shop/OrderTracking";
import { LoginModal } from "@/app/components/auth/LoginModal";
import { supabase } from "@/services/supabase";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<"shop" | "cart" | "order">("shop");
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { cartCount } = useCart();

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      console.log('Session data:', data);
      if (data.session) {
        console.log('User found:', data.session.user);
        setUser(data.session.user);
      } else {
        console.log('No session found');
      }
    };

    checkAuth();

    // Listen to auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsProfileOpen(false);
  };

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentPage("order");
  };

  return (
    <>
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

              {/* Search - Hidden for cart and order pages */}
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

                {/* Auth Button */}
                {user ? (
                  <div className="flex items-center gap-2 pl-4 border-l border-border relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
                      title="Click để xem thông tin"
                    >
                      {user.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full object-cover cursor-pointer border border-border"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold cursor-pointer">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 top-full mt-2 bg-white border border-border rounded-lg shadow-xl z-50 w-80">
                        {/* User Info Section */}
                        <div className="p-4 border-b border-border flex gap-3">
                          {user.user_metadata?.avatar_url ? (
                            <img
                              src={user.user_metadata.avatar_url}
                              alt="Avatar"
                              className="w-14 h-14 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold flex-shrink-0">
                              {user.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground text-sm">
                              {user.user_metadata?.full_name || 'Người dùng'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Đăng nhập lúc: {new Date().toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-2 gap-0 p-4 border-b border-border">
                          <div className="text-center py-2 border-r border-border">
                            <p className="text-lg font-bold text-foreground">0</p>
                            <p className="text-xs text-muted-foreground">Đơn hàng</p>
                          </div>
                          <div className="text-center py-2">
                            <p className="text-lg font-bold text-foreground">0 ₫</p>
                            <p className="text-xs text-muted-foreground">Tổng tiêu</p>
                          </div>
                        </div>

                        {/* Logout Button */}
                        <div className="p-4">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold py-2.5 px-4 rounded-lg transition-colors"
                          >
                            <LogOut size={18} />
                            Đăng Xuất
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Close overlay when clicking outside */}
                    {isProfileOpen && (
                      <button
                        onClick={() => setIsProfileOpen(false)}
                        className="fixed inset-0 z-40"
                        style={{ background: 'transparent' }}
                      />
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="flex flex-col items-center gap-0.5 text-foreground hover:text-primary transition-colors group pl-4 border-l border-border"
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

      {/* ── LOGIN MODAL ── */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
