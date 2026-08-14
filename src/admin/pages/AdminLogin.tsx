import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Zap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const { login, resetPassword, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password modal state
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  const handleForgotPasswordOpen = () => {
    setResetEmail(email); // pre-fill with current email input
    setResetSent(false);
    setResetError(null);
    setForgotPasswordOpen(true);
    clearError();
  };

  const handleSendReset = async () => {
    if (!resetEmail.trim()) {
      setResetError('Please enter your email address.');
      return;
    }
    setResetLoading(true);
    setResetError(null);
    const success = await resetPassword(resetEmail);
    setResetLoading(false);
    if (success) {
      setResetSent(true);
    } else {
      setResetError('Could not send reset email. Please check the address and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-0 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-volt/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-volt to-volt-dim flex items-center justify-center shadow-[0_0_25px_rgba(0,229,255,0.4)] group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-dark-0" strokeWidth={2.5} />
            </div>
            <div className="text-2xl font-extrabold text-white tracking-tight">
              Sai<span className="text-volt">Enterprises</span>
            </div>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-volt" />
            <span>Secure Business Management Portal</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Administrator Login</h2>
            <p className="text-xs text-slate-400 mt-1 font-normal">
              Enter your authorized staff credentials to manage the Sai Enterprises platform.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-scale-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  placeholder="name@saienterprises.in"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-volt/50 focus:ring-1 focus:ring-volt/50 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPasswordOpen}
                  className="text-xs text-volt hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-volt/50 focus:ring-1 focus:ring-volt/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              id="admin-login-btn"
              className="btn-primary w-full py-3.5 rounded-2xl font-extrabold text-sm justify-center shadow-xl flex items-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating…</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Public Store Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-volt transition-colors inline-flex items-center gap-1.5"
          >
            ← Return to Sai Enterprises Public Store
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl space-y-4">
            <h3 className="text-xl font-extrabold text-white">Reset Admin Password</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Enter your registered work email address. A secure password reset link will be sent to your inbox.
            </p>

            {resetSent ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Reset link sent to <strong>{resetEmail}</strong>. Check your inbox and follow the instructions.
                </span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => { setResetEmail(e.target.value); setResetError(null); }}
                  placeholder="name@saienterprises.in"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
                />
                {resetError && (
                  <p className="text-xs text-rose-400">{resetError}</p>
                )}
              </>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => { setForgotPasswordOpen(false); setResetSent(false); setResetError(null); }}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300"
              >
                Close
              </button>
              {!resetSent && (
                <button
                  type="button"
                  disabled={resetLoading}
                  onClick={handleSendReset}
                  className="btn-primary py-2 px-5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 disabled:opacity-60"
                >
                  {resetLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
