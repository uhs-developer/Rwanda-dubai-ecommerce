import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { ProductProvider, useProducts } from "../contexts/ProductContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { AdminRoute } from "../components/ProtectedRoute";
import { Header } from "../components/Header";
import { Homepage } from "../components/Homepage";
import { HomepageAPI } from "../components/HomepageAPI";
import { ProductListingPage } from "../components/ProductListingPage";
import { ProductListingPageAPI } from "../components/ProductListingPageAPI";
import { SearchResultsPage } from "../components/SearchResultsPage";
import { ProductDetailPage } from "../components/ProductDetailPage";
import { CartPage } from "../components/CartPage";
import { CheckoutPage } from "../components/CheckoutPage";
import { ThankYouPage } from "../components/ThankYouPage";
import { NotFoundPage } from "../components/NotFoundPage";
import { AuthPage } from "../components/AuthPage";
import { AboutPage } from "../components/AboutPage";
import { ContactPage } from "../components/ContactPage";
import { ReturnsWarrantyPage } from "../components/ReturnsWarrantyPage";
import { FAQPage } from "../components/FAQPage";
import { BlogPage } from "../components/BlogPage";
import { BlogDetailPage } from "../components/BlogDetailPage";
import { AccountDashboard } from "../components/AccountDashboard";
import { OrderHistoryPage } from "../components/OrderHistoryPage";
import { ProfileSettingsPage } from "../components/ProfileSettingsPage";
import { AddressBookPage } from "../components/AddressBookPage";
import { AccountSecurityPage } from "../components/AccountSecurityPage";
import { OfflinePage } from "../components/OfflinePage";
import { Footer } from "../components/Footer";
import { ShoppingCart, CartItem } from "../components/ShoppingCart";
import { MiniWishlist } from "../components/MiniWishlist";
import { FlashSalePopup } from "../components/FlashSalePopup";
import { Chatbot } from "../components/Chatbot";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";
import { Product, products } from "../data/products";
import { WishlistItem, getWishlistFromStorage, saveWishlistToStorage } from "../data/wishlist";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { useAuth } from "../contexts/AuthContext";
import { transformProductForDisplay } from "../services/product";
import AdminLayout from "../admin/AdminLayout";
import AdminDashboard from "../admin/AdminDashboard";
import AdminUsersPage from "../admin/pages/AdminUsersPage";
import CacheManagementPage from "../admin/pages/CacheManagementPage";
import AdminProfilePage from "../admin/pages/AdminProfilePage";
import CmsPagesPage from "../admin/pages/CmsPagesPage";
import CmsBlocksPage from "../admin/pages/CmsBlocksPage";
import AdminProductsPage from "../admin/pages/AdminProductsPage";
import AdminProductsPageGraphQL from "../admin/pages/AdminProductsPageGraphQL";
import AdminCategoriesPage from "../admin/pages/AdminCategoriesPage";
import AdminCategoriesPageGraphQL from "../admin/pages/AdminCategoriesPageGraphQL";
import AdminCustomersPage from "../admin/pages/AdminCustomersPage";
import AdminCustomersPageGraphQL from "../admin/pages/AdminCustomersPageGraphQL";
import AdminOrdersPage from "../admin/pages/AdminOrdersPage";
import AdminOrdersPageGraphQL from "../admin/pages/AdminOrdersPageGraphQL";
import AdminProductFormPage from "../admin/pages/AdminProductFormPage";
import AdminInvoicesPage from "../admin/pages/AdminInvoicesPage";
import AdminShipmentsPage from "../admin/pages/AdminShipmentsPage";
import AdminUsersManagementPage from "../admin/pages/AdminUsersManagementPage";
import AdminConfigurationPage from "../admin/pages/AdminConfigurationPage";

export function AppRouter() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <AppRouterContent />
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

