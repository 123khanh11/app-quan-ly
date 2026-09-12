import { useState, useEffect } from "react";
import { CartProvider, useCart } from "@/app/context/CartContext";
import { ShopHome } from "@/app/components/shop/ShopHome";
import { CartPage } from "@/app/components/shop/Cart";
import { OrderTrackingPage } from "@/app/components/shop/OrderTracking";
import { LoginModal } from "@/app/components/auth/LoginModal";
import { ShopHeader } from "@/app/components/layout/ShopHeader";
import { ShopFooter } from "@/app/components/layout/ShopFooter";
import { supabase } from "@/services/supabase";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<"shop" | "cart" | "order">("shop");
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
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

  const handleSelectCategory = (categoryId: string, categoryName: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
    setCurrentPage("shop");
  };

  const handleClearCategory = () => {
    setSelectedCategoryId("");
    setSelectedCategoryName("");
  };

  return (
    <>
      <div
        className="min-h-screen bg-background flex flex-col"
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      >
        {/* SHOP HEADER WITH INFO */}
        <ShopHeader />

        {/* ── HEADER ── */}
        <header className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
          <div className="max-w-6xl mx-auto px-4">
            {/* Top row */}
            <div className="flex items-center gap-4 py-3">
              {/* Search - Left side */}
              <div className="flex-1 max-w-md">
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

              {/* Logo - Center */}
              <button
                onClick={() => setCurrentPage("shop")}
                className="flex-shrink-0 hover:opacity-80 transition-opacity mx-4"
              >
                <span className="text-sm font-semibold text-gray-700">Cửa hàng</span>
              </button>

              {/* Icons */}
              <div className="flex items-center gap-4 ml-auto">
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main>
          {currentPage === "shop" && (
            <ShopHome
              selectedCategoryId={selectedCategoryId}
              selectedCategoryName={selectedCategoryName}
              onClearCategory={handleClearCategory}
            />
          )}
          {currentPage === "cart" && <CartPage />}
          {currentPage === "order" && <OrderTrackingPage orderId={selectedOrderId} />}
        </main>

        {/* SHOP FOOTER */}
        <ShopFooter />
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
