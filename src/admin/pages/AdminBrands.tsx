import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import { useAdminStore } from '../data/adminStore';
import { AdminBreadcrumbs, AdminModal, ConfirmationModal } from '../components/AdminUI';
import { type Brand } from '../../data';
import { useAuth } from '../context/AuthContext';

export const AdminBrands: React.FC = () => {
  const { brands, products, addBrand, updateBrand, deleteBrand } = useAdminStore();
  const { hasPermission } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [tagline, setTagline] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [logo, setLogo] = useState('');
  const [categoriesInput, setCategoriesInput] = useState('');

  const canManage = hasPermission('brands.manage');

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setName('');
    setSlug('');
    setDescription('');
    setTagline('');
    setIsAuthorized(true);
    setLogo('');
    setCategoriesInput('Modular Switches, Sockets');
    setModalOpen(true);
  };

  const handleOpenEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setName(brand.name);
    setSlug(brand.slug);
    setDescription(brand.description || '');
    setTagline(brand.tagline || '');
    setIsAuthorized(brand.isAuthorized ?? true);
    setLogo(brand.logo || '');
    setCategoriesInput(brand.categories ? brand.categories.join(', ') : '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const categoriesArray = categoriesInput.split(',').map(c => c.trim()).filter(Boolean);

    const payload: Omit<Brand, 'id'> = {
      name,
      slug: cleanSlug,
      description,
      tagline: tagline || 'Trusted Electrical Partner',
      isAuthorized,
      logo: logo || '/images/brands/placeholder.png',
      categories: categoriesArray,
    };

    if (editingBrand) {
      updateBrand(editingBrand.id, payload);
    } else {
      addBrand(payload);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminBreadcrumbs items={[{ label: 'Admin' }, { label: 'Brand Partnerships', active: true }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Brand Partnerships & Dealerships</h1>
            <span className="px-3 py-1 rounded-full bg-volt/15 text-volt border border-volt/30 text-xs font-black">
              {brands.length} Brands
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage authorized brand badges, PMCona dealership spotlight, and partner logos
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenAdd}
            className="btn-primary py-2.5 px-5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add Brand Partner</span>
          </button>
        )}
      </div>

      {/* Brand Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => {
          const productCount = products.filter(p => p.brandSlug === brand.slug || p.brand === brand.name).length;
          const isPmcona = brand.slug === 'pmcona';

          return (
            <div
              key={brand.id}
              className={`glass-card rounded-3xl p-6 border transition-all shadow-xl group flex flex-col justify-between ${
                isPmcona 
                  ? 'border-volt/40 bg-dark-1/90 shadow-[0_0_25px_rgba(0,229,255,0.15)] relative overflow-hidden' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {isPmcona && (
                <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl bg-gradient-to-r from-volt to-volt-dim text-dark-0 text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Premier Authorized
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-dark-2 border border-white/10 flex items-center justify-center p-2 text-volt font-black text-sm">
                    {brand.logo && brand.logo.startsWith('http') ? (
                      <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                    ) : (
                      <span>{brand.name.substring(0, 4)}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {brand.isAuthorized && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Authorized
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                    {brand.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    /brands/{brand.slug}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 font-normal">
                    {brand.description || 'Certified electrical equipment manufacturer and partner.'}
                  </p>
                </div>

                {brand.categories && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {brand.categories.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-slate-300 font-medium border border-white/5">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  <strong>{productCount}</strong> catalogue products
                </span>

                {canManage && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(brand)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Edit Brand"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(brand)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
                      title="Delete Brand"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Brand Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBrand ? 'Edit Brand Partnership' : 'Add Brand Partner'}
        description="Authorized brand status will highlight badges and warranty assurance on product pages."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Brand Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingBrand) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
              }}
              placeholder="e.g. Havells, Polycab, PMCona"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Brand Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="pmcona"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Logo Image URL
              </label>
              <input
                type="text"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="/images/brands/pmcona.png"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Innovation in Every Switch"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Specialization Categories (Comma Separated)
            </label>
            <input
              type="text"
              value={categoriesInput}
              onChange={(e) => setCategoriesInput(e.target.value)}
              placeholder="Modular Switches, Wires, Distribution Boards"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Brand Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. India's trusted modular switch manufacturer with 10-year warranty..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
            />
          </div>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-white">Authorized Dealership Status</div>
              <div className="text-[11px] text-slate-400">Shows certified green Authorized Partner badge</div>
            </div>
            <input
              type="checkbox"
              checked={isAuthorized}
              onChange={(e) => setIsAuthorized(e.target.checked)}
              className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
            />
          </label>

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
              {editingBrand ? 'Save Changes' : 'Create Brand'}
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
            if (deleteTarget) deleteBrand(deleteTarget.id);
          }}
          title="Delete Brand"
          message={`Are you sure you want to remove "${deleteTarget.name}" from the brand partners list?`}
          confirmText="Yes, Remove Brand"
        />
      )}
    </div>
  );
};
