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
        <ShopHeader onNavigate={(page) => {
          if (page === 'shop') setCurrentPage('shop')
          else if (page === 'cart') setCurrentPage('cart')
          else if (page === 'account') setIsLoginOpen(true)
        }} />



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
