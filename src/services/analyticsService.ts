/**
 * Analytics Service — Sai Enterprises
 * 
 * Provides Firebase Analytics event tracking for the public website.
 * Initialized safely with isSupported() to support environments where
 * IndexedDB or cookies might be restricted.
 */

import { getAnalytics, isSupported, logEvent, type Analytics } from 'firebase/analytics';
import { app } from '../lib/firebase';

let analyticsInstance: Analytics | null = null;
let isAnalyticsInitialized = false;

// Initialize analytics asynchronously if supported by the client environment
export async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (isAnalyticsInitialized) return analyticsInstance;
  
  if (typeof window !== 'undefined') {
    try {
      const supported = await isSupported();
      if (supported) {
        analyticsInstance = getAnalytics(app);
        isAnalyticsInitialized = true;
        if (import.meta.env.DEV) {
          console.info('[Analytics] ✅ Firebase Analytics initialized successfully (G-PQEVRPH9B3)');
        }
      } else {
        console.warn('[Analytics] ⚠️ Firebase Analytics is not supported in this browser/environment');
      }
    } catch (err) {
      console.warn('[Analytics] ⚠️ Failed to initialize Firebase Analytics:', err);
    }
  }
  
  isAnalyticsInitialized = true;
  return analyticsInstance;
}

// Immediately trigger background initialization
getAnalyticsInstance();

/**
 * Generic event logging helper
 */
export async function trackEvent(eventName: string, params?: Record<string, any>) {
  try {
    const analytics = await getAnalyticsInstance();
    if (analytics) {
      logEvent(analytics, eventName, params);
      if (import.meta.env.DEV) {
        console.debug(`[Analytics Event] ${eventName}`, params);
      }
    }
  } catch (err) {
    // Fail silently in production so analytics never disrupts UX
    console.debug('[Analytics] trackEvent error:', err);
  }
}

/**
 * Track page view on route changes
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle || (typeof document !== 'undefined' ? document.title : ''),
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  });
}

/**
 * Track product view in product detail page
 */
export function trackProductView(product: { id?: string; name?: string; category?: string; brand?: string; modelNumber?: string }) {
  trackEvent('view_item', {
    item_id: product.id || '',
    item_name: product.name || '',
    item_category: product.category || '',
    item_brand: product.brand || '',
    item_variant: product.modelNumber || '',
  });
}

/**
 * Track product card click / interaction
 */
export function trackProductClick(product: { id?: string; name?: string; category?: string; brand?: string }, source: string = 'product_grid') {
  trackEvent('select_item', {
    item_id: product.id || '',
    item_name: product.name || '',
    item_category: product.category || '',
    item_brand: product.brand || '',
    item_list_name: source,
  });
}

/**
 * Track WhatsApp button clicks (High intent conversion)
 */
export function trackWhatsAppClick(source: string, details?: { productName?: string; pageUrl?: string }) {
  trackEvent('whatsapp_click', {
    source,
    product_name: details?.productName || '',
    page_url: details?.pageUrl || (typeof window !== 'undefined' ? window.location.pathname : ''),
    action_type: 'direct_lead',
  });
}

/**
 * Track Phone Call button clicks
 */
export function trackPhoneCallClick(source: string, phoneNumber?: string) {
  trackEvent('phone_call_click', {
    source,
    phone_number: phoneNumber || '',
    action_type: 'direct_lead',
  });
}

/**
 * Track Quote Modal Openings
 */
export function trackQuoteModalOpen(source: string, productContext?: string) {
  trackEvent('quote_modal_open', {
    source,
    product_context: productContext || '',
  });
}

/**
 * Track Quote / Enquiry Form Submissions
 */
export function trackEnquirySubmission(details: {
  source: string;
  name?: string;
  category?: string;
  productName?: string;
}) {
  trackEvent('generate_lead', {
    source: details.source,
    lead_category: details.category || 'General',
    item_name: details.productName || '',
    currency: 'INR',
  });
}

/**
 * Track Search queries
 */
export function trackSearchQuery(searchTerm: string, resultsCount: number) {
  if (!searchTerm.trim()) return;
  trackEvent('search', {
    search_term: searchTerm.trim(),
    results_count: resultsCount,
  });
}

/**
 * Track Category & Brand filter selections
 */
export function trackFilterChange(filterType: 'category' | 'brand', filterValue: string) {
  trackEvent('filter_applied', {
    filter_type: filterType,
    filter_value: filterValue,
  });
}
