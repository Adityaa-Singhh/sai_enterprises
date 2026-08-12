import React, { useState } from 'react';
import { 
  Save, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Megaphone
} from 'lucide-react';
import { useAdminStore } from '../data/adminStore';
import { AdminBreadcrumbs } from '../components/AdminUI';
import { useAuth } from '../context/AuthContext';

export const AdminHomepageCMS: React.FC = () => {
  const { homepageContent, updateHomepageContent } = useAdminStore();
  const { hasPermission } = useAuth();

  const [formData, setFormData] = useState({ ...homepageContent });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const canEdit = hasPermission('content.edit');

  const handleChange = (field: keyof typeof homepageContent, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomepageContent(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <AdminBreadcrumbs items={[{ label: 'Admin' }, { label: 'Homepage Content CMS', active: true }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Homepage Content Manager</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Update marketing copy, top announcement ticker, hero headlines & value propositions
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleSave}
            className="btn-primary py-3 px-6 rounded-full font-bold text-xs flex items-center gap-2 shadow-xl"
          >
            <Save className="w-4 h-4" />
            <span>Publish Content Updates</span>
          </button>
        )}
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 animate-scale-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">Homepage content changes published successfully to live website!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Top Announcement Bar */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Megaphone className="w-5 h-5 text-volt" />
            <h3 className="text-lg font-bold text-white tracking-tight">Top Announcement Banner</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Banner Message *
              </label>
              <input
                type="text"
                value={formData.announcementText}
                onChange={(e) => handleChange('announcementText', e.target.value)}
                placeholder="e.g. Authorized Wholesale & Retail Distributor of PMCona, Havells & Polycab"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                CTA Link Text
              </label>
              <input
                type="text"
                value={formData.announcementLinkText}
                onChange={(e) => handleChange('announcementLinkText', e.target.value)}
                placeholder="View Catalogue"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Hero Section */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Sparkles className="w-5 h-5 text-volt" />
            <h3 className="text-lg font-bold text-white tracking-tight">Hero Section Headline & Messaging</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Main Headline *
              </label>
              <input
                type="text"
                value={formData.heroHeadline}
                onChange={(e) => handleChange('heroHeadline', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50 font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Highlight Phrase (Volt Cyan) *
              </label>
              <input
                type="text"
                value={formData.heroHighlight}
                onChange={(e) => handleChange('heroHighlight', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-volt focus:outline-none focus:border-volt/50 font-extrabold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Hero Subtitle Description *
              </label>
              <textarea
                rows={3}
                value={formData.heroDescription}
                onChange={(e) => handleChange('heroDescription', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-volt/50 leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Primary Button Text
              </label>
              <input
                type="text"
                value={formData.primaryCtaText}
                onChange={(e) => handleChange('primaryCtaText', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Secondary Button Text
              </label>
              <input
                type="text"
                value={formData.secondaryCtaText}
                onChange={(e) => handleChange('secondaryCtaText', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Value Guarantee Heading */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Zap className="w-5 h-5 text-volt" />
            <h3 className="text-lg font-bold text-white tracking-tight">Trust & Guarantee Section Header</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                value={formData.guaranteeTitle}
                onChange={(e) => handleChange('guaranteeTitle', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50 font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Section Subtitle
              </label>
              <input
                type="text"
                value={formData.guaranteeSubtitle}
                onChange={(e) => handleChange('guaranteeSubtitle', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
