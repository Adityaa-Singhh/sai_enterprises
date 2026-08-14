/**
 * Seed Admin User — Sai Enterprises
 *
 * Run this AFTER seedFirestore.mjs AND after creating the user
 * in Firebase Console → Authentication.
 *
 * Usage:
 *   node scripts/seedAdminUser.mjs <uid> <email> <displayName> <role>
 *
 * Example:
 *   node scripts/seedAdminUser.mjs "abc123uid" "owner@saienterprises.in" "Ashish Shaw" "OWNER"
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const PROJECT_ID = 'saienterprises-90c6b';

if (getApps().length === 0) {
  try {
    const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));
    initializeApp({ credential: cert(serviceAccount) });
  } catch {
    initializeApp({ projectId: PROJECT_ID });
  }
}

const db = getFirestore(getApps()[0], 'default');

async function main() {
  const [uid, email, displayName, role] = process.argv.slice(2);

  if (!uid || !email || !displayName || !role) {
    console.error('Usage: node seedAdminUser.mjs <uid> <email> <displayName> <role>');
    console.error('Roles: OWNER | MANAGER | STAFF');
    process.exit(1);
  }

  if (!['OWNER', 'MANAGER', 'STAFF'].includes(role)) {
    console.error('Invalid role. Must be: OWNER, MANAGER, or STAFF');
    process.exit(1);
  }

  const now = Timestamp.now();

  await db.collection('users').doc(uid).set({
    uid,
    email,
    displayName,
    role,
    status: 'ACTIVE',
    phone: null,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: null,
  });

  console.log(`✅ Admin user created in Firestore:`);
  console.log(`   UID:         ${uid}`);
  console.log(`   Email:       ${email}`);
  console.log(`   Name:        ${displayName}`);
  console.log(`   Role:        ${role}`);
  console.log(`   Status:      ACTIVE`);
  console.log(`\n🎉 You can now log in to the Admin Portal with ${email}`);
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
