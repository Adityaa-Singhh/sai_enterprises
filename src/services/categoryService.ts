/**
 * Category Service — Sai Enterprises
 *
 * All Firestore CRUD operations for the categories collection.
 * Import and use this from hooks/components — never call Firestore directly.
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
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS, type FirestoreCategory } from '../lib/firestore-types';

function docToCategory(id: string, data: DocumentData): FirestoreCategory {
  return { id, ...data } as FirestoreCategory;
}

// ── Public ──────────────────────────────────────────────────────────────────

/** Get all active categories (for public website) */
export async function getActiveCategories(): Promise<FirestoreCategory[]> {
  const q = query(
    collection(db, COLLECTIONS.CATEGORIES),
    where('active', '==', true),
    orderBy('sortOrder', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToCategory(d.id, d.data()));
}

// ── Admin ────────────────────────────────────────────────────────────────────

/** Get all categories regardless of active status (for admin) */
export async function getAllCategories(): Promise<FirestoreCategory[]> {
  const q = query(
    collection(db, COLLECTIONS.CATEGORIES),
    orderBy('sortOrder', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToCategory(d.id, d.data()));
}

/** Get a single category by ID */
export async function getCategoryById(id: string): Promise<FirestoreCategory | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.CATEGORIES, id));
  if (!snap.exists()) return null;
  return docToCategory(snap.id, snap.data());
}

/** Create a new category */
export async function createCategory(
  data: Omit<FirestoreCategory, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.CATEGORIES), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** Update an existing category */
export async function updateCategory(
  id: string,
  data: Partial<Omit<FirestoreCategory, 'id' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.CATEGORIES, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/** Delete a category document */
export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id));
}

/** Toggle active status */
export async function toggleCategoryActive(id: string, active: boolean): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.CATEGORIES, id), {
    active,
    updatedAt: serverTimestamp(),
  });
}
