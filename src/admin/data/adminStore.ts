import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatDateTime } from '../../utils/dateUtils';
import { 
  collection, doc, onSnapshot, query, orderBy, limit, startAfter, getDocs,
  DocumentSnapshot, setDoc, serverTimestamp, writeBatch
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS } from '../../lib/firestore-types';
import { useAuth } from '../context/AuthContext';
import {
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService
} from '../../services/productService';
import {
  createCategory as createCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService
} from '../../services/categoryService';
import {
  createBrand as createBrandService,
  updateBrand as updateBrandService,
  deleteBrand as deleteBrandService
} from '../../services/brandService';
import {
  createFAQ as createFAQService,
  updateFAQ as updateFAQService,
  deleteFAQ as deleteFAQService
} from '../../services/faqService';
import {
  createGalleryImage as createGalleryImageService,
  deleteGalleryImage as deleteGalleryImageService
} from '../../services/galleryService';

import {
  updateBusinessInfo as updateBusinessInfoService,
  subscribeToBusinessInfo
} from '../../services/businessService';
import {
  updateEnquiryStatus as updateEnquiryStatusInFirestore,
  addEnquiryNote as addEnquiryNoteInFirestore
} from '../../services/enquiryService';
import { 
  products as initialProducts, 
  categories as initialCategories, 
  brands as initialBrands, 
  galleryImages as initialGallery, 
  testimonials as initialTestimonials, 
  faqs as initialFaqs, 
  businessInfo as initialBusinessInfo,
  type Product,
  type Category,
  type Brand,
  type GalleryImage,
  type FAQ
} from '../../data';

export interface AdminEnquiry {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  productRequirement: string;
  message: string;
  date: string;
  timestamp: number;
  source: 'WhatsApp' | 'Web Quote' | 'Direct Call' | 'Store Visit' | 'Contact Form';
  status: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  internalNotes: { id: string; author: string; note: string; date: string }[];
}

export interface AdminActivityItem {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  timestamp: string;
  details?: string;
  status: 'SUCCESS' | 'WARNING' | 'INFO';
}

export interface HomepageContent {
  announcementText: string;
  announcementLinkText: string;
  heroHeadline: string;
  heroHighlight: string;
  heroDescription: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  guaranteeTitle: string;
  guaranteeSubtitle: string;
}

const INITIAL_ACTIVITIES: AdminActivityItem[] = [
  {
    id: 'act-1',
    userName: 'Suresh Sharma',
    userRole: 'OWNER',
    action: 'Updated Product Stock',
    resource: 'PMCona 6A One Way Switch',
    timestamp: '15 mins ago',
    details: 'Changed inventory status to IN_STOCK (qty 240 units)',
    status: 'SUCCESS'
  }
];

const INITIAL_HOMEPAGE_CONTENT: HomepageContent = {
  announcementText: 'Authorized Wholesale & Retail Distributor of PMCona, Havells & Polycab',
  announcementLinkText: 'View Catalogue',
  heroHeadline: 'Powering Your Projects With',
  heroHighlight: 'Certified Electrical Quality',
  heroDescription: 'Official authorized distributor of PMCona, Havells, Polycab & premier brands. Providing genuine modular switches, wires, DBs & lighting for homes, contractors and industrial builders.',
  primaryCtaText: 'Explore Products',
  secondaryCtaText: 'Request Wholesale Quote',
  guaranteeTitle: 'The Sai Enterprises Advantage',
  guaranteeSubtitle: 'What sets us apart as your preferred regional electrical products supplier.'
};

const KEY_ACTIVITIES = 'saienterprises_admin_activities';

interface AdminStoreContextType {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  gallery: GalleryImage[];
  testimonials: any[];
  faqs: FAQ[];
  enquiries: AdminEnquiry[];
  businessInfo: typeof initialBusinessInfo;
  homepageContent: HomepageContent;
  activities: AdminActivityItem[];
  hasMoreEnquiries: boolean;
  
