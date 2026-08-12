import React, { useState } from 'react';
import { 
  Search, 
  Download
} from 'lucide-react';
import { useAdminStore } from '../data/adminStore';
import { AdminBreadcrumbs, StatusBadge } from '../components/AdminUI';

export const AdminActivity: React.FC = () => {
  const { activities } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredActivities = activities.filter((act) => {
    const matchSearch = searchQuery === '' ||
      act.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.resource.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || act.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const handleExport = () => {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activities, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `saienterprises_audit_log_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminBreadcrumbs items={[{ label: 'Admin' }, { label: 'Activity Audit Trail', active: true }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">System Activity Audit Log</h1>
            <span className="px-3 py-1 rounded-full bg-volt/15 text-volt border border-volt/30 text-xs font-black">
              {activities.length} Recorded Events
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immutable audit record of all product stock edits, enquiry status updates, and CMS modifications
          </p>
        </div>

        <button
          onClick={handleExport}
          className="btn-secondary py-2.5 px-4 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-volt" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by user, action type, or target resource..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-volt/50"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by event outcome"
            className="w-full bg-dark-2 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-volt/50"
          >
            <option value="ALL">All Event Outcomes</option>
            <option value="SUCCESS">Success Actions</option>
            <option value="INFO">Informational</option>
            <option value="WARNING">Warnings / Deletions</option>
          </select>
        </div>
      </div>

      {/* Audit Data Table */}
      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-4 px-5">Timestamp</th>
                <th className="py-4 px-4">Operator / Role</th>
                <th className="py-4 px-4">Action</th>
                <th className="py-4 px-4">Target Resource</th>
                <th className="py-4 px-4">Details</th>
                <th className="py-4 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-white/5 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3.5 px-5 font-mono text-slate-400 whitespace-nowrap">
                      {act.timestamp}
                    </td>

                    {/* Operator */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-white">{act.userName}</div>
                      <div className="text-[10px] text-volt uppercase font-bold">{act.userRole}</div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 font-bold text-slate-200">
                      {act.action}
                    </td>

                    {/* Target */}
                    <td className="py-3.5 px-4 text-white font-medium">
                      {act.resource}
                    </td>

                    {/* Details */}
                    <td className="py-3.5 px-4 text-slate-400 font-normal">
                      {act.details || '—'}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-5 text-right">
                      <StatusBadge status={act.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No activity records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
