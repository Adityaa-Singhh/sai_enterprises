import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getFeaturedProducts } from '../services/productService';
import { getActiveCategories } from '../services/categoryService';
import { getActiveBrands } from '../services/brandService';
import { getGalleryImages } from '../services/galleryService';
import { getApprovedTestimonials } from '../services/testimonialService';
import { getActiveFAQs } from '../services/faqService';
import { getBusinessInfo } from '../services/businessService';
import type {
  Product,
  Category,
  Brand,
  GalleryImage,
  FAQ,
} from '../data';
import {
  businessInfo as initialBusinessInfo,
  products as initialProducts,
  categories as initialCategories,
  brands as initialBrands,
  galleryImages as initialGallery,
  testimonials as initialTestimonials,
  faqs as initialFaqs,
} from '../data';

// Using the exact structure exposed by useAdminStore previously
interface PublicStoreState {
  featuredProducts: Product[];
  categories: Category[];
  brands: Brand[];
  gallery: GalleryImage[];
  testimonials: any[];
  faqs: FAQ[];
  businessInfo: typeof initialBusinessInfo;
  loading: boolean;
  error: Error | null;
  refreshData?: () => Promise<void>;
}

const PublicStoreContext = createContext<PublicStoreState | null>(null);

export function PublicStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PublicStoreState>({
    featuredProducts: initialProducts.filter(p => p.isFeatured),
    categories: initialCategories,
    brands: initialBrands,
    gallery: initialGallery,
    testimonials: initialTestimonials,
    faqs: initialFaqs,
    businessInfo: initialBusinessInfo,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;
    let lastFetchTime = 0;

    async function fetchData(showLoader: boolean = true) {
      if (showLoader && state.loading === false) {
        // Keep existing data visible while revalidating in background (SWR pattern)
      }
      try {
        const [
          featuredProductsRes,
          categoriesRes,
          brandsRes,
          galleryRes,
          testimonialsRes,
          faqsRes,
          businessInfoRes
        ] = await Promise.all([
          getFeaturedProducts(12), // Fetch up to 12 featured products for carousel
          getActiveCategories(),
          getActiveBrands(),
          getGalleryImages(),
          getApprovedTestimonials(),
          getActiveFAQs(),
          getBusinessInfo()
        ]);

        if (mounted) {
          lastFetchTime = Date.now();

          // Map Firestore types to UI types exactly as adminStore.ts did
          const prods: Product[] = featuredProductsRes.map(data => ({
            id: data.id || '',
            name: data.name || '',
            slug: data.slug || '',
            brand: data.brand || '',
            brandSlug: data.brandSlug || '',
            category: data.category || '',
            categorySlug: data.categorySlug || '',
            description: data.description || '',
            shortDescription: data.shortDescription || '',
            specifications: data.specifications || [],
            images: data.images || [],
            isFeatured: data.isFeatured || false,
            isNew: data.isNew || false,
            inStock: data.inStock ?? true,
            published: data.published ?? true,
            tags: data.tags || []
          }));

          // Deduplicate categories by slug to fix UI showing them two times
          const uniqueCatsMap = new Map();
          categoriesRes.forEach(data => {
            const slug = data.slug || '';
            if (slug && !uniqueCatsMap.has(slug)) {
              uniqueCatsMap.set(slug, {
                id: data.id || '',
                name: data.name || '',
                slug: slug,
                description: data.description || '',
                icon: data.icon || 'Zap',
                image: data.image || '',
                productCount: data.productCount || 0,
                sortOrder: data.sortOrder || 0,
                active: data.active ?? true,
              });
            }
          });
          const cats: Category[] = Array.from(uniqueCatsMap.values());

          const brs: Brand[] = brandsRes.map(data => ({
            id: data.id || '',
            name: data.name || '',
            slug: data.slug || '',
            description: data.description || '',
            logo: data.logo || '',
            isAuthorized: data.isAuthorized ?? true,
            categories: (data as any).categories || [],
            tagline: (data as any).tagline || '',
          }));

          const gals: GalleryImage[] = galleryRes.map(data => ({
            id: data.id || '',
            src: (data as any).url || (data as any).src || '',
            alt: data.alt || '',
            category: (data.category as any) || 'products'
          }));

          const tests = testimonialsRes.map(data => ({
            id: data.id || '',
            name: data.name || '',
            role: data.role || '',
            rating: data.rating || 5,
            review: data.review || (data as any).content || '',
            approved: data.approved || false,
            active: data.active || false,
            date: (data as any).date || 'Recently'
          }));

          const faqList: FAQ[] = faqsRes.map(data => ({
            id: data.id || '',
            question: data.question || '',
            answer: data.answer || '',
            category: data.category || 'General'
          }));

          let mappedBusinessInfo = initialBusinessInfo;
          if (businessInfoRes) {
            mappedBusinessInfo = {
              ...initialBusinessInfo,
              ...(businessInfoRes as any),
              address: { ...initialBusinessInfo.address, ...(businessInfoRes.address || {}) },
              hours: { ...initialBusinessInfo.hours, ...(businessInfoRes.hours || {}) },
              social: { ...initialBusinessInfo.social, ...(businessInfoRes.social || {}) }
            };
          }

          setState({
            featuredProducts: prods.length ? prods : initialProducts.filter(p => p.isFeatured).slice(0, 4),
            categories: cats.length ? cats : initialCategories,
            brands: brs.length ? brs : initialBrands,
            gallery: gals.length ? gals : initialGallery,
            testimonials: tests.length ? tests : initialTestimonials,
            faqs: faqList.length ? faqList : initialFaqs,
            businessInfo: mappedBusinessInfo,
            loading: false,
            error: null,
            refreshData: () => fetchData(false)
          });
        }
      } catch (err: any) {
        console.warn("[PublicStore] Background sync error:", err);
        if (mounted) {
          setState(prev => ({ ...prev, loading: false, error: err }));
        }
      }
    }

    // 1. Initial Load
    fetchData(true);

    // 2. Mobile Tab Wake-up & BFCache Rehydration Listeners
    const handleWakeup = () => {
      const isVisible = document.visibilityState === 'visible';
      const now = Date.now();
      // If tab becomes visible and was inactive for > 45 seconds, silently refresh data in background
      if (isVisible && (now - lastFetchTime > 45000)) {
        fetchData(false);
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      // If restored from BFCache (back-forward mobile cache)
      if (event.persisted) {
        fetchData(false);
      }
    };

    const handleOnline = () => {
      fetchData(false);
    };

    document.addEventListener('visibilitychange', handleWakeup);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('online', handleOnline);

    return () => {
      mounted = false;
      document.removeEventListener('visibilitychange', handleWakeup);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <PublicStoreContext.Provider value={state}>
      {children}
    </PublicStoreContext.Provider>
  );
}

export function usePublicStore() {
  const context = useContext(PublicStoreContext);
  if (!context) {
    throw new Error('usePublicStore must be used within a PublicStoreProvider');
  }
  return context;
}
