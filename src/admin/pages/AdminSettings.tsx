import React, { useState } from 'react';
import { 
  Shield, 
  Bell, 
  Database, 
  User, 
  Save, 
  CheckCircle2, 
  Download, 
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdminStore } from '../data/adminStore';
import { AdminBreadcrumbs, ConfirmationModal } from '../components/AdminUI';

export const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const { resetToFactoryDefaults, products, categories, brands, enquiries } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'backup'>('profile');
  const [name, setName] = useState(user?.name || 'Suresh Sharma');
  const [email, setEmail] = useState(user?.email || 'owner@saienterprises.in');
  const [phone, setPhone] = useState('+91 79786 72521');

  // Security Form
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('8h');

  // Notifications
  const [waAlerts, setWaAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inventoryAlerts, setInventoryAlerts] = useState(true);

  // Modals
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passSavedSuccess, setPassSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      alert('New passwords do not match!');
      return;
    }
    setPassSavedSuccess(true);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setPassSavedSuccess(false), 3000);
  };

  const handleExportFullBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      store: 'Sai Enterprises Electricals',
      products,
      categories,
      brands,
      enquiries,
    };
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `saienterprises_full_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <AdminBreadcrumbs items={[{ label: 'Admin' }, { label: 'System & Security Settings', active: true }]} />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">System Settings & Security</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage administrator profile, 2FA security, notifications, and data backup
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 bg-dark-1 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === 'profile' ? 'bg-volt text-dark-0 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" /> Profile & Account
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === 'security' ? 'bg-volt text-dark-0 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" /> Security & 2FA
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === 'notifications' ? 'bg-volt text-dark-0 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" /> Notifications
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === 'backup' ? 'bg-volt text-dark-0 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" /> Data Backup & Reset
        </button>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Admin Profile</h3>
              <p className="text-xs text-slate-400">Personal details for your authorized store account</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-volt/15 text-volt border border-volt/30 text-xs font-black">
              Role: {user?.role || 'OWNER'}
            </span>
          </div>

          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 animate-scale-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Profile information updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-volt"
              />
              <div>
                <button type="button" className="btn-secondary py-1.5 px-4 rounded-full text-xs font-bold text-white border border-white/10">
                  Change Avatar
                </button>
                <div className="text-[11px] text-slate-500 mt-1">Recommended: 300x300 JPG or PNG</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Direct Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50 font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                className="btn-primary py-2.5 px-6 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Security */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-xl">
            <h3 className="text-lg font-bold text-white tracking-tight border-b border-white/10 pb-3">
              Change Account Password
            </h3>

            {passSavedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 animate-scale-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Password successfully changed!</span>
              </div>
            )}

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  className="btn-primary py-2.5 px-6 rounded-full text-xs font-bold shadow-lg"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white tracking-tight border-b border-white/10 pb-3">
              Multi-Factor Authentication (2FA) & Session Security
            </h3>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Require 2FA via Authenticator App</div>
                  <div className="text-[11px] text-slate-400">Enforce Google Authenticator / TOTP on all staff logins</div>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                  className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
                />
              </label>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Admin Session Expiry</div>
                  <div className="text-[11px] text-slate-400">Auto logout idle admin sessions</div>
                </div>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="bg-dark-2 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-volt/50"
                >
                  <option value="15m">15 Minutes</option>
                  <option value="1h">1 Hour</option>
                  <option value="8h">8 Hours (Standard)</option>
                  <option value="7d">7 Days</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-xl">
          <h3 className="text-lg font-bold text-white tracking-tight border-b border-white/10 pb-3">
            Store Lead & Stock Alerts
          </h3>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-white">Instant WhatsApp Lead Dispatch</div>
                <div className="text-[11px] text-slate-400">Receive instant push notification when contractor submits quotation request</div>
              </div>
              <input
                type="checkbox"
                checked={waAlerts}
                onChange={(e) => setWaAlerts(e.target.checked)}
                className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-white">Daily Email Lead Summary</div>
                <div className="text-[11px] text-slate-400">Daily 08:00 PM email report with resolved vs pending quotations</div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-white">Low Stock Inventory Alerts</div>
                <div className="text-[11px] text-slate-400">Notify when popular PMCona switches or Polycab wires fall out of stock</div>
              </div>
              <input
                type="checkbox"
                checked={inventoryAlerts}
                onChange={(e) => setInventoryAlerts(e.target.checked)}
                className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}

      {/* Tab 4: Backup & Reset */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white tracking-tight border-b border-white/10 pb-3">
              Export Full Database Backup
            </h3>
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              Download a complete JSON snapshot containing all electrical products, specifications, categories, authorized brands, enquiries, and configuration settings.
            </p>

            <button
              onClick={handleExportFullBackup}
              className="btn-primary py-3 px-6 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Backup (JSON)</span>
            </button>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-500/20 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-bold tracking-tight">Reset to Factory Seed Data</h3>
            </div>
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              Restores the default catalogue of Sai Enterprises products, categories, PMCona brand data, and sample enquiries.
            </p>

            <button
              onClick={() => setResetConfirmOpen(true)}
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition-colors"
            >
              Restore Seed Defaults
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <ConfirmationModal
          isOpen={resetConfirmOpen}
          onClose={() => setResetConfirmOpen(false)}
          onConfirm={() => {
            resetToFactoryDefaults();
            alert('Database reset to defaults!');
          }}
          title="Reset Seed Data"
          message="Are you sure you want to reset all products, categories and enquiries to initial factory defaults?"
          confirmText="Yes, Reset Database"
          variant="danger"
        />
      )}
    </div>
  );
};
