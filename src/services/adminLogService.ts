/**
 * Admin Log Service — Sai Enterprises
 *
 * Writes audit trail entries to adminLogs collection.
 * Used internally by other services — never called directly from components.
 */

import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COLLECTIONS, type FirestoreAdminLog, type AdminLogAction, type UserRole } from '../lib/firestore-types';

interface LogOptions {
  actorUid: string;
  actorEmail: string;
  actorRole: UserRole;
  action: AdminLogAction;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}

export async function writeAdminLog(opts: LogOptions): Promise<void> {
  try {
    await addDoc(collection(db, COLLECTIONS.ADMIN_LOGS), {
      actorUid: opts.actorUid,
      actorEmail: opts.actorEmail,
      actorRole: opts.actorRole,
      action: opts.action,
      resourceType: opts.resourceType,
      resourceId: opts.resourceId ?? undefined,
      metadata: opts.metadata ?? undefined,
      timestamp: serverTimestamp(),
    });
  } catch {
    // Non-critical — logging failures should not break main operations
    console.warn('[AdminLog] Failed to write log entry');
  }
}

export async function getRecentAdminLogs(count: number = 50): Promise<FirestoreAdminLog[]> {
  const q = query(
    collection(db, COLLECTIONS.ADMIN_LOGS),
    orderBy('timestamp', 'desc'),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreAdminLog));
}
