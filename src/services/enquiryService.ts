/**
 * Enquiry Service — Sai Enterprises
 *
 * Public customers can CREATE enquiries only.
 * Admin can read, update status, add notes, and close.
 * Public can NEVER read, update, or delete existing enquiries.
 * (This is enforced by both Firestore Security Rules AND the UI)
 */

import {
  collection, doc, getDocs, addDoc, updateDoc,
  query, where, orderBy, serverTimestamp, type DocumentData,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  COLLECTIONS,
  type FirestoreEnquiry,
  type EnquiryStatus,
  type EnquirySource,
} from '../lib/firestore-types';

function docToEnquiry(id: string, data: DocumentData): FirestoreEnquiry {
  return { id, ...data } as FirestoreEnquiry;
}

// ── Public ───────────────────────────────────────────────────────────────────

/** Submit a new enquiry from the public contact/quote form */
export async function submitEnquiry(data: {
  customerName: string;
  phone: string;
  email?: string;
  productRequirement: string;
  message: string;
  source: EnquirySource;
}): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.ENQUIRIES), {
    customerName: data.customerName,
    phone: data.phone,
    email: data.email ?? null,
    productRequirement: data.productRequirement,
    message: data.message,
    source: data.source,
    status: 'NEW' as EnquiryStatus,
    priority: 'MEDIUM',
    internalNotes: [],
    assignedTo: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// ── Admin ────────────────────────────────────────────────────────────────────

/** Get all enquiries ordered by newest first (admin only) */
export async function getAllEnquiries(): Promise<FirestoreEnquiry[]> {
  const q = query(collection(db, COLLECTIONS.ENQUIRIES), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToEnquiry(d.id, d.data()));
}

/** Get enquiries filtered by status */
export async function getEnquiriesByStatus(status: EnquiryStatus): Promise<FirestoreEnquiry[]> {
  const q = query(
    collection(db, COLLECTIONS.ENQUIRIES),
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToEnquiry(d.id, d.data()));
}

/** Update enquiry status */
export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.ENQUIRIES, id), {
    status,
    updatedAt: serverTimestamp(),
  });
}

/** Add internal note to enquiry */
export async function addEnquiryNote(
  enquiry: FirestoreEnquiry,
  note: string,
  authorName: string
): Promise<void> {
  const newNote = {
    id: `note-${Date.now()}`,
    author: authorName,
    note,
    date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    createdAt: Timestamp.now(),
  };
  const updatedNotes = [...(enquiry.internalNotes ?? []), newNote];
  await updateDoc(doc(db, COLLECTIONS.ENQUIRIES, enquiry.id!), {
    internalNotes: updatedNotes,
    updatedAt: serverTimestamp(),
  });
}

/** Update multiple enquiry fields (admin) */
export async function updateEnquiry(
  id: string,
  data: Partial<Omit<FirestoreEnquiry, 'id' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.ENQUIRIES, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
