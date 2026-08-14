import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth, type Permission } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
}) => {
  const { isAuthenticated, userProfile, hasPermission, isLoading } = useAuth();
  const location = useLocation();

  // 1. Show loading spinner while Firebase resolves auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-volt animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Verifying session…</p>
        </div>
      </div>
    );
  }

  // 2. Not authenticated — redirect to login
  if (!isAuthenticated || !userProfile) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 3. Account disabled
  if (userProfile.status === 'DISABLED') {
    return (
      <div className="min-h-screen bg-dark-0 flex items-center justify-center p-6 text-white">
        <div className="glass-card max-w-md w-full p-8 rounded-3xl text-center border border-rose-500/30 shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Account Disabled</h2>
          <p className="text-sm text-slate-300 font-normal">
            Your administrator account has been deactivated. Please contact the business owner for assistance.
          </p>
          <div className="pt-4">
            <Link
              to="/admin/login"
              className="btn-secondary py-2.5 px-6 rounded-full text-xs font-bold text-white border border-white/10"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Insufficient RBAC permissions
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="glass-card max-w-lg w-full p-8 rounded-3xl text-center border border-amber-500/30 shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
              403 Forbidden Access
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1">Permission Required</h2>
            <p className="text-sm text-slate-300 font-normal mt-2 leading-relaxed">
              Your current role (
              <strong className="text-volt">{userProfile.role}</strong>) does not have
              sufficient permissions to access this area.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/admin/dashboard"
              className="btn-secondary py-2.5 px-6 rounded-full text-xs font-bold text-white border border-white/10 inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
