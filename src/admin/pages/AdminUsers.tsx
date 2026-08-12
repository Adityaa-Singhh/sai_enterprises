import React, { useState } from 'react';
import { 
  UserPlus, 
  ShieldCheck, 
  Trash2
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS, type AdminUser, type UserRole } from '../context/AuthContext';
import { AdminBreadcrumbs, AdminModal, ConfirmationModal } from '../components/AdminUI';

export const AdminUsers: React.FC = () => {
  const { user: currentUser } = useAuth();

  const [userList, setUserList] = useState<AdminUser[]>(DEMO_ACCOUNTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('STAFF');
  const [phone, setPhone] = useState('');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: AdminUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      phone,
      lastLogin: 'Never',
      status: 'ACTIVE',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`
    };
    setUserList([...userList, newUser]);
    setModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const toggleUserStatus = (userId: string) => {
    setUserList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    setUserList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
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
              {userList.map((user) => {
                const isCurrent = user.id === currentUser?.id;

                return (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    {/* User */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-volt/30 shrink-0"
                        />
                        <div>
                          <div className="font-extrabold text-white text-sm flex items-center gap-2">
                            <span>{user.name}</span>
                            {isCurrent && (
                              <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-volt text-dark-0">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user.id, e.target.value as UserRole)}
                        disabled={isCurrent}
                        aria-label={`Change role for ${user.name}`}
                        className="bg-dark-2 border border-white/10 rounded-xl px-2.5 py-1 text-xs font-bold text-volt focus:outline-none focus:border-volt/50"
                      >
                        <option value="OWNER">OWNER (Super Admin)</option>
                        <option value="MANAGER">MANAGER (Inventory/Quotes)</option>
                        <option value="STAFF">STAFF (View Only)</option>
                      </select>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-slate-300 font-mono">
                      {user.phone || '—'}
                    </td>

                    {/* Last Login */}
                    <td className="py-3.5 px-4 text-slate-400">
                      {user.lastLogin || 'Recent'}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        disabled={isCurrent}
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border transition-all ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {user.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      {!isCurrent && (
                        <button
                          onClick={() => setDeleteTarget(user)}
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
          Security guidelines enforced by Sai Enterprises admin route guards
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
              <tr>
                <td className="py-2.5 text-white">View Products & Catalogue</td>
                <td className="py-2.5 text-center text-emerald-400">✓ Full</td>
                <td className="py-2.5 text-center text-emerald-400">✓ Full</td>
                <td className="py-2.5 text-center text-emerald-400">✓ Full</td>
              </tr>
              <tr>
                <td className="py-2.5 text-white">Add / Edit Products & Stock</td>
                <td className="py-2.5 text-center text-slate-600">✕</td>
                <td className="py-2.5 text-center text-emerald-400">✓ Full</td>
                <td className="py-2.5 text-center text-emerald-400">✓ Full</td>
              </tr>
              <tr>
                <td className="py-2.5 text-white">Delete Products from Catalogue</td>
                <td className="py-2.5 text-center text-slate-600">✕</td>
                <td className="py-2.5 text-center text-slate-600">✕</td>
                <td className="py-2.5 text-center text-emerald-400">✓ Full</td>
              </tr>
              <tr>
                <td className="py-2.5 text-white">Manage Categories & Brands</td>
                <td className="py-2.5 text-center text-slate-600">✕</td>
                <td className="py-2.5 text-center text-emerald-400">✓ Full</td>
                <td className="py-2.5 text-center text-emerald-400">✓ Full</td>
              </tr>
              <tr>
                <td className="py-2.5 text-white">Customer Enquiries & WhatsApp Quotes</td>
                <td className="py-2.5 text-center text-emerald-400">✓ Update Status</td>
                <td className="py-2.5 text-center text-emerald-400">✓ Full</td>
                <td className="py-2.5 text-center text-emerald-400">✓ Full</td>
              </tr>
              <tr>
                <td className="py-2.5 text-white">Business CMS & Store Timings</td>
                <td className="py-2.5 text-center text-slate-600">✕</td>
                <td className="py-2.5 text-center text-slate-600">✕</td>
                <td className="py-2.5 text-center text-emerald-400">✓ Full</td>
              </tr>
              <tr>
                <td className="py-2.5 text-white">Team Management & Security</td>
                <td className="py-2.5 text-center text-slate-600">✕</td>
                <td className="py-2.5 text-center text-slate-600">✕</td>
                <td className="py-2.5 text-center text-emerald-400">✓ Full</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Invite New Staff Member"
        description="A secure activation link and temporary password will be dispatched to their email."
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sen"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Work Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@saienterprises.in"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98112 00000"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Assigned Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-dark-2 border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-volt/50"
            >
              <option value="STAFF">STAFF (Enquiry status updates, View catalogue)</option>
              <option value="MANAGER">MANAGER (Manage inventory, quotes, categories, brands)</option>
              <option value="OWNER">OWNER (Full administrative access & system settings)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white/5 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary py-2.5 px-6 rounded-full text-xs font-bold shadow-lg"
            >
              Send Staff Invitation
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmationModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            setUserList(prev => prev.filter(u => u.id !== deleteTarget.id));
          }}
          title="Remove Staff Member"
          message={`Are you sure you want to revoke admin access for "${deleteTarget.name}" (${deleteTarget.email})?`}
          confirmText="Yes, Revoke Access"
        />
      )}
    </div>
  );
};
