/**
 * Product Service — Sai Enterprises
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS, type FirestoreProduct } from '../lib/firestore-types';

function docToProduct(id: string, data: DocumentData): FirestoreProduct {
  return { id, ...data } as FirestoreProduct;
}

// ── Public ───────────────────────────────────────────────────────────────────

/** Get all published products for public site */
export async function getPublishedProducts(): Promise<FirestoreProduct[]> {
  const q = query(
    collection(db, COLLECTIONS.PRODUCTS),
    where('published', '==', true),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToProduct(d.id, d.data()));
}

/** Get featured products for homepage */
export async function getFeaturedProducts(count = 6): Promise<FirestoreProduct[]> {
  const q = query(
    collection(db, COLLECTIONS.PRODUCTS),
    where('published', '==', true),
    where('isFeatured', '==', true),
    orderBy('createdAt', 'desc'),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToProduct(d.id, d.data()));
}

/** Get published products by category slug */
export async function getProductsByCategory(categorySlug: string): Promise<FirestoreProduct[]> {
  const q = query(
    collection(db, COLLECTIONS.PRODUCTS),
    where('published', '==', true),
    where('categorySlug', '==', categorySlug),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToProduct(d.id, d.data()));
}

/** Get a single product by slug (public) */
export async function getProductBySlug(slug: string): Promise<FirestoreProduct | null> {
  const q = query(
    collection(db, COLLECTIONS.PRODUCTS),
    where('slug', '==', slug),
    where('published', '==', true),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return docToProduct(snap.docs[0].id, snap.docs[0].data());
}

// ── Admin ────────────────────────────────────────────────────────────────────

/** Get all products regardless of published status (admin) */
export async function getAllProducts(): Promise<FirestoreProduct[]> {
  const q = query(
    collection(db, COLLECTIONS.PRODUCTS),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToProduct(d.id, d.data()));
}

/** Get a single product by ID (admin) */
export async function getProductById(id: string): Promise<FirestoreProduct | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.PRODUCTS, id));
  if (!snap.exists()) return null;
  return docToProduct(snap.id, snap.data());
}

/** Create a new product */
export async function createProduct(
  data: Omit<FirestoreProduct, 'id' | 'createdAt' | 'updatedAt'>,
  actorUid: string
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.PRODUCTS), {
    ...data,
    createdBy: actorUid,
    updatedBy: actorUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** Update an existing product */
export async function updateProduct(
  id: string,
  data: Partial<Omit<FirestoreProduct, 'id' | 'createdAt' | 'createdBy'>>,
  actorUid: string
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), {
    ...data,
    updatedBy: actorUid,
    updatedAt: serverTimestamp(),
  });
}

/** Delete a product */
export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
}

/** Toggle published status */
export async function toggleProductPublished(id: string, published: boolean, actorUid: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), {
    published,
    updatedBy: actorUid,
    updatedAt: serverTimestamp(),
  });
}

/** Toggle featured status */
export async function toggleProductFeatured(id: string, isFeatured: boolean, actorUid: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.PRODUCTS, id), {
    isFeatured,
    updatedBy: actorUid,
    updatedAt: serverTimestamp(),
  });
}
