import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowRight
} from 'lucide-react';
import { useAdminStore } from '../data/adminStore';
import { AdminBreadcrumbs, AdminModal, ConfirmationModal } from '../components/AdminUI';
import { type Category } from '../../data';
import { useAuth } from '../context/AuthContext';

export const AdminCategories: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useAdminStore();
  const { hasPermission } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Sliders');
  const [image, setImage] = useState('');

  const canManage = hasPermission('categories.manage');

  const handleOpenAdd = () => {
    setEditingCat(null);
    setName('');
    setSlug('');
    setDescription('');
    setIcon('Sliders');
    setImage('/images/categories/placeholder.jpg');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setIcon(cat.icon || 'Sliders');
    setImage(cat.image || '/images/categories/placeholder.jpg');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCat) {
      updateCategory(editingCat.id, { name, slug: cleanSlug, description, icon, image });
    } else {
      addCategory({ 
        name, 
        slug: cleanSlug, 
        description, 
        icon, 
        productCount: 0, 
        image: image || '/images/categories/placeholder.jpg' 
      });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminBreadcrumbs items={[{ label: 'Admin' }, { label: 'Category Management', active: true }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Product Categories</h1>
            <span className="px-3 py-1 rounded-full bg-volt/15 text-volt border border-volt/30 text-xs font-black">
              {categories.length} Categories
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize electrical inventory taxonomies, modular switches, wires, DBs, and lighting
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenAdd}
            className="btn-primary py-2.5 px-5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        )}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = products.filter(p => p.categorySlug === cat.slug || p.category === cat.name).length;

          return (
            <div
              key={cat.id}
              className="glass-card rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all shadow-xl group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-volt/10 text-volt border border-volt/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.2)] group-hover:scale-105 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
                    {count} Products
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-white group-hover:text-volt transition-colors">
                    {cat.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    /category/{cat.slug}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 font-normal">
                    {cat.description || 'Comprehensive collection of certified electrical hardware and fixtures.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                <Link
                  to="/admin/products"
                  className="text-xs font-bold text-slate-300 hover:text-volt flex items-center gap-1 transition-colors"
                >
                  View Inventory <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {canManage && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Edit Category"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
                      title="Delete Category"
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

      {/* Add / Edit Category Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCat ? 'Edit Category' : 'Create New Category'}
        description="Category will immediately appear in the customer website filter bars and navigation."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingCat) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
              }}
              placeholder="e.g. Industrial Switchgear"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              URL Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="industrial-switchgear"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Category Image URL
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/categories/switches.jpg"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description for SEO and category headers..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
            />
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
              {editingCat ? 'Save Changes' : 'Create Category'}
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
            if (deleteTarget) deleteCategory(deleteTarget.id);
          }}
          title="Delete Category"
          message={`Are you sure you want to delete "${deleteTarget.name}"? Products in this category may need to be reassigned.`}
          confirmText="Yes, Delete Category"
        />
      )}
    </div>
  );
};
