/**
 * Brand Service — Sai Enterprises
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
import { COLLECTIONS, type FirestoreBrand } from '../lib/firestore-types';

function docToBrand(id: string, data: DocumentData): FirestoreBrand {
  return { id, ...data } as FirestoreBrand;
}

/** Get all active brands (public) */
export async function getActiveBrands(): Promise<FirestoreBrand[]> {
  const q = query(
    collection(db, COLLECTIONS.BRANDS),
    where('active', '==', true),
    orderBy('sortOrder', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToBrand(d.id, d.data()));
}

/** Get all brands (admin) */
export async function getAllBrands(): Promise<FirestoreBrand[]> {
  const q = query(collection(db, COLLECTIONS.BRANDS), orderBy('sortOrder', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToBrand(d.id, d.data()));
}

export async function getBrandById(id: string): Promise<FirestoreBrand | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.BRANDS, id));
  if (!snap.exists()) return null;
  return docToBrand(snap.id, snap.data());
}

export async function createBrand(
  data: Omit<FirestoreBrand, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.BRANDS), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBrand(
  id: string,
  data: Partial<Omit<FirestoreBrand, 'id' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.BRANDS, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBrand(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.BRANDS, id));
}

export async function toggleBrandActive(id: string, active: boolean): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.BRANDS, id), { active, updatedAt: serverTimestamp() });
}
