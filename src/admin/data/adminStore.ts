import { useState, useEffect } from 'react';
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
  source: 'WhatsApp' | 'Web Quote' | 'Direct Call' | 'Store Visit';
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

// Initial Realistic Enquiries
const INITIAL_ENQUIRIES: AdminEnquiry[] = [
  {
    id: 'enq-101',
    customerName: 'Rajesh Sharma (Contractor)',
    phone: '+91 98112 34567',
    email: 'rajesh.electricals@gmail.com',
    productRequirement: 'PMCona Modular Switches & Gang Boxes for 4 BHK Villa',
    message: 'Need quotation for 120 modular switches, 45 sockets (16A), 8 fan regulators, and MCB distribution board for a residential project in DLF Phase 2.',
    date: 'Today, 10:30 AM',
    timestamp: Date.now() - 1000 * 60 * 180,
    source: 'WhatsApp',
    status: 'NEW',
    priority: 'HIGH',
    internalNotes: [
      { id: 'note-1', author: 'Suresh Sharma', note: 'Sent preliminary catalogue via WhatsApp. Waiting for project drawing sheet.', date: 'Today, 11:00 AM' }
    ]
  },
  {
    id: 'enq-102',
    customerName: 'Anil Agarwal',
    phone: '+91 98710 98765',
    email: 'anil.agarwal@outlook.com',
    productRequirement: 'Polycab 2.5 sq mm House Wire (10 Coils)',
    message: 'Please confirm availability of Polycab Optima Plus 2.5 sq mm red and black coils with GST bill.',
    date: 'Today, 09:15 AM',
    timestamp: Date.now() - 1000 * 60 * 270,
    source: 'Web Quote',
    status: 'CONTACTED',
    priority: 'MEDIUM',
    internalNotes: [
      { id: 'note-2', author: 'Vikram Mehta', note: 'Stock confirmed in warehouse. Quoted ₹1,850 per coil incl GST.', date: 'Today, 09:45 AM' }
    ]
  },
  {
    id: 'enq-103',
    customerName: 'Deepak Verma (Architect)',
    phone: '+91 99991 22334',
    email: 'deepak@vermaarchitects.com',
    productRequirement: 'Architectural LED Panel Lights & Strip Lights',
    message: 'Looking for 36W warm-white slim panel lights (60 units) and waterproof outdoor cob lights for commercial showroom.',
    date: 'Yesterday, 04:20 PM',
    timestamp: Date.now() - 1000 * 60 * 1440,
    source: 'WhatsApp',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    internalNotes: [
      { id: 'note-3', author: 'Suresh Sharma', note: 'Sample light delivered to his office. He requested final discount for bulk purchase.', date: 'Yesterday, 06:00 PM' }
    ]
  },
  {
    id: 'enq-104',
    customerName: 'Sanjay Gupta',
    phone: '+91 98100 55443',
    email: 'sanjay.gupta@yahoo.in',
    productRequirement: 'Schneider 63A 4-Pole MCB & RCCB',
    message: 'Need industrial grade 63A four pole isolator and 100mA RCCB. Immediate pickup today.',
    date: 'Yesterday, 01:10 PM',
    timestamp: Date.now() - 1000 * 60 * 1600,
    source: 'Direct Call',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    internalNotes: [
      { id: 'note-4', author: 'Anjali Verma', note: 'Customer picked up from store. Bill #SE-4821 generated.', date: 'Yesterday, 02:30 PM' }
    ]
  },
  {
    id: 'enq-105',
    customerName: 'Pooja Malhotra',
    phone: '+91 97118 77665',
    email: 'pooja.m@gmail.com',
    productRequirement: 'Crompton BLDC Ceiling Fans (5 Units)',
    message: 'Need 5 units of Crompton Energion 1200mm fans in Brown finish with remote control.',
    date: '2 Days ago',
    timestamp: Date.now() - 1000 * 60 * 2880,
    source: 'Store Visit',
    status: 'CLOSED',
    priority: 'LOW',
    internalNotes: [
      { id: 'note-5', author: 'Vikram Mehta', note: 'Delivered and installed. Customer gave 5-star rating.', date: '2 Days ago' }
    ]
  }
];

