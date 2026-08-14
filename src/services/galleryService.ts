/**
 * Gallery Service — Sai Enterprises
 */

import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp, type DocumentData,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS, type FirestoreGalleryImage } from '../lib/firestore-types';

function docToImage(id: string, data: DocumentData): FirestoreGalleryImage {
  return { id, ...data } as FirestoreGalleryImage;
}

/** Get all gallery images (public) */
export async function getGalleryImages(): Promise<FirestoreGalleryImage[]> {
  const q = query(collection(db, COLLECTIONS.GALLERY), orderBy('sortOrder', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToImage(d.id, d.data()));
}

/** Get gallery images by category */
export async function getGalleryByCategory(category: string): Promise<FirestoreGalleryImage[]> {
  const q = query(
    collection(db, COLLECTIONS.GALLERY),
    where('category', '==', category),
    orderBy('sortOrder', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToImage(d.id, d.data()));
}

/** Create gallery image record (after upload to Storage) */
export async function createGalleryImage(
  data: Omit<FirestoreGalleryImage, 'id' | 'createdAt' | 'updatedAt'>,
  actorUid: string
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.GALLERY), {
    ...data,
    createdBy: actorUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** Update gallery image metadata */
export async function updateGalleryImage(
  id: string,
  data: Partial<Omit<FirestoreGalleryImage, 'id' | 'createdAt' | 'createdBy'>>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.GALLERY, id), { ...data, updatedAt: serverTimestamp() });
}

/** Delete gallery image record */
export async function deleteGalleryImage(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.GALLERY, id));
}
