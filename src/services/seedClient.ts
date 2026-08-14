/**
 * Client-Side Firestore Seeder — Sai Enterprises
 *
 * Allows an authenticated Admin/Owner to initialize/seed Firestore directly from
 * the browser UI without needing Node.js or service account credentials.
 */

import {
  collection,
  doc,
  setDoc,
  writeBatch,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS } from '../lib/firestore-types';
import {
  products as initialProducts,
  categories as initialCategories,
  brands as initialBrands,
  galleryImages as initialGallery,
  testimonials as initialTestimonials,
  faqs as initialFaqs,
  businessInfo as initialBusinessInfo,
} from '../data';

export interface SeedProgressCallback {
  (message: string, progressPercent: number): void;
}

export async function seedAllCollectionsClient(
  actorUid: string,
  onProgress?: SeedProgressCallback
): Promise<{ success: boolean; message: string }> {
  try {
    onProgress?.('Starting database initialization...', 5);

    // 1. Business Info
    onProgress?.('Saving business info...', 15);
    await setDoc(
      doc(db, COLLECTIONS.BUSINESS_INFO, 'main'),
      {
        name: initialBusinessInfo.name,
        tagline: initialBusinessInfo.tagline,
        fullName: initialBusinessInfo.fullName,
        description: initialBusinessInfo.description,
        phone: initialBusinessInfo.phone,
        phoneRaw: initialBusinessInfo.phoneRaw,
        whatsapp: initialBusinessInfo.whatsapp,
        whatsappRaw: initialBusinessInfo.whatsappRaw,
        whatsappMessage: initialBusinessInfo.whatsappMessage,
        email: initialBusinessInfo.email,
        address: initialBusinessInfo.address,
        mapUrl: initialBusinessInfo.mapUrl,
        mapDirectionsUrl: initialBusinessInfo.mapDirectionsUrl,
        hours: initialBusinessInfo.hours,
        social: initialBusinessInfo.social,
        experience: initialBusinessInfo.experience,
        productsCount: initialBusinessInfo.productsCount,
        brandsCount: initialBusinessInfo.brandsCount,
        customersServed: initialBusinessInfo.customersServed,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // 2. Categories
    onProgress?.('Seeding categories...', 30);
    const catBatch = writeBatch(db);
    for (let i = 0; i < initialCategories.length; i++) {
      const cat = initialCategories[i];
      const catRef = doc(collection(db, COLLECTIONS.CATEGORIES));
      catBatch.set(catRef, {
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
        updatedAt: serverTimestamp(),
      });
    }
    await catBatch.commit();

    // 3. Brands
    onProgress?.('Seeding brands...', 45);
    const brandBatch = writeBatch(db);
    for (let i = 0; i < initialBrands.length; i++) {
      const b = initialBrands[i];
      const bRef = doc(collection(db, COLLECTIONS.BRANDS));
      brandBatch.set(bRef, {
        name: b.name,
        slug: b.slug,
        description: b.description,
        tagline: b.tagline,
        logo: b.logo,
        isAuthorized: b.isAuthorized,
        categories: b.categories,
        featured: (b as any).featured ?? i < 4,
        active: true,
        sortOrder: i + 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    await brandBatch.commit();

    // 4. Products
    onProgress?.('Seeding product catalogue...', 65);
    const productBatch = writeBatch(db);
    for (let i = 0; i < initialProducts.length; i++) {
      const p = initialProducts[i];
      const pRef = doc(collection(db, COLLECTIONS.PRODUCTS));
      productBatch.set(pRef, {
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        brandId: '',
        brandSlug: p.brandSlug,
        category: p.category,
        categoryId: '',
        categorySlug: p.categorySlug,
        description: p.description,
        shortDescription: p.shortDescription || p.description.slice(0, 100),
        specifications: p.specifications || [],
        images: p.images || ['/images/products/placeholder.jpg'],
        storagePaths: [],
        isFeatured: p.isFeatured || false,
        isNew: p.isNew || false,
        inStock: p.inStock ?? true,
        published: true,
        tags: p.tags || [p.categorySlug, p.brandSlug],
        seoTitle: `${p.name} - Sai Enterprises`,
        seoDescription: p.shortDescription || p.description.slice(0, 150),
        createdBy: actorUid,
        updatedBy: actorUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    await productBatch.commit();

    // 5. Gallery
    onProgress?.('Seeding gallery images...', 75);
    const galBatch = writeBatch(db);
    for (let i = 0; i < initialGallery.length; i++) {
      const g = initialGallery[i];
      const gRef = doc(collection(db, COLLECTIONS.GALLERY));
      galBatch.set(gRef, {
        url: g.src,
        storagePath: '',
        alt: g.alt,
        category: g.category as any,
        featured: i < 6,
        sortOrder: i + 1,
        createdBy: actorUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    await galBatch.commit();

    // 6. Testimonials
    onProgress?.('Seeding customer testimonials...', 85);
    const testBatch = writeBatch(db);
    for (let i = 0; i < initialTestimonials.length; i++) {
      const t = initialTestimonials[i];
      const tRef = doc(collection(db, COLLECTIONS.TESTIMONIALS));
      testBatch.set(tRef, {
        name: t.name,
        role: t.role,
        rating: t.rating,
        review: (t as any).content || (t as any).review || '',
        approved: true,
        featured: true,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    await testBatch.commit();

    // 7. FAQs
    onProgress?.('Seeding FAQs...', 95);
    const faqBatch = writeBatch(db);
    for (let i = 0; i < initialFaqs.length; i++) {
      const f = initialFaqs[i];
      const fRef = doc(collection(db, COLLECTIONS.FAQS));
      faqBatch.set(fRef, {
        question: f.question,
        answer: f.answer,
        category: f.category || 'General',
        sortOrder: i + 1,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    await faqBatch.commit();

    onProgress?.('All data successfully initialized in Firestore!', 100);
    return { success: true, message: 'All collections populated successfully in Firestore.' };
  } catch (err: any) {
    console.error('[SeedClient] Error during seeding:', err);
    return { success: false, message: err?.message || 'Failed to seed database.' };
  }
}

/** Check if Firestore has existing products or needs initial seeding */
export async function checkDatabaseState(): Promise<{ isPopulated: boolean; productCount: number }> {
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
    return {
      isPopulated: !snap.empty,
      productCount: snap.size,
    };
  } catch {
    return { isPopulated: false, productCount: 0 };
  }
}
