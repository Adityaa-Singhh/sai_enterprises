/**
 * Firestore Data Types — Sai Enterprises
 *
 * Single source of truth for all Firestore collection document shapes.
 * These types match Firestore documents exactly (server-side).
 * Frontend display types may differ slightly (e.g. GalleryImage in data.ts).
 */

import type { Timestamp } from 'firebase/firestore';

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------
export type UserRole = 'OWNER' | 'MANAGER' | 'STAFF';
export type ActiveStatus = 'ACTIVE' | 'INACTIVE';
export type UserStatus = 'ACTIVE' | 'DISABLED';

// ---------------------------------------------------------------------------
// users/{uid}
// ---------------------------------------------------------------------------
export interface FirestoreUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  avatarUrl?: string;
  twoFactorEnabled?: boolean;
  settings?: Record<string, unknown>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
}

// ---------------------------------------------------------------------------
// categories/{categoryId}
// ---------------------------------------------------------------------------
export interface FirestoreCategory {
  id?: string; // Populated client-side from doc.id
  name: string;
  slug: string;
  description: string;
  icon: string; // Lucide icon name
  image: string; // download URL from Storage
  storagePath?: string; // path in Firebase Storage (for deletion)
  featured: boolean;
  active: boolean;
  sortOrder: number;
  productCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ---------------------------------------------------------------------------
// brands/{brandId}
// ---------------------------------------------------------------------------
export interface FirestoreBrand {
  id?: string;
  name: string;
  slug: string;
  description: string;
  tagline: string;
  logo: string; // download URL
  storagePath?: string;
  isAuthorized: boolean;
  categories: string[];
  featured: boolean;
  active: boolean;
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ---------------------------------------------------------------------------
// products/{productId}
// ---------------------------------------------------------------------------
export interface ProductSpecification {
  label: string;
  value: string;
}

export interface FirestoreProduct {
  id?: string;
  name: string;
  slug: string;
  brand: string;       // display name
  brandId: string;     // Firestore brand doc ID
  brandSlug: string;
  category: string;    // display name
  categoryId: string;  // Firestore category doc ID
  categorySlug: string;
  description: string;
  shortDescription: string;
  specifications: ProductSpecification[];
  images: string[];       // download URLs
  sectionImages?: {
    hero?: string;
    specs?: string;
    banner?: string;
  };
  storagePaths: string[]; // corresponding Storage paths
  isFeatured: boolean;
  isNew: boolean;
  inStock: boolean;
  published: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;  // uid
  updatedBy: string;  // uid
}

// ---------------------------------------------------------------------------
// gallery/{imageId}
// ---------------------------------------------------------------------------
export type GalleryCategory = 'store' | 'products' | 'brands' | 'interior' | 'exterior';

export interface FirestoreGalleryImage {
  id?: string;
  url: string;        // download URL
  storagePath: string;
  alt: string;
  title?: string;
  caption?: string;
  category: GalleryCategory;
  featured: boolean;
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

// ---------------------------------------------------------------------------
// testimonials/{testimonialId}
// ---------------------------------------------------------------------------
export interface FirestoreTestimonial {
  id?: string;
  name: string;
  role: string;
  rating: number;
  review: string;
  approved: boolean;
  featured: boolean;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ---------------------------------------------------------------------------
// faqs/{faqId}
// ---------------------------------------------------------------------------
export interface FirestoreFAQ {
  id?: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ---------------------------------------------------------------------------
// enquiries/{enquiryId}
// ---------------------------------------------------------------------------
export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type EnquiryPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type EnquirySource = 'WhatsApp' | 'Web Quote' | 'Direct Call' | 'Store Visit' | 'Contact Form';

export interface EnquiryNote {
  id: string;
  author: string;
  note: string;
  date: string;
  createdAt: Timestamp;
}

export interface FirestoreEnquiry {
  id?: string;
  customerName: string;
  phone: string;
  email?: string;
  productRequirement: string;
  message: string;
  source: EnquirySource;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  internalNotes: EnquiryNote[];
  assignedTo?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ---------------------------------------------------------------------------
// businessInfo/main (singleton document)
// ---------------------------------------------------------------------------
export interface BusinessHours {
  weekdays: string;
  saturday: string;
  sunday: string;
}

export interface BusinessAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  full: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  google?: string;
  youtube?: string;
}

export interface FirestoreBusinessInfo {
  name: string;
  tagline: string;
  fullName: string;
  description: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  whatsappRaw: string;
  whatsappMessage: string;
  email: string;
  address: BusinessAddress;
  mapUrl: string;
  mapDirectionsUrl: string;
  hours: BusinessHours;
  social: SocialLinks;
  experience: string;
  productsCount: string;
  brandsCount: string;
  customersServed: string;
  updatedAt: Timestamp;
}

// ---------------------------------------------------------------------------
// adminLogs/{logId}
// ---------------------------------------------------------------------------
export type AdminLogAction =
  | 'login' | 'logout'
  | 'productCreated' | 'productUpdated' | 'productDeleted'
  | 'categoryCreated' | 'categoryUpdated' | 'categoryDeleted'
  | 'brandCreated' | 'brandUpdated' | 'brandDeleted'
  | 'galleryUploaded' | 'galleryDeleted'
  | 'testimonialCreated' | 'testimonialUpdated' | 'testimonialDeleted'
  | 'faqCreated' | 'faqUpdated' | 'faqDeleted'
  | 'enquiryUpdated'
  | 'businessInfoUpdated'
  | 'userCreated' | 'userUpdated' | 'roleChanged' | 'accountDisabled';

export interface FirestoreAdminLog {
  id?: string;
  actorUid: string;
  actorEmail: string;
  actorRole: UserRole;
  action: AdminLogAction;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  timestamp: Timestamp;
}

// ---------------------------------------------------------------------------
// analyticsEvents/{eventId}
// ---------------------------------------------------------------------------
export type AnalyticsEventName =
  | 'page_view'
  | 'product_view'
  | 'search'
  | 'whatsapp_click'
  | 'phone_click'
  | 'quote_request'
  | 'contact_submission';

export interface FirestoreAnalyticsEvent {
  id?: string;
  event: AnalyticsEventName;
  page?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  sessionId?: string;
  timestamp: Timestamp;
}

// ---------------------------------------------------------------------------
// Collection name constants — avoids magic strings
// ---------------------------------------------------------------------------
export const COLLECTIONS = {
  USERS: 'users',
  CATEGORIES: 'categories',
  BRANDS: 'brands',
  PRODUCTS: 'products',
  GALLERY: 'gallery',
  TESTIMONIALS: 'testimonials',
  FAQS: 'faqs',
  ENQUIRIES: 'enquiries',
  BUSINESS_INFO: 'businessInfo',
  ADMIN_LOGS: 'adminLogs',
  ANALYTICS_EVENTS: 'analyticsEvents',
} as const;