  // Actions
  addProduct: (prod: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductStock: (id: string) => Promise<void>;
  toggleProductFeatured: (id: string) => Promise<void>;
  addCategory: (cat: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBrand: (brand: Omit<Brand, 'id'>) => Promise<Brand>;
  updateBrand: (id: string, updates: Partial<Brand>) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  updateEnquiryStatus: (id: string, status: AdminEnquiry['status']) => Promise<void>;
  addEnquiryNote: (enquiryId: string, author: string, noteText: string) => Promise<void>;
  addGalleryImage: (img: Omit<GalleryImage, 'id'>) => Promise<GalleryImage>;
  deleteGalleryImage: (id: string) => Promise<void>;
  addFaq: (faq: Omit<FAQ, 'id'>) => Promise<FAQ>;
  updateFaq: (id: string, updates: Partial<FAQ>) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  updateBusinessInformation: (info: Partial<typeof initialBusinessInfo>) => Promise<void>;
  updateHomepageContent: (content: Partial<HomepageContent>) => Promise<void>;
  loadMoreEnquiries: () => Promise<void>;
  resetToFactoryDefaults: () => Promise<void>;
  logActivity: (action: string, resource: string, details?: string, status?: 'SUCCESS' | 'WARNING' | 'INFO') => void;
}

const AdminStoreContext = createContext<AdminStoreContextType | undefined>(undefined);

export const AdminStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [gallery, setGallery] = useState<GalleryImage[]>(initialGallery);
  const [testimonials, setTestimonials] = useState<any[]>(initialTestimonials);
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [businessInfo, setBusinessInfo] = useState<typeof initialBusinessInfo>(initialBusinessInfo);
  const [homepageContent, setHomepageContent] = useState<HomepageContent>(INITIAL_HOMEPAGE_CONTENT);
  const [activities, setActivities] = useState<AdminActivityItem[]>(() => {
    const saved = localStorage.getItem(KEY_ACTIVITIES);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  // Pagination for enquiries
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [lastEnquiryDoc, setLastEnquiryDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMoreEnquiries, setHasMoreEnquiries] = useState(true);

  // Sync activities locally
  useEffect(() => {
    localStorage.setItem(KEY_ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  // Activity Logger
  const logActivity = (action: string, resource: string, details?: string, status: 'SUCCESS' | 'WARNING' | 'INFO' = 'SUCCESS') => {
    const newAct: AdminActivityItem = {
      id: `act-${Date.now()}`,
      userName: userProfile?.displayName || currentUser?.email || 'System Admin',
      userRole: userProfile?.role || 'STAFF',
      action,
      resource,
      timestamp: 'Just now',
      details,
      status
    };
    setActivities(prev => [newAct, ...prev.slice(0, 40)]);
  };

  // 1. Subscribe to Products
  useEffect(() => {
    return onSnapshot(query(collection(db, COLLECTIONS.PRODUCTS), orderBy('createdAt', 'desc')), (snapshot) => {
      const prods = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
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
        } as Product;
      });
      setProducts(snapshot.empty ? initialProducts : prods);
    });
  }, []);

  // 2. Subscribe to Categories
  useEffect(() => {
    return onSnapshot(query(collection(db, COLLECTIONS.CATEGORIES), orderBy('sortOrder', 'asc')), (snapshot) => {
      const cats = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          icon: data.icon || 'ToggleRight',
          productCount: data.productCount || 0,
          image: data.image || '',
          active: data.active ?? true
        } as Category;
      });
      setCategories(snapshot.empty ? initialCategories : cats);
    });
  }, []);