function AppRouterContent() {
  const { user, logout } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [showFlashSale, setShowFlashSale] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [showOfflinePage, setShowOfflinePage] = useState(false);

  const isOnline = useOnlineStatus();

  // Load data from localStorage on mount
  useEffect(() => {
    // Load cart
    const savedCart = localStorage.getItem('rwanda-dubai-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }

    // Load wishlist
    setWishlistItems(getWishlistFromStorage());

    // Show flash sale popup on first visit
    const hasSeenFlashSale = localStorage.getItem('rwanda-dubai-flash-sale-seen');
    if (!hasSeenFlashSale) {
      setShowFlashSale(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('rwanda-dubai-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Handle offline status changes
  useEffect(() => {
    if (!isOnline) {
      setShowOfflinePage(true);
      toast.error('You are now offline. Some features may not be available.');
    } else if (showOfflinePage) {
      setShowOfflinePage(false);
      toast.success('You are back online!');
    }
  }, [isOnline, showOfflinePage]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast.success('Item removed from cart');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const addToWishlist = (product: Product) => {
    const newWishlistItem: WishlistItem = {
      ...product,
      dateAdded: new Date(),
    };

    setWishlistItems(prevItems => {
      const isAlreadyInWishlist = prevItems.some(item => item.id === product.id);
      if (isAlreadyInWishlist) {
        toast.info('Item already in wishlist');
        return prevItems;
      }
      const updatedItems = [...prevItems, newWishlistItem];
      saveWishlistToStorage(updatedItems);
      toast.success('Added to wishlist!');
      return updatedItems;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== productId);
      saveWishlistToStorage(updatedItems);
      toast.success('Removed from wishlist');
      return updatedItems;
    });
  };

  const handleProductClick = (_product: Product) => {
    const slug = (_product as any).slug ?? _product.id;
    window.location.assign(`/product/${slug}`);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
  };

  const handlePlaceOrder = (orderData: any) => {
    setOrderData(orderData);
    setCartItems([]); // Clear cart
    toast.success('Order placed successfully!');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleFlashSaleClose = () => {
    setShowFlashSale(false);
    localStorage.setItem('rwanda-dubai-flash-sale-seen', 'true');
  };

  const handleFlashSaleShop = () => {
    handleFlashSaleClose();
  };

  const handleOfflineTryAgain = () => {
    // Force refresh the page to check connection
    window.location.reload();
  };

  const handleOfflineGoHome = () => {
    setShowOfflinePage(false);
    // Navigate to home will be handled by the route
  };

  const handleOfflineViewCart = () => {
    setShowOfflinePage(false);
    setIsCartOpen(true);
  };

  const handleOfflineDismiss = () => {
    setShowOfflinePage(false);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistItemCount = wishlistItems.length;

  // Get related products for product detail page
  const getRelatedProducts = (product: Product) => {
    return products
      .filter(p =>
        p.id !== product.id &&
        (p.category === product.category || p.brand === product.brand)
      )
      .slice(0, 4);
  };

  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
      <div className="min-h-screen flex flex-col">
        {/* Header (hide on admin routes) */}
        {!isAdminPath && (
          <HeaderWrapper
            cartItemCount={cartItemCount}
            wishlistItemCount={wishlistItemCount}
            onWishlistClick={() => setIsWishlistOpen(true)}
            user={user}
            onLogout={handleLogout}
          />
        )}

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminLayout title="Products">
                    <AdminProductsPageGraphQL />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <AdminRoute>
                  <AdminLayout title="Add Product">
                    <AdminProductFormPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/:id/edit"
              element={
                <AdminRoute>
                  <AdminLayout title="Edit Product">
                    <AdminProductFormPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AdminRoute>
                  <AdminLayout title="Categories">
                    <AdminCategoriesPageGraphQL />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <AdminRoute>
                  <AdminLayout title="Customers">
                    <AdminCustomersPageGraphQL />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminLayout title="Users">
                    <AdminCustomersPageGraphQL />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminLayout title="Orders">
                    <AdminOrdersPageGraphQL />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/pages"
              element={
                <AdminRoute>
                  <AdminLayout title="Pages">
                    <CmsPagesPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/blocks"
              element={
                <AdminRoute>
                  <AdminLayout title="Blocks">
                    <CmsBlocksPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/admin-users"
              element={
                <AdminRoute>
                  <AdminLayout title="Admin Users & Roles">
                    <AdminUsersManagementPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/invoices"
              element={
                <AdminRoute>
                  <AdminLayout title="Invoices">
                    <AdminInvoicesPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/shipments"
              element={
                <AdminRoute>
                  <AdminLayout title="Shipments">
                    <AdminShipmentsPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/configuration"
              element={
                <AdminRoute>
                  <AdminLayout title="Configuration">
                    <AdminConfigurationPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/cache"
              element={
                <AdminRoute>
                  <AdminLayout title="Cache Management">
                    <CacheManagementPage />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <AdminRoute>
                  <AdminLayout title="Profile & Settings">
                    <AdminProfilePage />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route path="/" element={
              <HomepageAPI
                onAddToCart={addToCart}
                onAddToWishlist={addToWishlist}
                onProductClick={handleProductClick}
              />
            } />

            <Route path="/products" element={
              <ProductListingPageAPI
                onAddToCart={addToCart}
                onAddToWishlist={addToWishlist}
                onProductClick={handleProductClick}
              />
            } />

            <Route path="/deals" element={
              <ProductListingPage
                searchQuery=""
                onAddToCart={addToCart}
                onAddToWishlist={addToWishlist}
                onProductClick={handleProductClick}
              />
            } />

            <Route path="/new-arrivals" element={
              <ProductListingPage
                onAddToCart={addToCart}
                onAddToWishlist={addToWishlist}
                onProductClick={handleProductClick}
              />
            } />

            <Route path="/category/:categoryId" element={
              <CategoryPageWrapper
                onAddToCart={addToCart}
                onAddToWishlist={addToWishlist}
                onProductClick={handleProductClick}
              />
            } />

            <Route path="/category/:categoryId/:subcategory" element={
              <CategoryPageWrapper
                onAddToCart={addToCart}
                onAddToWishlist={addToWishlist}
                onProductClick={handleProductClick}
              />
            } />

            <Route path="/search" element={
              <SearchResultsPage
                onAddToCart={addToCart}
                onAddToWishlist={addToWishlist}
                onProductClick={handleProductClick}
              />
            } />

            <Route path="/product/:slug" element={
              <ProductDetailWrapper
                onAddToCart={addToCart}
                onAddToWishlist={addToWishlist}
                getRelatedProducts={getRelatedProducts}
                onRelatedProductClick={handleProductClick}
              />
            } />

            <Route path="/cart" element={
              <CartPage
                items={cartItems}
                onUpdateQuantity={updateCartQuantity}
                onRemoveItem={removeFromCart}
                onCheckout={handleCheckout}
                onContinueShopping={() => { }}
              />
            } />

            <Route path="/checkout" element={
              <CheckoutPage
                items={cartItems}
                onBack={() => { }}
                onPlaceOrder={handlePlaceOrder}
              />
            } />

            <Route path="/thank-you" element={
              <ThankYouPage
                orderData={orderData}
                onContinueShopping={() => { }}
                onTrackOrder={() => toast.info('Order tracking feature coming soon!')}
              />
            } />

            <Route path="/auth" element={<AuthPage />} />

            <Route path="/account" element={
              <ProtectedRoute>
                <AccountDashboardWrapper
                  user={user}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            } />

            <Route path="/orders" element={
              <ProtectedRoute>
                <OrderHistoryPageWrapper />
              </ProtectedRoute>
            } />

            <Route path="/profile-settings" element={
              <ProtectedRoute>
                <ProfileSettingsPageWrapper
                  user={user}
                />
              </ProtectedRoute>
            } />

            <Route path="/address-book" element={
              <ProtectedRoute>
                <AddressBookPageWrapper />
              </ProtectedRoute>
            } />

            <Route path="/account-security" element={
              <ProtectedRoute>
                <AccountSecurityPageWrapper />
              </ProtectedRoute>
            } />

            <Route path="/offline" element={
              <OfflinePage
                onTryAgain={handleOfflineTryAgain}
                onGoHome={handleOfflineGoHome}
                onViewCart={handleOfflineViewCart}
                onDismiss={handleOfflineDismiss}
                cartItemCount={cartItemCount}
              />
            } />

            <Route path="/about" element={
              <AboutPageWrapper />
            } />

            <Route path="/contact" element={
              <ContactPageWrapper />
            } />

            <Route path="/returns" element={
              <ReturnsWarrantyPageWrapper />
            } />

            <Route path="/faq" element={
              <FAQPageWrapper />
            } />

            <Route path="/blog" element={
              <BlogPageWrapper />
            } />

            <Route path="/blog/:articleId" element={
              <BlogDetailWrapper />
            } />

            <Route path="/wishlist" element={
              <ProductListingPage
                onAddToCart={addToCart}
                onAddToWishlist={addToWishlist}
                onProductClick={handleProductClick}
              />
            } />

            {/* Catch-all route for 404 */}
            <Route path="*" element={
              <NotFoundPage
                onNavigateHome={() => { }}
                onNavigateCategory={() => { }}
                onSearch={() => { }}
              />
            } />
          </Routes>
        </main>

        {/* Footer (hide on admin routes) */}
        {!isAdminPath && <Footer />}

        {/* Shopping Cart Sidebar */}
        <ShoppingCart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onCheckout={handleCheckout}
        />

        {/* Mini Wishlist */}
        <MiniWishlist
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          items={wishlistItems}
          onRemoveItem={removeFromWishlist}
          onAddToCart={(item) => addToCart(item)}
          onProductClick={handleProductClick}
          onViewAll={() => {
            setIsWishlistOpen(false);
          }}
        />

        {/* Flash Sale Popup */}
        {showFlashSale && (
          <FlashSalePopup
            onClose={handleFlashSaleClose}
            onShopNow={handleFlashSaleShop}
          />
        )}

        {/* Chatbot (hide on admin routes) */}
        {!isAdminPath && (
          <Chatbot
            onAddToCart={addToCart}
            onProductClick={handleProductClick}
            cartItems={cartItems}
            wishlistItems={wishlistItems}
          />
        )}

        {/* Offline Page Overlay */}
        {showOfflinePage && (
          <div className="fixed inset-0 z-50 bg-white">
            <OfflinePage
              onTryAgain={handleOfflineTryAgain}
              onGoHome={handleOfflineGoHome}
              onViewCart={handleOfflineViewCart}
              onDismiss={handleOfflineDismiss}
              cartItemCount={cartItemCount}
            />
          </div>
        )}

        {/* Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#343434',
              color: '#ffffff',
              border: 'none',
            },
          }}
        />
      </div>
  );
}

// Wrapper components to handle URL parameters
function HeaderWrapper({ cartItemCount, wishlistItemCount, onWishlistClick, user, onLogout }: any) {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleNavigation = (view: string, data?: any) => {
    switch (view) {
      case 'home':
        navigate('/');
        break;
      case 'products':
        navigate('/products');
        break;
      case 'deals':
        navigate('/deals');
        break;
      case 'new-arrivals':
        navigate('/new-arrivals');
        break;
      case 'cart':
        navigate('/cart');
        break;
      case 'auth':
        navigate('/auth');
        break;
      case 'account-dashboard':
        {
          const hasAdminRole = Array.isArray(user?.roles)
            ? user.roles.some((r: any) => ['superadmin', 'admin'].includes((r?.name || '').toLowerCase()))
            : false;
          navigate(hasAdminRole ? '/admin' : '/account');
        }
        break;
      case 'order-history':
        navigate('/orders');
        break;
      case 'settings':
        navigate('/profile-settings');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'returns':
        navigate('/returns');
        break;
      case 'faq':
        navigate('/faq');
        break;
      case 'blog':
        navigate('/blog');
        break;
      case 'category':
        if (data?.subcategory) {
          navigate(`/category/${data.category}/${data.subcategory}`);
        } else {
          navigate(`/category/${data.category}`);
        }
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Header
      cartItemCount={cartItemCount}
      wishlistItemCount={wishlistItemCount}
      onCartClick={() => navigate('/cart')}
      onWishlistClick={onWishlistClick}
      onSearchClick={handleSearch}
      onCategoryClick={handleCategoryClick}
      onNavigate={handleNavigation}
      user={user}
      onLogout={onLogout}
    />
  );
}

function CategoryPageWrapper({ onAddToCart, onAddToWishlist, onProductClick }: any) {
  const { categoryId, subcategory } = useParams();
  const navigate = useNavigate();

  return (
    <ProductListingPageAPI
      category={categoryId}
      subcategory={subcategory}
      onAddToCart={onAddToCart}
      onAddToWishlist={onAddToWishlist}
      onProductClick={onProductClick}
      onBack={() => navigate('/')}
    />
  );
}

function SearchPageWrapper({ onAddToCart, onAddToWishlist, onProductClick }: any) {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get('q') || '';

  return (
    <ProductListingPage
      searchQuery={query}
      onAddToCart={onAddToCart}
      onAddToWishlist={onAddToWishlist}
      onProductClick={onProductClick}
      onBack={() => navigate('/')}
    />
  );
}

function ProductDetailWrapper({ onAddToCart, onAddToWishlist }: any) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getProduct } = useProducts();
  const [loading, setLoading] = useState(true);
  const [displayProduct, setDisplayProduct] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!slug) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const product = await getProduct(slug);
      if (!isMounted) return;
      if (product) {
        setDisplayProduct(transformProductForDisplay(product));
      } else {
        setDisplayProduct(null);
      }
      setLoading(false);
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [slug, getProduct]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center text-muted-foreground">Loading product…</div>
      </div>
    );
  }

  if (!displayProduct) {
    return <NotFoundPage />;
  }

  return (
    <ProductDetailPage
      product={displayProduct as Product}
      onAddToCart={(p: Product, qty: number) => onAddToCart?.(p, qty)}
      onAddToWishlist={(p: Product) => onAddToWishlist?.(p)}
      onBack={() => navigate('/')}
      relatedProducts={[]}
      onRelatedProductClick={() => {}}
    />
  );
}

function BlogDetailWrapper() {
  const { articleId } = useParams();
  const navigate = useNavigate();

  return (
    <BlogDetailPage
      articleId={articleId}
      onBack={() => navigate('/blog')}
    />
  );
}

function AboutPageWrapper() {
  const navigate = useNavigate();
  return (
    <AboutPage
      onBack={() => navigate('/')}
    />
  );
}

function ContactPageWrapper() {
  const navigate = useNavigate();
  return (
    <ContactPage
      onBack={() => navigate('/')}
    />
  );
}

function ReturnsWarrantyPageWrapper() {
  const navigate = useNavigate();
  return (
    <ReturnsWarrantyPage
      onBack={() => navigate('/')}
    />
  );
}

function FAQPageWrapper() {
  const navigate = useNavigate();
  return (
    <FAQPage
      onBack={() => navigate('/')}
    />
  );
}

function BlogPageWrapper() {
  const navigate = useNavigate();
  return (
    <BlogPage
      onBack={() => navigate('/')}
    />
  );
}

function AccountDashboardWrapper({ user, onLogout }: any) {
  const navigate = useNavigate();

  return (
    <AccountDashboard
      user={user}
      onBack={() => navigate('/')}
      onNavigate={(view: string) => {
        switch (view) {
          case 'profile-settings':
            navigate('/profile-settings');
            break;
          case 'order-history':
            navigate('/orders');
            break;
          case 'address-book':
            navigate('/address-book');
            break;
          case 'account-security':
            navigate('/account-security');
            break;
          case 'wishlist':
            navigate('/wishlist');
            break;
          default:
            navigate('/');
        }
      }}
      onLogout={onLogout}
    />
  );
}

function OrderHistoryPageWrapper() {
  const navigate = useNavigate();
  return (
    <OrderHistoryPage
      onBack={() => navigate('/account')}
    />
  );
}

function ProfileSettingsPageWrapper({ user }: any) {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  return (
    <ProfileSettingsPage
      user={user}
      onBack={() => navigate('/account')}
      onUpdateUser={updateUser}
    />
  );
}

function AddressBookPageWrapper() {
  const navigate = useNavigate();
  return (
    <AddressBookPage
      onBack={() => navigate('/account')}
    />
  );
}

function AccountSecurityPageWrapper() {
  const navigate = useNavigate();
  return (
    <AccountSecurityPage
      onBack={() => navigate('/account')}
    />
  );
}
