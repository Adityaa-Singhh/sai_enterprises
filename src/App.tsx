import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar, { Footer, MobileBottomBar, WhatsAppFab } from './components/layout';
import { QuoteModal } from './components/ui';
import { ThemeProvider } from './context/ThemeContext';

// Admin Context & Layout & Shared Store
import { AuthProvider } from './admin/context/AuthContext';
import { AdminStoreProvider } from './admin/data/adminStore';
import { PublicStoreProvider, usePublicStore } from './data/publicStore';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { AdminLayout } from './admin/components/AdminLayout';
import { ElectricCanvas } from './components/ElectricCanvas';
import { trackPageView } from './services/analyticsService';

// Public Pages (Lazy Loaded)
const HomePage = lazy(() => import('./pages/Home'));
const ProductsPage = lazy(() => import('./pages/Products'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetail'));
const BrandsPage = lazy(() => import('./pages/Brands'));
const AboutPage = lazy(() => import('./pages/About'));
const GalleryPage = lazy(() => import('./pages/Gallery'));
const TestimonialsPage = lazy(() => import('./pages/Testimonials'));
const FAQPage = lazy(() => import('./pages/FAQ'));
const ContactPage = lazy(() => import('./pages/Contact'));

// Admin Pages (Lazy Loaded named exports)
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminAnalytics = lazy(() => import('./admin/pages/AdminAnalytics').then(m => ({ default: m.AdminAnalytics })));
const AdminProducts = lazy(() => import('./admin/pages/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminProductEdit = lazy(() => import('./admin/pages/AdminProductEdit').then(m => ({ default: m.AdminProductEdit })));
const AdminCategories = lazy(() => import('./admin/pages/AdminCategories').then(m => ({ default: m.AdminCategories })));
const AdminBrands = lazy(() => import('./admin/pages/AdminBrands').then(m => ({ default: m.AdminBrands })));
const AdminGallery = lazy(() => import('./admin/pages/AdminGallery').then(m => ({ default: m.AdminGallery })));
const AdminTestimonials = lazy(() => import('./admin/pages/AdminTestimonials').then(m => ({ default: m.AdminTestimonials })));
const AdminFAQs = lazy(() => import('./admin/pages/AdminFAQs').then(m => ({ default: m.AdminFAQs })));
const AdminEnquiries = lazy(() => import('./admin/pages/AdminEnquiries').then(m => ({ default: m.AdminEnquiries })));
const AdminBusinessInfo = lazy(() => import('./admin/pages/AdminBusinessInfo').then(m => ({ default: m.AdminBusinessInfo })));
const AdminHomepageCMS = lazy(() => import('./admin/pages/AdminHomepageCMS').then(m => ({ default: m.AdminHomepageCMS })));
const AdminUsers = lazy(() => import('./admin/pages/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminActivity = lazy(() => import('./admin/pages/AdminActivity').then(m => ({ default: m.AdminActivity })));
const AdminSettings = lazy(() => import('./admin/pages/AdminSettings').then(m => ({ default: m.AdminSettings })));
const AdminSecurityStates = lazy(() => import('./admin/pages/AdminSecurityStates').then(m => ({ default: m.AdminSecurityStates })));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(pathname);
  }, [pathname]);
  return null;
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-volt/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-volt animate-spin"></div>
      </div>
      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading Voltedge...</span>
    </div>
  );
}

// Public Website Layout Component
function PublicLayout() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const navigate = useNavigate();
  const { loading } = usePublicStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Hidden shortcut: Ctrl + Shift + A to open Admin Portal
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigate('/admin/login');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-0 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-dark-0 overflow-clip">
      <ScrollToTop />
      {/* Global Ambient Electric Canvas */}
      <ElectricCanvas className="fixed inset-0 pointer-events-none z-0 opacity-20 dark:opacity-25" particleCount={45} connectionDistance={125} interactive={true} />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onQuote={() => setQuoteOpen(true)} />

        <main className="flex-1">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage onQuote={() => setQuoteOpen(true)} />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/brands" element={<BrandsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage onQuote={() => setQuoteOpen(true)} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
        <MobileBottomBar onQuote={() => setQuoteOpen(true)} />
        <WhatsAppFab />

        {quoteOpen && <QuoteModal onClose={() => setQuoteOpen(false)} />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Console Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminStoreProvider>
                      <AdminLayout />
                    </AdminStoreProvider>
                  </ProtectedRoute>
                }
              >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<AdminProductEdit />} />
                  <Route path="products/:id/edit" element={<AdminProductEdit />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="brands" element={<AdminBrands />} />
                  <Route path="gallery" element={<AdminGallery />} />
                  <Route path="testimonials" element={<AdminTestimonials />} />
                  <Route path="faqs" element={<AdminFAQs />} />
                  <Route path="enquiries" element={<AdminEnquiries />} />
                  <Route path="business" element={<AdminBusinessInfo />} />
                  <Route path="content" element={<AdminHomepageCMS />} />
                  <Route
                    path="users"
                    element={
                      <ProtectedRoute requiredPermission="users.manage">
                        <AdminUsers />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="activity" element={<AdminActivity />} />
                  <Route
                    path="settings"
                    element={
                      <ProtectedRoute requiredPermission="settings.manage">
                        <AdminSettings />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="security-states" element={<AdminSecurityStates />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Route>

                {/* Customer Facing Public Store */}
                <Route 
                  path="/*" 
                  element={
                    <PublicStoreProvider>
                      <PublicLayout />
                    </PublicStoreProvider>
                  } 
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
