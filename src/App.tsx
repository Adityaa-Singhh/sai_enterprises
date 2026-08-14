import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar, { Footer, MobileBottomBar, WhatsAppFab } from './components/layout';
import { QuoteModal } from './components/ui';
import { ThemeProvider } from './context/ThemeContext';

// Public Pages
import HomePage from './pages/Home';
import ProductsPage from './pages/Products';
import ProductDetailPage from './pages/ProductDetail';
import BrandsPage from './pages/Brands';
import AboutPage from './pages/About';
import GalleryPage from './pages/Gallery';
import TestimonialsPage from './pages/Testimonials';
import FAQPage from './pages/FAQ';
import ContactPage from './pages/Contact';

// Admin Context & Layout
import { AuthProvider } from './admin/context/AuthContext';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { AdminLayout } from './admin/components/AdminLayout';

// Admin Pages
import { AdminLogin } from './admin/pages/AdminLogin';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { AdminAnalytics } from './admin/pages/AdminAnalytics';
import { AdminProducts } from './admin/pages/AdminProducts';
import { AdminProductEdit } from './admin/pages/AdminProductEdit';
import { AdminCategories } from './admin/pages/AdminCategories';
import { AdminBrands } from './admin/pages/AdminBrands';
import { AdminGallery } from './admin/pages/AdminGallery';
import { AdminTestimonials } from './admin/pages/AdminTestimonials';
import { AdminFAQs } from './admin/pages/AdminFAQs';
import { AdminEnquiries } from './admin/pages/AdminEnquiries';
import { AdminBusinessInfo } from './admin/pages/AdminBusinessInfo';
import { AdminHomepageCMS } from './admin/pages/AdminHomepageCMS';
import { AdminUsers } from './admin/pages/AdminUsers';
import { AdminActivity } from './admin/pages/AdminActivity';
import { AdminSettings } from './admin/pages/AdminSettings';
import { AdminSecurityStates } from './admin/pages/AdminSecurityStates';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Public Website Layout Component
function PublicLayout() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Hidden shortcut: Ctrl + Shift + A (or Cmd + Shift + A) to open Admin Portal
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigate('/admin/login');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-dark-0">
      <ScrollToTop />
      <Navbar onQuote={() => setQuoteOpen(true)} />

      <main>
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
      </main>

      <Footer />
      <MobileBottomBar onQuote={() => setQuoteOpen(true)} />
      <WhatsAppFab />

      {quoteOpen && <QuoteModal onClose={() => setQuoteOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Console Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
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
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