// Initial Activity Logs
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
  },
  {
    id: 'act-2',
    userName: 'Vikram Mehta',
    userRole: 'MANAGER',
    action: 'Status Change',
    resource: 'Enquiry #enq-102 (Anil Agarwal)',
    timestamp: '1 hour ago',
    details: 'Status updated from NEW to CONTACTED',
    status: 'INFO'
  },
  {
    id: 'act-3',
    userName: 'Suresh Sharma',
    userRole: 'OWNER',
    action: 'Updated Business Info',
    resource: 'Store Hours & WhatsApp',
    timestamp: '3 hours ago',
    details: 'Verified phone numbers and weekday timings',
    status: 'SUCCESS'
  },
  {
    id: 'act-4',
    userName: 'Anjali Verma',
    userRole: 'STAFF',
    action: 'Resolved Enquiry',
    resource: 'Enquiry #enq-104 (Sanjay Gupta)',
    timestamp: 'Yesterday',
    details: 'Marked as RESOLVED after counter purchase',
    status: 'SUCCESS'
  },
  {
    id: 'act-5',
    userName: 'Suresh Sharma',
    userRole: 'OWNER',
    action: 'Added New Category',
    resource: 'Industrial Electricals',
    timestamp: '2 days ago',
    details: 'Created category slug industrial-electricals',
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

// Storage Keys
const KEY_PRODUCTS = 'saienterprises_admin_products';
const KEY_CATEGORIES = 'saienterprises_admin_categories';
const KEY_BRANDS = 'saienterprises_admin_brands';
const KEY_GALLERY = 'saienterprises_admin_gallery';
const KEY_TESTIMONIALS = 'saienterprises_admin_testimonials';
const KEY_FAQS = 'saienterprises_admin_faqs';
const KEY_ENQUIRIES = 'saienterprises_admin_enquiries';
const KEY_BUSINESS = 'saienterprises_admin_business';
const KEY_CONTENT = 'saienterprises_admin_content';
const KEY_ACTIVITIES = 'saienterprises_admin_activities';

export function useAdminStore() {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(KEY_PRODUCTS);
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(KEY_CATEGORIES);
    return saved ? JSON.parse(saved) : initialCategories;
  });

  // Brands
  const [brands, setBrands] = useState<Brand[]>(() => {
    const saved = localStorage.getItem(KEY_BRANDS);
    return saved ? JSON.parse(saved) : initialBrands;
  });

  // Gallery
  const [gallery, setGallery] = useState<GalleryImage[]>(() => {
    const saved = localStorage.getItem(KEY_GALLERY);
    return saved ? JSON.parse(saved) : initialGallery;
  });

  // Testimonials
  const [testimonials, setTestimonials] = useState<any[]>(() => {
    const saved = localStorage.getItem(KEY_TESTIMONIALS);
    return saved ? JSON.parse(saved) : initialTestimonials;
  });

  // FAQs
  const [faqs, setFaqs] = useState<FAQ[]>(() => {
    const saved = localStorage.getItem(KEY_FAQS);
    return saved ? JSON.parse(saved) : initialFaqs;
  });

  // Enquiries
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>(() => {
    const saved = localStorage.getItem(KEY_ENQUIRIES);
    return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
  });

  // Business Info
  const [businessInfo, setBusinessInfo] = useState<typeof initialBusinessInfo>(() => {
    const saved = localStorage.getItem(KEY_BUSINESS);
    return saved ? JSON.parse(saved) : initialBusinessInfo;
  });

  // Homepage Content
  const [homepageContent, setHomepageContent] = useState<HomepageContent>(() => {
    const saved = localStorage.getItem(KEY_CONTENT);
    return saved ? JSON.parse(saved) : INITIAL_HOMEPAGE_CONTENT;
  });

  // Activities
  const [activities, setActivities] = useState<AdminActivityItem[]>(() => {
    const saved = localStorage.getItem(KEY_ACTIVITIES);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  // Save changes to LocalStorage
  useEffect(() => { localStorage.setItem(KEY_PRODUCTS, JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem(KEY_CATEGORIES, JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem(KEY_BRANDS, JSON.stringify(brands)); }, [brands]);
  useEffect(() => { localStorage.setItem(KEY_GALLERY, JSON.stringify(gallery)); }, [gallery]);
  useEffect(() => { localStorage.setItem(KEY_TESTIMONIALS, JSON.stringify(testimonials)); }, [testimonials]);
  useEffect(() => { localStorage.setItem(KEY_FAQS, JSON.stringify(faqs)); }, [faqs]);
  useEffect(() => { localStorage.setItem(KEY_ENQUIRIES, JSON.stringify(enquiries)); }, [enquiries]);
  useEffect(() => { localStorage.setItem(KEY_BUSINESS, JSON.stringify(businessInfo)); }, [businessInfo]);
  useEffect(() => { localStorage.setItem(KEY_CONTENT, JSON.stringify(homepageContent)); }, [homepageContent]);
  useEffect(() => { localStorage.setItem(KEY_ACTIVITIES, JSON.stringify(activities)); }, [activities]);

  // Log Helper
  const logActivity = (action: string, resource: string, details?: string, status: 'SUCCESS' | 'WARNING' | 'INFO' = 'SUCCESS') => {
    const newAct: AdminActivityItem = {
      id: `act-${Date.now()}`,
      userName: 'Admin User',
      userRole: 'ADMIN',
      action,
      resource,
      timestamp: 'Just now',
      details,
      status
    };
    setActivities(prev => [newAct, ...prev.slice(0, 40)]);
  };

  // Products CRUD
  const addProduct = (prod: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = { ...prod, id: newId };
    setProducts(prev => [newProduct, ...prev]);
    logActivity('Created Product', newProduct.name, `Category: ${newProduct.category}`);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    const target = products.find(p => p.id === id);
    if (target) {
      logActivity('Updated Product', target.name, `Updated specifications or inventory`);
    }
  };

  const deleteProduct = (id: string) => {
    const target = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (target) {
      logActivity('Deleted Product', target.name, `Removed from catalogue`, 'WARNING');
    }
  };

  const toggleProductStock = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const next = !p.inStock;
        logActivity('Toggled Stock Status', p.name, `Status changed to ${next ? 'IN STOCK' : 'OUT OF STOCK'}`);
        return { ...p, inStock: next };
      }
      return p;
    }));
  };

  const toggleProductFeatured = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, isFeatured: !p.isFeatured };
      }
      return p;
    }));
  };

  // Categories CRUD
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newId = `cat-${Date.now()}`;
    const newCat: Category = { ...cat, id: newId };
    setCategories(prev => [...prev, newCat]);
    logActivity('Added Category', newCat.name);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    logActivity('Updated Category', updates.name || id);
  };

  const deleteCategory = (id: string) => {
    const target = categories.find(c => c.id === id);
    setCategories(prev => prev.filter(c => c.id !== id));
    if (target) logActivity('Deleted Category', target.name, '', 'WARNING');
  };

  // Brands CRUD
  const addBrand = (brand: Omit<Brand, 'id'>) => {
    const newId = `brand-${Date.now()}`;
    const newBrand: Brand = { ...brand, id: newId };
    setBrands(prev => [...prev, newBrand]);
    logActivity('Added Brand', newBrand.name);
    return newBrand;
  };

  const updateBrand = (id: string, updates: Partial<Brand>) => {
    setBrands(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
    logActivity('Updated Brand', updates.name || id);
  };

  const deleteBrand = (id: string) => {
    const target = brands.find(b => b.id === id);
    setBrands(prev => prev.filter(b => b.id !== id));
    if (target) logActivity('Deleted Brand', target.name, '', 'WARNING');
  };

  // Enquiries Management
  const addEnquiry = (enquiry: Omit<AdminEnquiry, 'id' | 'status' | 'internalNotes'>) => {
    const newEnquiry: AdminEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'NEW',
      internalNotes: [],
    };
    setEnquiries(prev => [newEnquiry, ...prev]);
    logActivity('Received New Enquiry', `From ${enquiry.customerName}`);
    return newEnquiry;
  };

  const updateEnquiryStatus = (id: string, status: AdminEnquiry['status']) => {
    setEnquiries(prev => prev.map(e => (e.id === id ? { ...e, status } : e)));
    const target = enquiries.find(e => e.id === id);
    if (target) {
      logActivity('Updated Enquiry Status', `Enquiry #${id} (${target.customerName})`, `Status changed to ${status}`);
    }
  };

  const addEnquiryNote = (enquiryId: string, author: string, note: string) => {
    const newNote = {
      id: `note-${Date.now()}`,
      author,
      note,
      date: 'Just now'
    };
    setEnquiries(prev => prev.map(e => {
      if (e.id === enquiryId) {
        return { ...e, internalNotes: [newNote, ...e.internalNotes] };
      }
      return e;
    }));
  };

  // Gallery CRUD
  const addGalleryImage = (img: Omit<GalleryImage, 'id'>) => {
    const newImg: GalleryImage = { ...img, id: `gal-${Date.now()}` };
    setGallery(prev => [newImg, ...prev]);
    logActivity('Uploaded Gallery Image', newImg.alt);
    return newImg;
  };

  const deleteGalleryImage = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    logActivity('Deleted Gallery Image', id, '', 'WARNING');
  };

  // FAQs CRUD
  const addFaq = (faq: Omit<FAQ, 'id'>) => {
    const newFaq: FAQ = { ...faq, id: `faq-${Date.now()}` };
    setFaqs(prev => [...prev, newFaq]);
    logActivity('Added FAQ Question', newFaq.question);
    return newFaq;
  };

  const updateFaq = (id: string, updates: Partial<FAQ>) => {
    setFaqs(prev => prev.map(f => (f.id === id ? { ...f, ...updates } : f)));
    logActivity('Updated FAQ', id);
  };

  const deleteFaq = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    logActivity('Deleted FAQ', id, '', 'WARNING');
  };

  // Business Info Update
  const updateBusinessInformation = (info: Partial<typeof initialBusinessInfo>) => {
    setBusinessInfo(prev => ({ ...prev, ...info }));
    logActivity('Updated Business Information', 'Shop Details & Contacts');
  };

  // Homepage Content Update
  const updateHomepageContent = (content: Partial<HomepageContent>) => {
    setHomepageContent(prev => ({ ...prev, ...content }));
    logActivity('Updated Homepage CMS', 'Hero & Announcement Banners');
  };

  // Reset to Defaults
  const resetToFactoryDefaults = () => {
    localStorage.removeItem(KEY_PRODUCTS);
    localStorage.removeItem(KEY_CATEGORIES);
    localStorage.removeItem(KEY_BRANDS);
    localStorage.removeItem(KEY_GALLERY);
    localStorage.removeItem(KEY_TESTIMONIALS);
    localStorage.removeItem(KEY_FAQS);
    localStorage.removeItem(KEY_ENQUIRIES);
    localStorage.removeItem(KEY_BUSINESS);
    localStorage.removeItem(KEY_CONTENT);
    localStorage.removeItem(KEY_ACTIVITIES);
    
    setProducts(initialProducts);
    setCategories(initialCategories);
    setBrands(initialBrands);
    setGallery(initialGallery);
    setTestimonials(initialTestimonials);
    setFaqs(initialFaqs);
    setEnquiries(INITIAL_ENQUIRIES);
    setBusinessInfo(initialBusinessInfo);
    setHomepageContent(INITIAL_HOMEPAGE_CONTENT);
    setActivities(INITIAL_ACTIVITIES);
    logActivity('Reset Database', 'Restored initial store seed data', '', 'WARNING');
  };

  return {
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
    // Actions
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
    addEnquiry,
    updateEnquiryStatus,
    addEnquiryNote,
    addGalleryImage,
    deleteGalleryImage,
    addFaq,
    updateFaq,
    deleteFaq,
    updateBusinessInformation,
    updateHomepageContent,
    resetToFactoryDefaults,
    logActivity
  };
}
