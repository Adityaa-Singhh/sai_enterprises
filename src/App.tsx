import { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar, { Footer } from './components/layout';
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
import { lazyWithRetry } from './utils/lazyWithRetry';

// Public Pages (Lazy Loaded with Auto-Retry & Version-Mismatch Recovery)
const HomePage = lazyWithRetry(() => import('./pages/Home'));
const ProductsPage = lazyWithRetry(() => import('./pages/Products'));
const ProductDetailPage = lazyWithRetry(() => import('./pages/ProductDetail'));
const BrandsPage = lazyWithRetry(() => import('./pages/Brands'));
const AboutPage = lazyWithRetry(() => import('./pages/About'));
const GalleryPage = lazyWithRetry(() => import('./pages/Gallery'));
const TestimonialsPage = lazyWithRetry(() => import('./pages/Testimonials'));
const FAQPage = lazyWithRetry(() => import('./pages/FAQ'));
const ContactPage = lazyWithRetry(() => import('./pages/Contact'));

// Admin Pages (Lazy Loaded with Auto-Retry)
const AdminLogin = lazyWithRetry(() => import('./admin/pages/AdminLogin'), 'AdminLogin');
const AdminDashboard = lazyWithRetry(() => import('./admin/pages/AdminDashboard'), 'AdminDashboard');
const AdminAnalytics = lazyWithRetry(() => import('./admin/pages/AdminAnalytics'), 'AdminAnalytics');
const AdminProducts = lazyWithRetry(() => import('./admin/pages/AdminProducts'), 'AdminProducts');
const AdminProductEdit = lazyWithRetry(() => import('./admin/pages/AdminProductEdit'), 'AdminProductEdit');
const AdminCategories = lazyWithRetry(() => import('./admin/pages/AdminCategories'), 'AdminCategories');
const AdminBrands = lazyWithRetry(() => import('./admin/pages/AdminBrands'), 'AdminBrands');
const AdminGallery = lazyWithRetry(() => import('./admin/pages/AdminGallery'), 'AdminGallery');
const AdminTestimonials = lazyWithRetry(() => import('./admin/pages/AdminTestimonials'), 'AdminTestimonials');
const AdminFAQs = lazyWithRetry(() => import('./admin/pages/AdminFAQs'), 'AdminFAQs');
const AdminEnquiries = lazyWithRetry(() => import('./admin/pages/AdminEnquiries'), 'AdminEnquiries');
const AdminBusinessInfo = lazyWithRetry(() => import('./admin/pages/AdminBusinessInfo'), 'AdminBusinessInfo');
const AdminHomepageCMS = lazyWithRetry(() => import('./admin/pages/AdminHomepageCMS'), 'AdminHomepageCMS');
const AdminUsers = lazyWithRetry(() => import('./admin/pages/AdminUsers'), 'AdminUsers');
const AdminActivity = lazyWithRetry(() => import('./admin/pages/AdminActivity'), 'AdminActivity');
const AdminSettings = lazyWithRetry(() => import('./admin/pages/AdminSettings'), 'AdminSettings');
const AdminSecurityStates = lazyWithRetry(() => import('./admin/pages/AdminSecurityStates'), 'AdminSecurityStates');

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
      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading Sai Enterprises...</span>
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

        {quoteOpen && <QuoteModal onClose={() => setQuoteOpen(false)} />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
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
    </HelmetProvider>
  );
}
