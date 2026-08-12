import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import { useAdminStore } from '../data/adminStore';
import { AdminBreadcrumbs, AdminModal, ConfirmationModal } from '../components/AdminUI';
import { type FAQ } from '../../data';
import { useAuth } from '../context/AuthContext';

export const AdminFAQs: React.FC = () => {
  const { faqs, addFaq, updateFaq, deleteFaq } = useAdminStore();
  const { hasPermission } = useAuth();

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FAQ | null>(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('Brands');

  const canManage = hasPermission('faqs.manage');

  const categoriesList = ['ALL', 'Brands', 'Orders', 'Store', 'Delivery', 'Warranty', 'Returns', 'Services', 'Products'];

  const filteredFaqs = faqs.filter((f) => {
    return categoryFilter === 'ALL' || f.category === categoryFilter;
  });

  const handleOpenAdd = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setCategory('Brands');
    setModalOpen(true);
  };

  const handleOpenEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category || 'Brands');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaq) {
      updateFaq(editingFaq.id, { question, answer, category });
    } else {
      addFaq({ question, answer, category });
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminBreadcrumbs items={[{ label: 'Admin' }, { label: 'Frequently Asked Questions', active: true }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">FAQ Knowledge Base</h1>
            <span className="px-3 py-1 rounded-full bg-volt/15 text-volt border border-volt/30 text-xs font-black">
              {faqs.length} FAQs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Answer questions regarding PMCona warranty, store timings, bulk quotes, and deliveries
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenAdd}
            className="btn-primary py-2.5 px-5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add New FAQ</span>
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 bg-dark-1 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar text-xs">
        {categoriesList.map((cat) => (
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

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedFaq === faq.id;

          return (
            <div
              key={faq.id}
              className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-lg transition-all"
            >
              <div
                onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-volt/15 text-volt border border-volt/30 shrink-0">
                    {faq.category}
                  </span>
                  <h4 className="font-extrabold text-white text-sm">{faq.question}</h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {canManage && (
                    <div className="flex items-center gap-1 mr-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenEdit(faq)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(faq)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 text-xs text-slate-300 border-t border-white/5 leading-relaxed font-normal bg-dark-2/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingFaq ? 'Edit FAQ Item' : 'Add FAQ Question'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Question *
              </label>
              <input
                type="text"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Do you supply genuine PMCona warranty cards?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-dark-2 border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-volt/50"
              >
                {categoriesList.filter(c => c !== 'ALL').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Answer *
            </label>
            <textarea
              rows={4}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Clear, helpful response explaining policies, timelines, or product advice..."
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
              Save FAQ
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
            if (deleteTarget) deleteFaq(deleteTarget.id);
          }}
          title="Delete FAQ"
          message={`Are you sure you want to delete "${deleteTarget.question}"?`}
          confirmText="Yes, Delete"
        />
      )}
    </div>
  );
};
