import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Clock, 
  UserX, 
  AlertTriangle, 
  ServerCrash
} from 'lucide-react';
import { AdminBreadcrumbs } from '../components/AdminUI';

export const AdminSecurityStates: React.FC = () => {
  const [activeState, setActiveState] = useState<
    '401' | '403' | 'expired' | 'disabled' | 'ratelimit' | '500'
  >('403');

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <AdminBreadcrumbs items={[{ label: 'Admin' }, { label: 'Security UX States Showcase', active: true }]} />

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Security & Error UX States</h1>
          <span className="px-3 py-1 rounded-full bg-volt/15 text-volt border border-volt/30 text-xs font-black">
            Audited
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Interactive validator demonstrating how Sai Enterprises gracefully handles security edge cases and access controls
        </p>
      </div>

      {/* State Switcher Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {[
          { id: '403', label: '403 Forbidden', icon: ShieldAlert },
          { id: '401', label: '401 Unauthorized', icon: Lock },
          { id: 'expired', label: 'Session Expired', icon: Clock },
          { id: 'disabled', label: 'Account Disabled', icon: UserX },
          { id: 'ratelimit', label: 'Rate Limited', icon: AlertTriangle },
          { id: '500', label: '500 Server Error', icon: ServerCrash },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveState(item.id as any)}
            className={`p-3 rounded-2xl font-bold flex flex-col items-center justify-center gap-1.5 transition-all border ${
              activeState === item.id
                ? 'bg-volt text-dark-0 border-volt shadow-lg'
                : 'bg-dark-1 text-slate-300 border-white/10 hover:border-white/20 hover:text-white'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-[11px]">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Live Preview Container */}
      <div className="glass-card rounded-3xl p-6 sm:p-12 border border-white/15 shadow-2xl flex items-center justify-center min-h-[420px] relative overflow-hidden">
        {/* State 403 Forbidden */}
        {activeState === '403' && (
          <div className="max-w-md w-full text-center space-y-4 animate-scale-in">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">HTTP 403 • Access Denied</span>
            <h3 className="text-2xl font-extrabold text-white">Insufficient Role Permissions</h3>
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              Your account role does not have authorization to view this resource. Contact the business owner or switch to the Owner role for evaluation.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <span className="text-xs text-slate-400 italic">Contact the OWNER to request elevated access.</span>
            </div>
          </div>
        )}

        {/* State 401 Unauthorized */}
        {activeState === '401' && (
          <div className="max-w-md w-full text-center space-y-4 animate-scale-in">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
              <Lock className="w-8 h-8" />
            </div>
            <span className="text-xs font-extrabold text-rose-400 uppercase tracking-widest">HTTP 401 • Authentication Required</span>
            <h3 className="text-2xl font-extrabold text-white">Unauthenticated Session</h3>
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              You must provide valid JWT bearer authorization credentials to access the Sai Enterprises administrative backend.
            </p>
            <div className="pt-2">
              <a href="/admin/login" className="btn-primary py-2 px-6 rounded-full text-xs font-bold shadow-lg">
                Log In Again
              </a>
            </div>
          </div>
        )}

        {/* State Session Expired */}
        {activeState === 'expired' && (
          <div className="max-w-md w-full text-center space-y-4 animate-scale-in">
            <div className="w-16 h-16 rounded-3xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <Clock className="w-8 h-8" />
            </div>
            <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">Session Timeout</span>
            <h3 className="text-2xl font-extrabold text-white">Your Session Has Expired</h3>
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              For security reasons, your idle session was locked after 8 hours of inactivity. Please re-enter your password.
            </p>
            <div className="pt-2">
              <a href="/admin/login" className="btn-primary py-2 px-6 rounded-full text-xs font-bold shadow-lg">
                Re-Authenticate
              </a>
            </div>
          </div>
        )}

        {/* State Account Disabled */}
        {activeState === 'disabled' && (
          <div className="max-w-md w-full text-center space-y-4 animate-scale-in">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
              <UserX className="w-8 h-8" />
            </div>
            <span className="text-xs font-extrabold text-rose-400 uppercase tracking-widest">Account Suspended</span>
            <h3 className="text-2xl font-extrabold text-white">Staff Account Disabled</h3>
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              This staff access key has been deactivated by the store administrator. Please contact Suresh Sharma (+91 79786 72521).
            </p>
            <div className="pt-2">
              <a href="/" className="btn-secondary py-2 px-6 rounded-full text-xs font-bold text-white border border-white/10">
                Return to Storefront
              </a>
            </div>
          </div>
        )}

        {/* State Rate Limited */}
        {activeState === 'ratelimit' && (
          <div className="max-w-md w-full text-center space-y-4 animate-scale-in">
            <div className="w-16 h-16 rounded-3xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-widest">HTTP 429 • Too Many Requests</span>
            <h3 className="text-2xl font-extrabold text-white">Rate Limit Exceeded</h3>
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              Excessive consecutive failed login attempts detected from your IP. Login attempts locked for 15 minutes to protect against brute force attacks.
            </p>
            <div className="pt-2">
              <span className="text-xs text-volt font-mono font-bold">Cooldown remaining: 14m 28s</span>
            </div>
          </div>
        )}

        {/* State 500 Server Error */}
        {activeState === '500' && (
          <div className="max-w-md w-full text-center space-y-4 animate-scale-in">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
              <ServerCrash className="w-8 h-8" />
            </div>
            <span className="text-xs font-extrabold text-rose-400 uppercase tracking-widest">HTTP 500 • Internal Error</span>
            <h3 className="text-2xl font-extrabold text-white">Something Went Wrong</h3>
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              An unexpected exception occurred while retrieving catalogue metrics. The incident has been recorded in the audit trail.
            </p>
            <div className="pt-2">
              <button onClick={() => setActiveState('403')} className="btn-primary py-2 px-6 rounded-full text-xs font-bold shadow-lg">
                Retry Operation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
