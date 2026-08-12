import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export const AdminLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-dark-0 text-slate-100 overflow-hidden font-sans">
      {/* 1. Desktop Persistent Sidebar */}
      <div className="hidden lg:flex shrink-0 h-full">
        <AdminSidebar />
      </div>

      {/* 2. Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Slide-out Sidebar */}
          <div className="relative z-10 w-72 h-full animate-slide-right">
            <AdminSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* 3. Main Content View Area */}
      <div className="flex flex-col flex-grow h-full overflow-hidden">
        <AdminHeader onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 no-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
