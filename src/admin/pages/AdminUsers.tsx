import React, { useState } from 'react';
import {
  UserPlus,
  ShieldCheck,
  Trash2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAuth, type UserRole } from '../context/AuthContext';
import { AdminBreadcrumbs, AdminModal, ConfirmationModal } from '../components/AdminUI';
import type { FirestoreUser } from '../../lib/firestore-types';
import { Timestamp } from 'firebase/firestore';

/**
 * AdminUsers — Team & Role-Based Access Control Page
 *
 * NOTE: In this version, user creation is UI-only (shows a "coming soon" notice).
 * Full Firestore-backed user creation requires Firebase Admin SDK (server-side).
 * For now, users must be created via Firebase Console → Auth, then
 * the owner runs seedAdminUser.mjs to assign roles.
 *
 * The user list currently shows only the logged-in user.
 * Full user listing requires Firestore query + OWNER-only security rule.
 */

export const AdminUsers: React.FC = () => {
  const { userProfile } = useAuth();

  // In V1, the user list is just the current user until full Firestore user listing is wired
  const userList: FirestoreUser[] = userProfile ? [userProfile] : [];

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FirestoreUser | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('STAFF');
  const [phone, setPhone] = useState('');

  // In V1, user creation info modal — actual creation requires Firebase Console
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const formatLastLogin = (ts?: Timestamp | null): string => {
    if (!ts) return 'Never';
    try {
      return ts.toDate().toLocaleDateString('en-IN', { dateStyle: 'medium' });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <AdminBreadcrumbs items={[{ label: 'Admin' }, { label: 'Team & Role-Based Access Control', active: true }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Team & Access Control</h1>
            <span className="px-3 py-1 rounded-full bg-volt/15 text-volt border border-volt/30 text-xs font-black">
              RBAC Enabled
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Assign store roles, configure staff permissions, and manage login authorization
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary py-2.5 px-5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Staff Member</span>
        </button>
      </div>

      {/* V1 Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Firebase Authentication Active.</strong> New staff accounts are created via Firebase Console → Authentication, then assigned roles using the <code className="bg-white/10 px-1 rounded">seedAdminUser.mjs</code> script. Full in-app user management is coming in the next release.
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-4 px-5">Staff Member</th>
                <th className="py-4 px-4">Role / Permissions</th>
                <th className="py-4 px-4">Phone</th>
                <th className="py-4 px-4">Last Login</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {userList.map((u) => {
                const isCurrent = u.uid === userProfile?.uid;
                const initials = u.displayName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <tr key={u.uid} className="hover:bg-white/5 transition-colors">
                    {/* User */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-volt/80 to-blue-500/80 flex items-center justify-center border border-volt/30 shrink-0 text-dark-0 font-extrabold text-sm">
                          {initials}
                        </div>
                        <div>
                          <div className="font-extrabold text-white text-sm flex items-center gap-2">
                            <span>{u.displayName}</span>
                            {isCurrent && (
                              <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-volt text-dark-0">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-volt/15 text-volt border border-volt/30">
                        {u.role}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-slate-300 font-mono">
                      {u.phone || '—'}
                    </td>

                    {/* Last Login */}
                    <td className="py-3.5 px-4 text-slate-400">
                      {formatLastLogin(u.lastLoginAt)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      {!isCurrent && (
                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Remove User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {userList.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Loading team members…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix Reference */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-volt" />
          <h3 className="text-lg font-bold text-white tracking-tight">Role Permission Matrix</h3>
        </div>
        <p className="text-xs text-slate-400">
          Security guidelines enforced by Sai Enterprises admin route guards and Firestore Security Rules
        </p>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-bold uppercase">
                <th className="pb-3">Management Module</th>
                <th className="pb-3 text-center">STAFF</th>
                <th className="pb-3 text-center">MANAGER</th>
                <th className="pb-3 text-center text-volt">OWNER (Super Admin)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              <tr><td className="py-2.5 text-white">View Products & Catalogue</td><td className="py-2.5 text-center text-emerald-400">✓ Full</td><td className="py-2.5 text-center text-emerald-400">✓ Full</td><td className="py-2.5 text-center text-emerald-400">✓ Full</td></tr>
              <tr><td className="py-2.5 text-white">Add / Edit Products & Stock</td><td className="py-2.5 text-center text-slate-600">✕</td><td className="py-2.5 text-center text-emerald-400">✓ Full</td><td className="py-2.5 text-center text-emerald-400">✓ Full</td></tr>
              <tr><td className="py-2.5 text-white">Delete Products from Catalogue</td><td className="py-2.5 text-center text-slate-600">✕</td><td className="py-2.5 text-center text-slate-600">✕</td><td className="py-2.5 text-center text-emerald-400">✓ Full</td></tr>
              <tr><td className="py-2.5 text-white">Manage Categories & Brands</td><td className="py-2.5 text-center text-slate-600">✕</td><td className="py-2.5 text-center text-emerald-400">✓ Full</td><td className="py-2.5 text-center text-emerald-400">✓ Full</td></tr>
              <tr><td className="py-2.5 text-white">Customer Enquiries & WhatsApp Quotes</td><td className="py-2.5 text-center text-emerald-400">✓ Update Status</td><td className="py-2.5 text-center text-emerald-400">✓ Full</td><td className="py-2.5 text-center text-emerald-400">✓ Full</td></tr>
              <tr><td className="py-2.5 text-white">Business CMS & Store Timings</td><td className="py-2.5 text-center text-slate-600">✕</td><td className="py-2.5 text-center text-slate-600">✕</td><td className="py-2.5 text-center text-emerald-400">✓ Full</td></tr>
              <tr><td className="py-2.5 text-white">Team Management & Security</td><td className="py-2.5 text-center text-slate-600">✕</td><td className="py-2.5 text-center text-slate-600">✕</td><td className="py-2.5 text-center text-emerald-400">✓ Full</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal — shows instructions since actual creation needs Firebase Console */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Invite New Staff Member"
        description="To invite staff, create the account in Firebase Console then run the role assignment script."
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs space-y-2">
            <div className="font-bold">How to add a new staff member:</div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
              <li>Go to <strong>Firebase Console → Authentication → Add User</strong></li>
              <li>Enter the staff member's email and set a temporary password</li>
              <li>Copy the UID shown after creation</li>
              <li>Run: <code className="bg-white/10 px-1 rounded">node scripts/seedAdminUser.mjs &lt;uid&gt; &lt;email&gt; &lt;name&gt; &lt;ROLE&gt;</code></li>
              <li>Share the login credentials securely via WhatsApp</li>
            </ol>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Full Name *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahul Sen" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Work Email *</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rahul@saienterprises.in" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98112 00000" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50 font-mono" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Assigned Role *</label>
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full bg-dark-2 border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-volt/50">
              <option value="STAFF">STAFF (Enquiry status updates, View catalogue)</option>
              <option value="MANAGER">MANAGER (Manage inventory, quotes, categories, brands)</option>
              <option value="OWNER">OWNER (Full administrative access & system settings)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white/5 text-slate-300">Cancel</button>
            <button type="submit" className="btn-primary py-2.5 px-6 rounded-full text-xs font-bold shadow-lg">Got It</button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmationModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            // In V1: shows the console instructions; actual deletion via Firebase Console
            setDeleteTarget(null);
          }}
          title="Remove Staff Member"
          message={`To remove "${deleteTarget.displayName}" (${deleteTarget.email}), disable their account in Firebase Console → Authentication. This ensures they cannot log in while preserving audit trails.`}
          confirmText="Understood"
        />
      )}
    </div>
  );
};
