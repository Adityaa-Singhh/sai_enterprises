/**
 * FAQ Service — Sai Enterprises
 */

import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp, type DocumentData,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS, type FirestoreFAQ } from '../lib/firestore-types';

function docToFAQ(id: string, data: DocumentData): FirestoreFAQ {
  return { id, ...data } as FirestoreFAQ;
}

/** Get active FAQs (public) */
export async function getActiveFAQs(): Promise<FirestoreFAQ[]> {
  const q = query(
    collection(db, COLLECTIONS.FAQS),
    where('active', '==', true),
    orderBy('sortOrder', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToFAQ(d.id, d.data()));
}

/** Get all FAQs (admin) */
export async function getAllFAQs(): Promise<FirestoreFAQ[]> {
  const q = query(collection(db, COLLECTIONS.FAQS), orderBy('sortOrder', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToFAQ(d.id, d.data()));
}

export async function createFAQ(
  data: Omit<FirestoreFAQ, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.FAQS), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateFAQ(
  id: string,
  data: Partial<Omit<FirestoreFAQ, 'id' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.FAQS, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteFAQ(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.FAQS, id));
}

export async function toggleFAQActive(id: string, active: boolean): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.FAQS, id), { active, updatedAt: serverTimestamp() });
}
