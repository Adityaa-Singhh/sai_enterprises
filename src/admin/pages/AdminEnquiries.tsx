import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  MessageSquare, 
  Phone, 
  X,
  Send
} from 'lucide-react';
import { useAdminStore, type AdminEnquiry } from '../data/adminStore';
import { AdminBreadcrumbs, StatusBadge } from '../components/AdminUI';
import { useAuth } from '../context/AuthContext';

export const AdminEnquiries: React.FC = () => {
  const { enquiries, updateEnquiryStatus, addEnquiryNote } = useAdminStore();
  const { userProfile } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdminEnquiry | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  const statusCounts = {
    ALL: enquiries.length,
    NEW: enquiries.filter(e => e.status === 'NEW').length,
    CONTACTED: enquiries.filter(e => e.status === 'CONTACTED').length,
    IN_PROGRESS: enquiries.filter(e => e.status === 'IN_PROGRESS').length,
    RESOLVED: enquiries.filter(e => e.status === 'RESOLVED').length,
    CLOSED: enquiries.filter(e => e.status === 'CLOSED').length,
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchSearch = searchQuery === '' || 
      e.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.phone.includes(searchQuery) ||
      e.productRequirement.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const matchSource = sourceFilter === 'ALL' || e.source === sourceFilter;

    return matchSearch && matchStatus && matchSource;
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !newNoteText.trim()) return;

    addEnquiryNote(selectedEnquiry.id, userProfile?.displayName || 'Admin', newNoteText.trim());
    
    // Update local modal state
    const updated = {
      ...selectedEnquiry,
      internalNotes: [
        { id: `note-${Date.now()}`, author: userProfile?.displayName || 'Admin', note: newNoteText.trim(), date: 'Just now' },
        ...selectedEnquiry.internalNotes
      ]
    };
    setSelectedEnquiry(updated);
    setNewNoteText('');
  };

  const handleStatusChange = (status: AdminEnquiry['status']) => {
    if (!selectedEnquiry) return;
    updateEnquiryStatus(selectedEnquiry.id, status);
    setSelectedEnquiry({ ...selectedEnquiry, status });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminBreadcrumbs items={[{ label: 'Admin' }, { label: 'Customer Enquiry Inbox', active: true }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Customer Enquiries & Quotations</h1>
            {statusCounts.NEW > 0 && (
              <span className="px-3 py-1 rounded-full bg-volt text-dark-0 text-xs font-black shadow-[0_0_12px_rgba(0,229,255,0.4)]">
                {statusCounts.NEW} New
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time inquiries received from website visitors, contractors, and WhatsApp direct links
          </p>
        </div>
      </div>

      {/* Status Tabs Navigation */}
      <div className="flex items-center gap-2 bg-dark-1 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar text-xs">
        {(['ALL', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-2 ${
              statusFilter === s
                ? 'bg-volt text-dark-0 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{s.replace('_', ' ')}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              statusFilter === s ? 'bg-dark-0 text-volt' : 'bg-white/10 text-slate-300'
            }`}>
              {statusCounts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Source Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone number, product keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-volt/50"
          />
        </div>

        <div>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            aria-label="Filter by source"
            className="w-full bg-dark-2 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-volt/50"
          >
            <option value="ALL">All Lead Sources</option>
            <option value="WhatsApp">WhatsApp Direct</option>
            <option value="Web Quote">Website Quotation Form</option>
            <option value="Direct Call">Direct Phone Call</option>
            <option value="Store Visit">Counter / Store Visit</option>
          </select>
        </div>
      </div>

      {/* Enquiries Data Table */}
      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-4 px-5">Customer Contact</th>
                <th className="py-4 px-4">Requirement / Products</th>
                <th className="py-4 px-4">Source</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enq) => (
                  <tr
                    key={enq.id}
                    onClick={() => setSelectedEnquiry(enq)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    {/* Customer */}
                    <td className="py-3.5 px-5">
                      <div className="font-extrabold text-white group-hover:text-volt transition-colors">
                        {enq.customerName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {enq.phone}
                      </div>
                    </td>

                    {/* Requirement */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-200 line-clamp-1">{enq.productRequirement}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-normal">{enq.message}</div>
                    </td>

                    {/* Source */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-[10px] font-bold text-slate-300 border border-white/10">
                        {enq.source === 'WhatsApp' && <MessageSquare className="w-3 h-3 text-emerald-400" />}
                        {enq.source === 'Web Quote' && <Inbox className="w-3 h-3 text-volt" />}
                        {enq.source}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-400 font-medium">
                      {enq.date}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={enq.status} />
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${enq.customerName}, this is Sai Enterprises regarding your enquiry for "${enq.productRequirement}". How can we assist you with quotations or stock delivery?`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-colors"
                          title="Open WhatsApp Chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => setSelectedEnquiry(enq)}
                          className="btn-secondary py-1.5 px-3 rounded-full text-xs font-bold text-slate-200 hover:text-white border border-white/10"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No inquiries found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail Modal / Drawer */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6 animate-scale-in">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Enquiry #{selectedEnquiry.id}</span>
                  <StatusBadge status={selectedEnquiry.status} />
                </div>
                <h3 className="text-2xl font-extrabold text-white mt-1">{selectedEnquiry.customerName}</h3>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                  <span>Received: <strong className="text-slate-200">{selectedEnquiry.date}</strong></span>
                  <span>•</span>
                  <span>Source: <strong className="text-volt">{selectedEnquiry.source}</strong></span>
                </div>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions (WhatsApp / Phone) */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedEnquiry.customerName}, this is Sai Enterprises regarding your enquiry for "${selectedEnquiry.productRequirement}". We have checked stock availability and would like to share the quotation.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Reply on WhatsApp</span>
              </a>

              <a
                href={`tel:${selectedEnquiry.phone}`}
                className="p-3 rounded-2xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                <span>Call {selectedEnquiry.phone}</span>
              </a>
            </div>

            {/* Requirement Details */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-[11px] font-bold text-volt uppercase tracking-wider">Product / Project Requirement</div>
              <div className="font-extrabold text-white text-sm">{selectedEnquiry.productRequirement}</div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal pt-1 border-t border-white/5">
                "{selectedEnquiry.message}"
              </p>
            </div>

            {/* Status Changer */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Update Lead Status
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs">
                {(['NEW', 'CONTACTED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(st)}
                    className={`py-2 rounded-xl text-[11px] font-bold transition-all ${
                      selectedEnquiry.status === st
                        ? 'bg-volt text-dark-0 font-black shadow-md'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Staff Notes Timeline */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Internal Staff Notes</div>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add note (e.g. Quoted ₹1,450/coil, delivered catalog)..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
                />
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Note
                </button>
              </form>

              <div className="space-y-2 max-h-40 overflow-y-auto pt-1">
                {selectedEnquiry.internalNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-dark-2 border border-white/5 text-xs space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span className="text-volt">{note.author}</span>
                      <span>{note.date}</span>
                    </div>
                    <p className="text-slate-200 font-normal">{note.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
