import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  MapPin, 
  Save, 
  CheckCircle2, 
  Award
} from 'lucide-react';
import { useAdminStore } from '../data/adminStore';
import { AdminBreadcrumbs } from '../components/AdminUI';
import { useAuth } from '../context/AuthContext';

export const AdminBusinessInfo: React.FC = () => {
  const { businessInfo, updateBusinessInformation } = useAdminStore();
  const { hasPermission } = useAuth();

  const [formData, setFormData] = useState({
    name: businessInfo.name,
    tagline: businessInfo.tagline,
    fullName: businessInfo.fullName,
    description: businessInfo.description,
    phone: businessInfo.phone,
    phoneRaw: businessInfo.phoneRaw,
    whatsapp: businessInfo.whatsapp,
    whatsappRaw: businessInfo.whatsappRaw,
    email: businessInfo.email,
    addressLine1: businessInfo.address.line1,
    addressLine2: businessInfo.address.line2,
    city: businessInfo.address.city,
    state: businessInfo.address.state,
    pincode: businessInfo.address.pincode,
    hoursWeekdays: businessInfo.hours.weekdays,
    hoursSaturday: businessInfo.hours.saturday,
    hoursSunday: businessInfo.hours.sunday,
    experience: businessInfo.experience,
    productsCount: businessInfo.productsCount,
    brandsCount: businessInfo.brandsCount,
    customersServed: businessInfo.customersServed,
    instagram: businessInfo.social.instagram,
    facebook: businessInfo.social.facebook,
    google: businessInfo.social.google,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const canEdit = hasPermission('business.edit');

  const handleChange = (field: string, val: string) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateBusinessInformation({
      name: formData.name,
      tagline: formData.tagline,
      fullName: formData.fullName,
      description: formData.description,
      phone: formData.phone,
      phoneRaw: formData.phoneRaw,
      whatsapp: formData.whatsapp,
      whatsappRaw: formData.whatsappRaw,
      email: formData.email,
      address: {
        line1: formData.addressLine1,
        line2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        full: `${formData.addressLine1}, ${formData.addressLine2}, ${formData.city}, ${formData.state} ${formData.pincode}`,
      },
      hours: {
        weekdays: formData.hoursWeekdays,
        saturday: formData.hoursSaturday,
        sunday: formData.hoursSunday,
      },
      experience: formData.experience,
      productsCount: formData.productsCount,
      brandsCount: formData.brandsCount,
      customersServed: formData.customersServed,
      social: {
        instagram: formData.instagram,
        facebook: formData.facebook,
        google: formData.google,
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <AdminBreadcrumbs items={[{ label: 'Admin' }, { label: 'Business Profile & CMS', active: true }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Business Configuration</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Centrally manage shop name, WhatsApp numbers, store hours, address, and live contact details
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleSave}
            className="btn-primary py-3 px-6 rounded-full font-bold text-xs flex items-center gap-2 shadow-xl"
          >
            <Save className="w-4 h-4" />
            <span>Save Business Profile</span>
          </button>
        )}
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 animate-scale-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">Business profile updated! Changes are live across header, footer & WhatsApp CTAs.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Business Identity */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Building2 className="w-5 h-5 text-volt" />
            <h3 className="text-lg font-bold text-white tracking-tight">Brand & Legal Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Brand Display Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50 font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Full Registered Legal Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Tagline / Slogan
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Official GSTIN / Trade License
              </label>
              <input
                type="text"
                placeholder="06AAAAA0000A1Z5"
                defaultValue="06ABFPS8421Q1Z4"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Short Company Bio / Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-volt/50"
            />
          </div>
        </div>

        {/* Section 2: Contact & WhatsApp Numbers */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Phone className="w-5 h-5 text-volt" />
            <h3 className="text-lg font-bold text-white tracking-tight">Direct Phone & WhatsApp Numbers</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Display Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Raw Phone (digits only for tel: links)
              </label>
              <input
                type="text"
                value={formData.phoneRaw}
                onChange={(e) => handleChange('phoneRaw', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                WhatsApp Display Number *
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                WhatsApp Raw (for wa.me API links)
              </label>
              <input
                type="text"
                value={formData.whatsappRaw}
                onChange={(e) => handleChange('whatsappRaw', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Business Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Physical Address & Timings */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <MapPin className="w-5 h-5 text-volt" />
            <h3 className="text-lg font-bold text-white tracking-tight">Store Location & Working Hours</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Address Line 1
              </label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => handleChange('addressLine1', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Address Line 2 (Market / Area)
              </label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) => handleChange('addressLine2', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                City & State
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl px-3 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
                />
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl px-3 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Pincode
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Weekday Timings (Mon - Sat)
              </label>
              <input
                type="text"
                value={formData.hoursWeekdays}
                onChange={(e) => handleChange('hoursWeekdays', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Sunday Timings
              </label>
              <input
                type="text"
                value={formData.hoursSunday}
                onChange={(e) => handleChange('hoursSunday', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Experience Highlights */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Award className="w-5 h-5 text-volt" />
            <h3 className="text-lg font-bold text-white tracking-tight">Trust & Experience Counters</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Years Experience</label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50 font-extrabold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Products Count</label>
              <input
                type="text"
                value={formData.productsCount}
                onChange={(e) => handleChange('productsCount', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50 font-extrabold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Brand Partners</label>
              <input
                type="text"
                value={formData.brandsCount}
                onChange={(e) => handleChange('brandsCount', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50 font-extrabold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Happy Clients</label>
              <input
                type="text"
                value={formData.customersServed}
                onChange={(e) => handleChange('customersServed', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-volt/50 font-extrabold"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
