import React, { type ReactNode } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  X, 
  AlertTriangle, 
  ChevronRight,
  Loader2
} from 'lucide-react';

// ==========================================
// 1. KPI CARD
// ==========================================
export interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  timeframe?: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor?: 'volt' | 'blue' | 'emerald' | 'amber' | 'purple';
  subtitle?: string;
  loading?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  timeframe = 'vs last month',
  icon: Icon,
  accentColor = 'volt',
  subtitle,
  loading = false,
}) => {
  const accentClasses = {
    volt: 'text-volt bg-volt/10 border-volt/30 shadow-[0_0_15px_rgba(0,229,255,0.15)]',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]',
  }[accentColor];

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-6 border border-white/10 animate-pulse space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 w-28 bg-white/10 rounded"></div>
          <div className="w-10 h-10 bg-white/10 rounded-2xl"></div>
        </div>
        <div className="h-8 w-36 bg-white/15 rounded"></div>
        <div className="h-4 w-20 bg-white/5 rounded"></div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl group relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-volt/5 rounded-full blur-2xl pointer-events-none group-hover:bg-volt/10 transition-colors" />

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 ${accentClasses}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-400 font-normal">{subtitle}</p>
        )}
      </div>

      {change && (
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs">
          <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full ${
            isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
          <span className="text-slate-400 font-normal">{timeframe}</span>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. STATUS BADGE
// ==========================================
export interface StatusBadgeProps {
  status: string;
  variant?: 'auto' | 'green' | 'amber' | 'blue' | 'rose' | 'volt' | 'slate';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'auto', className = '' }) => {
  let v = variant;
  if (v === 'auto') {
    const s = status.toUpperCase();
    if (['IN_STOCK', 'RESOLVED', 'ACTIVE', 'APPROVED', 'SUCCESS'].includes(s)) v = 'green';
    else if (['PENDING', 'CONTACTED', 'IN_PROGRESS', 'MEDIUM'].includes(s)) v = 'amber';
    else if (['NEW', 'INFO', 'LOW'].includes(s)) v = 'volt';
    else if (['CLOSED', 'DISABLED', 'HIGH', 'URGENT', 'OUT_OF_STOCK', 'ERROR'].includes(s)) v = 'rose';
    else v = 'slate';
  }

  const styles = {
    green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    volt: 'bg-volt/15 text-volt border-volt/30 shadow-[0_0_10px_rgba(0,229,255,0.2)]',
    slate: 'bg-white/10 text-slate-300 border-white/15',
  }[v];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${styles} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

// ==========================================
// 3. ADMIN MODAL
// ==========================================
export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = '2xl',
}) => {
  if (!isOpen) return null;

  const maxWClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className={`relative w-full ${maxWClass} bg-dark-1 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-scale-in`}>
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{title}</h3>
            {description && (
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

// ==========================================
// 4. CONFIRMATION MODAL
// ==========================================
export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            variant === 'danger' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-slate-300 text-sm leading-relaxed font-normal">{message}</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
          >
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            disabled={loading}
            className={`px-6 py-2.5 rounded-full text-sm font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-2 ${
              variant === 'danger' 
                ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-rose-600/30 hover:from-rose-500 hover:to-rose-400' 
                : 'bg-volt text-dark-0 shadow-volt/30 hover:bg-cyan-300'
            }`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </AdminModal>
  );
};

// ==========================================
// 5. BREADCRUMBS
// ==========================================
export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export const AdminBreadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
          {item.active ? (
            <span className="text-volt font-bold">{item.label}</span>
          ) : (
            <span className="hover:text-slate-200 transition-colors">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// ==========================================
// 6. EMPTY STATE
// ==========================================
export interface AdminEmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="glass-card rounded-3xl p-12 text-center border border-white/10 max-w-lg mx-auto space-y-4 my-8">
      <div className="w-16 h-16 rounded-3xl bg-dark-2 border border-white/10 flex items-center justify-center mx-auto text-volt shadow-lg">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-xl font-bold text-white tracking-tight">{title}</h4>
      <p className="text-slate-400 text-sm max-w-sm mx-auto font-normal leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn-primary py-2.5 px-6 rounded-full text-xs font-bold mt-2 shadow-lg">
          {actionText}
        </button>
      )}
    </div>
  );
};
