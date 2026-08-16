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

    async function fetchData() {
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
            if (data.slug && !uniqueCatsMap.has(data.slug)) {
              uniqueCatsMap.set(data.slug, data);
            }
          });

          const cats: Category[] = Array.from(uniqueCatsMap.values()).map(data => ({
            id: data.id || '',
            name: data.name || '',
            slug: data.slug || '',
            description: data.description || '',
            icon: data.icon || 'ToggleRight',
            productCount: data.productCount || 0,
            image: data.image || '',
            active: data.active ?? true
          }));

          // Deduplicate brands by slug to prevent duplicate buttons in filters
          const uniqueBrandsMap = new Map();
          brandsRes.forEach(data => {
            if (data.slug && !uniqueBrandsMap.has(data.slug)) {
              uniqueBrandsMap.set(data.slug, data);
            }
          });

          const brs: Brand[] = Array.from(uniqueBrandsMap.values()).map(data => ({
            id: data.id || '',
            name: data.name || '',
            slug: data.slug || '',
            logo: data.logo || '',
            description: data.description || '',
            isAuthorized: data.isAuthorized || false,
            categories: data.categories || [],
            tagline: data.tagline || '',
            active: data.active ?? true
          }));

          const gals: GalleryImage[] = galleryRes.map(data => ({
            id: data.id || '',
            src: (data as any).url || (data as any).src || '',
            alt: data.alt || '',
            category: data.category || 'products'
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
          });
        }
      } catch (err: any) {
        console.error("Public store fetch error:", err);
        if (mounted) {
          setState(prev => ({ ...prev, loading: false, error: err }));
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
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