  // 3. Subscribe to Brands
  useEffect(() => {
    return onSnapshot(query(collection(db, COLLECTIONS.BRANDS), orderBy('sortOrder', 'asc')), (snapshot) => {
      const brs = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || '',
          slug: data.slug || '',
          logo: data.logo || '',
          description: data.description || '',
          isAuthorized: data.isAuthorized || false,
          categories: data.categories || [],
          tagline: data.tagline || '',
          active: data.active ?? true
        } as Brand;
      });
      setBrands(snapshot.empty ? initialBrands : brs);
    });
  }, []);

  // 4. Subscribe to Gallery
  useEffect(() => {
    return onSnapshot(query(collection(db, COLLECTIONS.GALLERY), orderBy('sortOrder', 'asc')), (snapshot) => {
      const gals = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          src: data.url || data.src || '',
          alt: data.alt || '',
          category: data.category || 'products'
        } as GalleryImage;
      });
      setGallery(snapshot.empty ? initialGallery : gals);
    });
  }, []);

  // 5. Subscribe to Testimonials
  useEffect(() => {
    return onSnapshot(query(collection(db, COLLECTIONS.TESTIMONIALS), orderBy('createdAt', 'desc')), (snapshot) => {
      const tests = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || '',
          role: data.role || '',
          rating: data.rating || 5,
          review: data.review || data.content || '',
          approved: data.approved || false,
          active: data.active || false,
          date: data.date || 'Recently'
        };
      });
      setTestimonials(snapshot.empty ? initialTestimonials : tests);
    });
  }, []);

  // 6. Subscribe to FAQs
  useEffect(() => {
    return onSnapshot(query(collection(db, COLLECTIONS.FAQS), orderBy('sortOrder', 'asc')), (snapshot) => {
      const faqList = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          question: data.question || '',
          answer: data.answer || '',
          category: data.category || 'General'
        } as FAQ;
      });
      setFaqs(snapshot.empty ? initialFaqs : faqList);
    });
  }, []);

  // 7. Subscribe to Business Info
  useEffect(() => {
    return subscribeToBusinessInfo((info) => {
      if (info) {
        setBusinessInfo({
          ...initialBusinessInfo,
          ...info,
          address: { ...initialBusinessInfo.address, ...(info.address || {}) },
          hours: { ...initialBusinessInfo.hours, ...(info.hours || {}) },
          social: { ...initialBusinessInfo.social, ...(info.social || {}) }
        });
      } else {
        setBusinessInfo(initialBusinessInfo);
      }
    });
  }, []);

  // 8. Subscribe to Homepage CMS Singleton
  useEffect(() => {
    return onSnapshot(doc(db, COLLECTIONS.BUSINESS_INFO, 'homepage'), (snap) => {
      if (snap.exists()) {
        setHomepageContent(snap.data() as HomepageContent);
      } else {
        setHomepageContent(INITIAL_HOMEPAGE_CONTENT);
      }
    });
  }, []);

  // 9. Subscribe to Enquiries with limit of 50 (Real-time Stream)
  useEffect(() => {
    const q = query(
      collection(db, COLLECTIONS.ENQUIRIES),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setLastEnquiryDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMoreEnquiries(snapshot.docs.length === 50);

        const mapped: AdminEnquiry[] = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          const createdDate = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
          const timestampMillis = data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now();
          return {
            id: docSnap.id,
            customerName: data.customerName || 'Anonymous Customer',
            phone: data.phone || '',
            email: data.email || undefined,
            productRequirement: data.productRequirement || 'General Enquiry',
            message: data.message || '',
            date: formatDateTime(createdDate),
            timestamp: timestampMillis,
            source: data.source || 'Web Quote',
            status: data.status || 'NEW',
            priority: data.priority || 'MEDIUM',
            internalNotes: data.internalNotes || []
          };
        });
        setEnquiries(mapped);
      } else {
        setEnquiries([]);
        setLastEnquiryDoc(null);
        setHasMoreEnquiries(false);
      }
    }, (err) => {
      console.warn('[AdminStore] Firestore real-time enquiry sync note:', err);
    });
  }, []);

  // Load More Enquiries (One-Time fetch of next batch)
  const loadMoreEnquiries = async () => {
    if (!lastEnquiryDoc || !hasMoreEnquiries) return;

    try {
      const q = query(
        collection(db, COLLECTIONS.ENQUIRIES),
        orderBy('createdAt', 'desc'),
        startAfter(lastEnquiryDoc),
        limit(50)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setLastEnquiryDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMoreEnquiries(snapshot.docs.length === 50);

        const batch: AdminEnquiry[] = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          const createdDate = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
          const timestampMillis = data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now();
          return {
            id: docSnap.id,
            customerName: data.customerName || 'Anonymous Customer',
            phone: data.phone || '',
            email: data.email || undefined,
            productRequirement: data.productRequirement || 'General Enquiry',
            message: data.message || '',
            date: formatDateTime(createdDate),
            timestamp: timestampMillis,
            source: data.source || 'Web Quote',
            status: data.status || 'NEW',
            priority: data.priority || 'MEDIUM',
            internalNotes: data.internalNotes || []
          };
        });

        // Append to existing list, filtering duplicates
        setEnquiries(prev => {
          const existingIds = new Set(prev.map(e => e.id));
          const uniqueBatch = batch.filter(b => !existingIds.has(b.id));
          return [...prev, ...uniqueBatch];
        });
      } else {
        setHasMoreEnquiries(false);
      }
    } catch (err) {
      console.error('[AdminStore] Failed to load more enquiries:', err);
    }
  };

  // --- CRUD ACTIONS ---

  // Products
  const addProduct = async (prod: Omit<Product, 'id'>) => {
    const actor = currentUser?.uid || 'unknown';
    const newId = await createProductService({
      ...prod,
      brandId: '',
      categoryId: '',
      storagePaths: [],
      seoTitle: `${prod.name} - Sai Enterprises`,
      seoDescription: prod.shortDescription || prod.description.slice(0, 150)
    } as any, actor);

    logActivity('Created Product', prod.name, `Category: ${prod.category}`);
    return { ...prod, id: newId } as Product;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const actor = currentUser?.uid || 'unknown';
    await updateProductService(id, updates as any, actor);
    const target = products.find(p => p.id === id);
    if (target) {
      logActivity('Updated Product', target.name, 'Updated specifications or inventory');
    }
  };

  const deleteProduct = async (id: string) => {
    await deleteProductService(id);
    const target = products.find(p => p.id === id);
    if (target) {
      logActivity('Deleted Product', target.name, 'Removed from catalogue', 'WARNING');
    }
  };

  const toggleProductStock = async (id: string) => {
    const target = products.find(p => p.id === id);
    if (target) {
      const next = !target.inStock;
      await updateProduct(id, { inStock: next });
      logActivity('Toggled Stock Status', target.name, `Status changed to ${next ? 'IN STOCK' : 'OUT OF STOCK'}`);
    }
  };

  const toggleProductFeatured = async (id: string) => {
    const target = products.find(p => p.id === id);
    if (target) {
      await updateProduct(id, { isFeatured: !target.isFeatured });
    }
  };

  // Categories
  const addCategory = async (cat: Omit<Category, 'id'>) => {
    const newId = await createCategoryService({
      ...cat,
      featured: false,
      active: true,
      sortOrder: categories.length + 1
    } as any);
    logActivity('Added Category', cat.name);
    return { ...cat, id: newId } as Category;
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    await updateCategoryService(id, updates as any);
    logActivity('Updated Category', updates.name || id);
  };

  const deleteCategory = async (id: string) => {
    const target = categories.find(c => c.id === id);
    await deleteCategoryService(id);
    if (target) logActivity('Deleted Category', target.name, '', 'WARNING');
  };

  // Brands
  const addBrand = async (brand: Omit<Brand, 'id'>) => {
    const newId = await createBrandService({
      ...brand,
      featured: false,
      active: true,
      sortOrder: brands.length + 1
    } as any);
    logActivity('Added Brand', brand.name);
    return { ...brand, id: newId } as Brand;
  };

  const updateBrand = async (id: string, updates: Partial<Brand>) => {
    await updateBrandService(id, updates as any);
    logActivity('Updated Brand', updates.name || id);
  };

  const deleteBrand = async (id: string) => {
    const target = brands.find(b => b.id === id);
    await deleteBrandService(id);
    if (target) logActivity('Deleted Brand', target.name, '', 'WARNING');
  };

  // Enquiries
  const updateEnquiryStatus = async (id: string, status: AdminEnquiry['status']) => {
    await updateEnquiryStatusInFirestore(id, status as any);
    const target = enquiries.find(e => e.id === id);
    if (target) {
      logActivity('Updated Enquiry Status', `Enquiry #${id} (${target.customerName})`, `Status changed to ${status}`);
    }
  };

  const addEnquiryNote = async (enquiryId: string, author: string, noteText: string) => {
    const target = enquiries.find(e => e.id === enquiryId);
    if (target) {
      await addEnquiryNoteInFirestore({ ...target } as any, noteText, author);
    }
  };

  // Gallery
  const addGalleryImage = async (img: Omit<GalleryImage, 'id'>) => {
    const actor = currentUser?.uid || 'unknown';
    const newId = await createGalleryImageService({
      url: img.src,
      storagePath: '',
      alt: img.alt,
      category: img.category as any,
      featured: false,
      sortOrder: gallery.length + 1,
      createdBy: actor
    }, actor);
    logActivity('Uploaded Gallery Image', img.alt);
    return { ...img, id: newId } as GalleryImage;
  };

  const deleteGalleryImage = async (id: string) => {
    await deleteGalleryImageService(id);
    logActivity('Deleted Gallery Image', id, '', 'WARNING');
  };

  // FAQs
  const addFaq = async (faq: Omit<FAQ, 'id'>) => {
    const newId = await createFAQService({
      ...faq,
      sortOrder: faqs.length + 1,
      active: true
    });
    logActivity('Added FAQ Question', faq.question);
    return { ...faq, id: newId } as FAQ;
  };

  const updateFaq = async (id: string, updates: Partial<FAQ>) => {
    await updateFAQService(id, updates);
    logActivity('Updated FAQ', id);
  };

  const deleteFaq = async (id: string) => {
    await deleteFAQService(id);
    logActivity('Deleted FAQ', id, '', 'WARNING');
  };

  // Business Info
  const updateBusinessInformation = async (info: Partial<typeof initialBusinessInfo>) => {
    await updateBusinessInfoService(info);
    logActivity('Updated Business Information', 'Shop Details & Contacts');
  };

  // Homepage content
  const updateHomepageContent = async (content: Partial<HomepageContent>) => {
    await setDoc(doc(db, COLLECTIONS.BUSINESS_INFO, 'homepage'), content, { merge: true });
    logActivity('Updated Homepage CMS', 'Hero & Announcement Banners');
  };

  // Reset/Factory seeding (Admin)
  const resetToFactoryDefaults = async () => {
    // Simple batch reset/override seeder call
    const batch = writeBatch(db);
    
    // Clear and override businessInfo
    batch.set(doc(db, COLLECTIONS.BUSINESS_INFO, 'main'), {
      ...initialBusinessInfo,
      updatedAt: serverTimestamp()
    });

    // Seed Categories
    for (let i = 0; i < initialCategories.length; i++) {
      const cat = initialCategories[i];
      const catRef = doc(collection(db, COLLECTIONS.CATEGORIES));
      batch.set(catRef, {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        image: cat.image,
        featured: i < 5,
        active: true,
        sortOrder: i + 1,
        productCount: cat.productCount || 10,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    // Seed Brands
    for (let i = 0; i < initialBrands.length; i++) {
      const b = initialBrands[i];
      const bRef = doc(collection(db, COLLECTIONS.BRANDS));
      batch.set(bRef, {
        name: b.name,
        slug: b.slug,
        description: b.description,
        tagline: b.tagline,
        logo: b.logo,
        isAuthorized: b.isAuthorized,
        categories: b.categories,
        featured: i < 4,
        active: true,
        sortOrder: i + 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    await batch.commit();
    logActivity('Reset Database', 'Restored initial store seed data', '', 'WARNING');
  };

  return React.createElement(
    AdminStoreContext.Provider,
    {
      value: {
        products,
        categories,
        brands,
        gallery,
        testimonials,
        faqs,
        enquiries,
        businessInfo,
        homepageContent,
        activities,
        hasMoreEnquiries,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        toggleProductFeatured,
        addCategory,
        updateCategory,
        deleteCategory,
        addBrand,
        updateBrand,
        deleteBrand,
        updateEnquiryStatus,
        addEnquiryNote,
        addGalleryImage,
        deleteGalleryImage,
        addFaq,
        updateFaq,
        deleteFaq,
        updateBusinessInformation,
        updateHomepageContent,
        loadMoreEnquiries,
        resetToFactoryDefaults,
        logActivity
      }
    },
    children
  );
};

export const useAdminStore = () => {
  const context = useContext(AdminStoreContext);
  if (context === undefined) {
    throw new Error('useAdminStore must be used within an AdminStoreProvider');
  }
  return context;
};
