import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Star
} from 'lucide-react';
import { useAdminStore } from '../data/adminStore';
import { AdminBreadcrumbs, AdminModal, ConfirmationModal } from '../components/AdminUI';
import { useAuth } from '../context/AuthContext';

export const AdminTestimonials: React.FC = () => {
  const { testimonials } = useAdminStore();
  const { hasPermission } = useAuth();

  const [reviewList, setReviewList] = useState(testimonials);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState<'APPROVED' | 'PENDING' | 'HIDDEN'>('APPROVED');

  const canManage = hasPermission('testimonials.manage');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setRole('Homeowner / Contractor');
    setContent('');
    setRating(5);
    setStatus('APPROVED');
    setModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setName(item.name);
    setRole(item.role || '');
    setContent(item.content || item.comment || '');
    setRating(item.rating || 5);
    setStatus(item.status || 'APPROVED');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setReviewList(prev => prev.map(t => t.id === editingItem.id ? { ...t, name, role, content, rating, status } : t));
    } else {
      const newItem = {
        id: `test-${Date.now()}`,
        name,
        role,
        content,
        rating,
        status,
        date: 'Just now'
      };
      setReviewList(prev => [newItem, ...prev]);
    }
    setModalOpen(false);
  };

  const toggleStatus = (id: string, newStatus: 'APPROVED' | 'HIDDEN') => {
    setReviewList(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminBreadcrumbs items={[{ label: 'Admin' }, { label: 'Customer Testimonials & Reviews', active: true }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Customer Testimonials</h1>
            <span className="px-3 py-1 rounded-full bg-volt/15 text-volt border border-volt/30 text-xs font-black">
              {reviewList.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage feedback from homeowners, contractors, electricians and builder partners
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenAdd}
            className="btn-primary py-2.5 px-5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add Review</span>
          </button>
        )}
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviewList.map((review: any) => {
          const isApproved = (review.status || 'APPROVED') === 'APPROVED';

          return (
            <div
              key={review.id}
              className="glass-card rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    isApproved ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-white/10 text-slate-400 border-white/15'
                  }`}>
                    {review.status || 'APPROVED'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic font-normal">
                  "{review.content || review.comment || 'Excellent supply of PMCona switches and prompt delivery.'}"
                </p>

                <div className="pt-2">
                  <div className="font-extrabold text-white text-sm">{review.name}</div>
                  <div className="text-[11px] text-volt font-medium">{review.role || 'Verified Customer'}</div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => toggleStatus(review.id, isApproved ? 'HIDDEN' : 'APPROVED')}
                  className={`text-xs font-bold transition-colors ${
                    isApproved ? 'text-slate-400 hover:text-amber-400' : 'text-emerald-400 hover:underline'
                  }`}
                >
                  {isApproved ? 'Hide from Web' : 'Approve & Show'}
                </button>

                {canManage && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(review)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Edit Review"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(review)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
                      title="Delete Review"
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

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Review' : 'Add Testimonial'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Chandra"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Role / Designation
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Electrical Contractor, DLF Phase 1"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Star Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star className={`w-6 h-6 ${s <= rating ? 'fill-amber-400' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Testimonial Content *
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What the customer said about Sai Enterprises quality, pricing, and service..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
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
              Save Testimonial
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
            setReviewList(prev => prev.filter(t => t.id !== deleteTarget.id));
          }}
          title="Delete Testimonial"
          message={`Are you sure you want to delete the review from "${deleteTarget.name}"?`}
          confirmText="Yes, Delete"
        />
      )}
    </div>
  );
};
