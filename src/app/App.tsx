import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import { CartProvider, useCart } from "@/app/context/CartContext";
import { FavoritesProvider } from "@/app/context/FavoritesContext";
import { ShopHome } from "@/app/components/shop/ShopHome";
import { CartPage } from "@/app/components/shop/Cart";
import { OrderTrackingPage } from "@/app/components/shop/OrderTracking";
import { FavoritesPage } from "@/app/components/shop/FavoritesPage";
import { ProductDetail } from "@/app/pages/ProductDetail";
import { LoginModal } from "@/app/components/auth/LoginModal";
import { ShopHeader } from "@/app/components/layout/ShopHeader";
import { ShopFooter } from "@/app/components/layout/ShopFooter";
import { supabase } from "@/services/supabase";

// Product Detail Page Component
function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  if (!productId) {
    return <div>Product not found</div>;
  }

  return (
    <ProductDetail 
      productId={productId}
      onClose={() => navigate('/')}
    />
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<"shop" | "cart" | "order" | "favorites">("shop");
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { cartCount } = useCart();
  const navigate = useNavigate();

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
        className="min-h-screen w-full bg-background flex flex-col"
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      >
        {/* SHOP HEADER WITH INFO */}
        <ShopHeader 
          onNavigate={(page) => {
            if (page === 'shop') {
              setCurrentPage('shop')
              navigate('/')
            }
            else if (page === 'cart') {
              setCurrentPage('cart')
              navigate('/cart')
            }
            else if (page === 'favorites') {
              setCurrentPage('favorites')
              navigate('/favorites')
            }
            else if (page === 'account') setIsLoginOpen(true)
          }}
          onSelectCategory={handleSelectCategory}
        />

        {/* ── PAGE CONTENT ── */}
        <main>
          <Routes>
            <Route path="/" element={
              <ShopHome
                selectedCategoryId={selectedCategoryId}
                selectedCategoryName={selectedCategoryName}
                onClearCategory={handleClearCategory}
              />
            } />
            <Route path="/products/:productId" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/order/:orderId" element={<OrderTrackingPage orderId={selectedOrderId} />} />
          </Routes>
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
    <BrowserRouter>
      <CartProvider>
        <FavoritesProvider>
          <AppContent />
        </FavoritesProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
