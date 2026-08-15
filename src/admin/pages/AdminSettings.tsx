import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, 
  Bell, 
  Database, 
  User, 
  Save, 
  CheckCircle2, 
  Download, 
  AlertTriangle,
  CloudUpload,
  RefreshCw,
  Sparkles,
  Loader2
} from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useAdminStore } from '../data/adminStore';
import { AdminBreadcrumbs, ConfirmationModal } from '../components/AdminUI';
import { seedAllCollectionsClient } from '../../services/seedClient';

export const AdminSettings: React.FC = () => {
  const { userProfile, updateProfileData, changePassword, updateUserSettings } = useAuth();
  const { resetToFactoryDefaults, products, categories, brands, enquiries } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'backup'>('profile');
  const [name, setName] = useState(userProfile?.displayName || 'Admin');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || '');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security Form
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(userProfile?.twoFactorEnabled || false);
  const [sessionTimeout, setSessionTimeout] = useState((userProfile?.settings?.sessionTimeout as string) || '8h');

  // Notifications
  const [waAlerts, setWaAlerts] = useState(userProfile?.settings?.waAlerts !== undefined ? Boolean(userProfile.settings.waAlerts) : true);
  const [emailAlerts, setEmailAlerts] = useState(userProfile?.settings?.emailAlerts !== undefined ? Boolean(userProfile.settings.emailAlerts) : true);
  const [inventoryAlerts, setInventoryAlerts] = useState(userProfile?.settings?.inventoryAlerts !== undefined ? Boolean(userProfile.settings.inventoryAlerts) : true);

  // Sync state when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.displayName || '');
      setEmail(userProfile.email || '');
      setPhone(userProfile.phone || '');
      if (userProfile.avatarUrl) setAvatarUrl(userProfile.avatarUrl);
      if (userProfile.twoFactorEnabled !== undefined) setTwoFactorEnabled(userProfile.twoFactorEnabled);
      if (userProfile.settings?.sessionTimeout) setSessionTimeout(userProfile.settings.sessionTimeout as string);
      if (userProfile.settings?.waAlerts !== undefined) setWaAlerts(Boolean(userProfile.settings.waAlerts));
      if (userProfile.settings?.emailAlerts !== undefined) setEmailAlerts(Boolean(userProfile.settings.emailAlerts));
      if (userProfile.settings?.inventoryAlerts !== undefined) setInventoryAlerts(Boolean(userProfile.settings.inventoryAlerts));
    }
  }, [userProfile]);

  // Modals & Feedback
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passSavedSuccess, setPassSavedSuccess] = useState(false);

  // Cloud Firestore Seeding State
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedProgress, setSeedProgress] = useState(0);
  const [seedMessage, setSeedMessage] = useState('');
  const [seedResult, setSeedResult] = useState<{ success: boolean; text: string } | null>(null);

  const handleSeedFirestore = async () => {
    if (!userProfile?.uid) {
      alert('You must be logged in as an administrator to initialize the database.');
      return;
    }
    setIsSeeding(true);
    setSeedResult(null);
    setSeedProgress(5);
    setSeedMessage('Initializing...');

    const res = await seedAllCollectionsClient(userProfile.uid, (msg, pct) => {
      setSeedMessage(msg);
      setSeedProgress(pct);
    });

    setIsSeeding(false);
    setSeedResult({
      success: res.success,
      text: res.message,
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!userProfile?.uid) {
      alert('You must be logged in to change your avatar.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB.');
      return;
    }

    setIsUploadingAvatar(true);

    const convertToBase64 = (imgFile: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(imgFile);
      });
    };

    try {
      let url = '';
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const storageRef = ref(storage, `avatars/${userProfile.uid}/avatar_${Date.now()}.${fileExt}`);
        await uploadBytes(storageRef, file);
        url = await getDownloadURL(storageRef);
      } catch (storageErr) {
        console.warn('Storage upload unavailable, falling back to base64 encoding:', storageErr);
        url = await convertToBase64(file);
      }

      setAvatarUrl(url);
      await updateProfileData({ avatarUrl: url });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Avatar processing error:', err);
      alert('Failed to update avatar image. Please try another image.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const success = await updateProfileData({
      displayName: name.trim(),
      phone: phone.trim(),
      avatarUrl: avatarUrl || undefined,
    });
    setIsSavingProfile(false);

    if (success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } else {
      alert('Failed to save profile updates.');
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);

    if (newPass.length < 6) {
      setPassError('New password must be at least 6 characters long.');
      return;
    }

    if (newPass !== confirmPass) {
      setPassError('New passwords do not match!');
      return;
    }

    setIsChangingPass(true);
    const res = await changePassword(currentPass, newPass);
    setIsChangingPass(false);

    if (res.success) {
      setPassSavedSuccess(true);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => setPassSavedSuccess(false), 4000);
    } else {
      setPassError(res.message || 'Failed to update password.');
    }
  };

  const handleToggle2FA = async (enabled: boolean) => {
    setTwoFactorEnabled(enabled);
    const success = await updateUserSettings({ twoFactorEnabled: enabled });
    if (success) {
      alert(enabled ? 'Multi-Factor Authentication (2FA) enforcement enabled for your admin account.' : 'Multi-Factor Authentication disabled.');
    }
  };

  const handleChangeSessionTimeout = async (timeout: string) => {
    setSessionTimeout(timeout);
    await updateUserSettings({ sessionTimeout: timeout });
  };

  const handleToggleWaAlerts = async (val: boolean) => {
    setWaAlerts(val);
    await updateUserSettings({ waAlerts: val });
  };

  const handleToggleEmailAlerts = async (val: boolean) => {
    setEmailAlerts(val);
    await updateUserSettings({ emailAlerts: val });
  };

  const handleToggleInventoryAlerts = async (val: boolean) => {
    setInventoryAlerts(val);
    await updateUserSettings({ inventoryAlerts: val });
  };

  const handleExportFullBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      store: 'Sai Enterprises',
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
              Role: {userProfile?.role || 'OWNER'}
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
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-volt/80 to-blue-500/80 flex items-center justify-center border-2 border-volt text-dark-0 text-2xl font-extrabold shadow-lg shrink-0">
                {avatarUrl || userProfile?.avatarUrl ? (
                  <img src={avatarUrl || userProfile?.avatarUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  (name?.[0] || userProfile?.displayName?.[0] || 'A').toUpperCase()
                )}
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  disabled={isUploadingAvatar}
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary py-1.5 px-4 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isUploadingAvatar ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Change Avatar</span>
                  )}
                </button>
                <div className="text-[11px] text-slate-500 mt-1">Recommended: 300x300 JPG, PNG, or WEBP</div>
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
                  disabled
                  value={email}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-400 cursor-not-allowed"
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
                disabled={isSavingProfile}
                className="btn-primary py-2.5 px-6 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Profile
                  </>
                )}
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
                <span>Password successfully changed in Firebase Authentication!</span>
              </div>
            )}

            {passError && (
              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3 animate-scale-in">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{passError}</span>
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
                  onChange={(e) => { setCurrentPass(e.target.value); setPassError(null); }}
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
                    onChange={(e) => { setNewPass(e.target.value); setPassError(null); }}
                    placeholder="Min. 6 characters"
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
                    onChange={(e) => { setConfirmPass(e.target.value); setPassError(null); }}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="btn-primary py-2.5 px-6 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isChangingPass ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white tracking-tight border-b border-white/10 pb-3">
              Multi-Factor Authentication (2FA) & Session Security
            </h3>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <div>
                  <div className="text-xs font-bold text-white">Require 2FA via Authenticator App</div>
                  <div className="text-[11px] text-slate-400">Enforce Multi-Factor Authentication (TOTP) on your admin account</div>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => handleToggle2FA(e.target.checked)}
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
                  onChange={(e) => handleChangeSessionTimeout(e.target.value)}
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
            <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
              <div>
                <div className="text-xs font-bold text-white">Instant WhatsApp Lead Dispatch</div>
                <div className="text-[11px] text-slate-400 font-normal">Receive instant push notification when contractor submits quotation request</div>
              </div>
              <input
                type="checkbox"
                checked={waAlerts}
                onChange={(e) => handleToggleWaAlerts(e.target.checked)}
                className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
              <div>
                <div className="text-xs font-bold text-white">Daily Email Lead Summary</div>
                <div className="text-[11px] text-slate-400 font-normal">Daily 08:00 PM email report with resolved vs pending quotations</div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => handleToggleEmailAlerts(e.target.checked)}
                className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
              <div>
                <div className="text-xs font-bold text-white">Low Stock Inventory Alerts</div>
                <div className="text-[11px] text-slate-400 font-normal">Notify when popular PMCona switches or Polycab wires fall out of stock</div>
              </div>
              <input
                type="checkbox"
                checked={inventoryAlerts}
                onChange={(e) => handleToggleInventoryAlerts(e.target.checked)}
                className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}

      {/* Tab 4: Backup & Reset */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          {/* Cloud Firestore Initialization Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-volt/30 space-y-4 shadow-2xl relative overflow-hidden bg-gradient-to-br from-dark-1 to-dark-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-volt/15 text-volt border border-volt/30">
                  <CloudUpload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Initialize & Seed Cloud Firestore
                  </h3>
                  <p className="text-xs text-slate-400">
                    Direct browser-to-cloud synchronization for Sai Enterprises database
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-volt/10 text-volt border border-volt/30 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Live Cloud Sync
              </span>
            </div>

            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              Populates your live Firebase Firestore project (<code>saienterprises-90c6b</code>) with all products, categories, authorized brands (PMCona, Havells, Polycab), gallery items, customer testimonials, FAQs, and business contacts in a single click.
            </p>

            {isSeeding && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-volt flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    {seedMessage}
                  </span>
                  <span className="font-mono text-slate-400">{seedProgress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-volt h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(0,229,255,0.8)]"
                    style={{ width: `${seedProgress}%` }}
                  />
                </div>
              </div>
            )}

            {seedResult && (
              <div
                className={`p-4 rounded-2xl border text-xs flex items-center gap-3 animate-scale-in ${
                  seedResult.success
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                }`}
              >
                {seedResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <span>{seedResult.text}</span>
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleSeedFirestore}
                disabled={isSeeding}
                className="btn-primary py-3 px-6 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                <CloudUpload className="w-4 h-4" />
                <span>{isSeeding ? 'Writing to Firestore...' : 'Seed Live Firestore Database'}</span>
              </button>
            </div>
          </div>

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
