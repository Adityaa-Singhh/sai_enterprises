import React, { useState } from 'react';
import { 
  Trash2, 
  Upload 
} from 'lucide-react';
import { useAdminStore } from '../data/adminStore';
import { AdminBreadcrumbs, AdminModal, ConfirmationModal } from '../components/AdminUI';
import { type GalleryImage } from '../../data';
import { useAuth } from '../context/AuthContext';

export const AdminGallery: React.FC = () => {
  const { gallery, addGalleryImage, deleteGalleryImage } = useAdminStore();
  const { hasPermission } = useAuth();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);

  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [category, setCategory] = useState<GalleryImage['category']>('products');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const canManage = hasPermission('gallery.manage');

  const filteredGallery = gallery.filter((img) => {
    return categoryFilter === 'ALL' || img.category === categoryFilter;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(40);

    setTimeout(() => {
      setUploadProgress(100);
      setTimeout(() => {
        addGalleryImage({
          src: src || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
          alt: alt || 'Sai Enterprises Store Display',
          category
        });
        setIsUploading(false);
        setUploadProgress(0);
        setModalOpen(false);
        setSrc('');
        setAlt('');
      }, 500);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminBreadcrumbs items={[{ label: 'Admin' }, { label: 'Media & Gallery Assets', active: true }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Store & Product Gallery</h1>
            <span className="px-3 py-1 rounded-full bg-volt/15 text-volt border border-volt/30 text-xs font-black">
              {gallery.length} Images
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage high-resolution showcase photos of the shop, showroom, product displays & PMCona branding
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary py-2.5 px-5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Photo</span>
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 bg-dark-1 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar text-xs">
        {(['ALL', 'store', 'products', 'brands', 'interior', 'exterior'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-xl font-bold uppercase transition-all shrink-0 ${
              categoryFilter === cat
                ? 'bg-volt text-dark-0 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredGallery.map((img) => (
          <div
            key={img.id}
            className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-xl group hover:border-volt/30 transition-all flex flex-col justify-between"
          >
            <div className="aspect-[4/3] bg-dark-2 relative overflow-hidden flex items-center justify-center">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e: any) => {
                  e.target.src = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80';
                }}
              />
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-dark-0/80 text-volt backdrop-blur-md border border-white/10">
                {img.category}
              </span>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="font-bold text-white text-xs truncate max-w-[160px]">
                {img.alt}
              </div>

              {canManage && (
                <button
                  onClick={() => setDeleteTarget(img)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Delete Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Upload Showcase Image"
        description="Add store interior, PMCona counter boards, or product display photos."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Image URL / Source *
            </label>
            <input
              type="text"
              required
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              placeholder="https://images.unsplash.com/... or /images/gallery/photo.jpg"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Caption / Alt Description *
              </label>
              <input
                type="text"
                required
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="e.g. PMCona Authorized Wall Display"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-dark-2 border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-volt/50"
              >
                <option value="products">Products Display</option>
                <option value="store">Store Front</option>
                <option value="brands">Brand Wall & Signages</option>
                <option value="interior">Interior Lighting Section</option>
                <option value="exterior">Exterior View</option>
              </select>
            </div>
          </div>

          {/* Upload Progress Simulator */}
          {isUploading && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-300 font-bold">
                <span>Uploading Asset...</span>
                <span className="text-volt">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-dark-2 rounded-full overflow-hidden">
                <div className="h-full bg-volt rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

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
              disabled={isUploading}
              className="btn-primary py-2.5 px-6 rounded-full text-xs font-bold shadow-lg"
            >
              {isUploading ? 'Uploading...' : 'Save & Publish Photo'}
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
            if (deleteTarget) deleteGalleryImage(deleteTarget.id);
          }}
          title="Delete Photo"
          message={`Are you sure you want to delete "${deleteTarget.alt}"?`}
          confirmText="Yes, Delete Photo"
        />
      )}
    </div>
  );
};
