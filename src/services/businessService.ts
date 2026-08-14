/**
 * Business Info Service — Sai Enterprises
 *
 * businessInfo/main is a singleton document.
 * It holds all contact details, hours, address, and social links.
 * Admin writes → public site reads live.
 */

import {
  doc, getDoc, setDoc, serverTimestamp, onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS, type FirestoreBusinessInfo } from '../lib/firestore-types';

const MAIN_DOC_ID = 'main';

function ref() {
  return doc(db, COLLECTIONS.BUSINESS_INFO, MAIN_DOC_ID);
}

/** Get business info (one-time fetch) */
export async function getBusinessInfo(): Promise<FirestoreBusinessInfo | null> {
  const snap = await getDoc(ref());
  if (!snap.exists()) return null;
  return snap.data() as FirestoreBusinessInfo;
}

/** Subscribe to business info changes (real-time, for public site) */
export function subscribeToBusinessInfo(
  callback: (info: FirestoreBusinessInfo | null) => void
): Unsubscribe {
  return onSnapshot(ref(), (snap) => {
    if (!snap.exists()) {
      callback(null);
    } else {
      callback(snap.data() as FirestoreBusinessInfo);
    }
  });
}

/** Update business info (admin — merges partial updates) */
export async function updateBusinessInfo(
  data: Partial<Omit<FirestoreBusinessInfo, 'updatedAt'>>
): Promise<void> {
  await setDoc(ref(), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

/** Seed/initialize the business info document (run once) */
export async function seedBusinessInfo(data: Omit<FirestoreBusinessInfo, 'updatedAt'>): Promise<void> {
  await setDoc(ref(), { ...data, updatedAt: serverTimestamp() }, { merge: false });
}
