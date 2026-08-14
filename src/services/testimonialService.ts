/**
 * Testimonial Service — Sai Enterprises
 */

import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp, type DocumentData,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS, type FirestoreTestimonial } from '../lib/firestore-types';

function docToTestimonial(id: string, data: DocumentData): FirestoreTestimonial {
  return { id, ...data } as FirestoreTestimonial;
}

/** Get approved, active testimonials (public) */
export async function getApprovedTestimonials(): Promise<FirestoreTestimonial[]> {
  const q = query(
    collection(db, COLLECTIONS.TESTIMONIALS),
    where('approved', '==', true),
    where('active', '==', true),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToTestimonial(d.id, d.data()));
}

/** Get all testimonials (admin) */
export async function getAllTestimonials(): Promise<FirestoreTestimonial[]> {
  const q = query(collection(db, COLLECTIONS.TESTIMONIALS), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToTestimonial(d.id, d.data()));
}

export async function createTestimonial(
  data: Omit<FirestoreTestimonial, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.TESTIMONIALS), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateTestimonial(
  id: string,
  data: Partial<Omit<FirestoreTestimonial, 'id' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.TESTIMONIALS, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.TESTIMONIALS, id));
}

export async function approveTestimonial(id: string, approved: boolean): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.TESTIMONIALS, id), { approved, updatedAt: serverTimestamp() });
}
