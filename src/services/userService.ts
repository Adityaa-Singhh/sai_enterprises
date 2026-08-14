/**
 * User Management Service — Sai Enterprises
 *
 * Manages user documents in Firestore.
 * Firebase Authentication handles passwords — never touched here.
 *
 * SECURITY NOTE:
 * - Only OWNER role can call these functions (enforced by Firestore Rules)
 * - Role changes and account disabling are OWNER-only operations
 * - Users can never modify their own role
 */

import {
  collection, doc, getDocs, getDoc, setDoc, updateDoc,
  query, orderBy, serverTimestamp, type DocumentData,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS, type FirestoreUser, type UserRole } from '../lib/firestore-types';

function docToUser(id: string, data: DocumentData): FirestoreUser {
  return { uid: id, ...data } as FirestoreUser;
}

/** Get all admin users */
export async function getAllUsers(): Promise<FirestoreUser[]> {
  const q = query(collection(db, COLLECTIONS.USERS), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => docToUser(d.id, d.data()));
}

/** Get a single user by UID */
export async function getUserById(uid: string): Promise<FirestoreUser | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
  if (!snap.exists()) return null;
  return docToUser(snap.id, snap.data());
}

/**
 * Create a user document in Firestore.
 * Call this AFTER Firebase Auth creates the user account.
 */
export async function createUserDocument(
  uid: string,
  data: Omit<FirestoreUser, 'uid' | 'createdAt' | 'updatedAt' | 'lastLoginAt'>
): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.USERS, uid), {
    uid,
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/** Update user role (OWNER only — enforced by Security Rules) */
export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    role,
    updatedAt: serverTimestamp(),
  });
}

/** Update user status (OWNER only) */
export async function setUserStatus(uid: string, status: 'ACTIVE' | 'DISABLED'): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    status,
    updatedAt: serverTimestamp(),
  });
}

/** Update user display info */
export async function updateUserProfile(
  uid: string,
  data: Pick<FirestoreUser, 'displayName' | 'phone'>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
