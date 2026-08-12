import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  ExternalLink,
  ChevronDown,
  X,
  Package,
  Inbox
} from 'lucide-react';
import { useAuth, type UserRole } from '../context/AuthContext';
import { useAdminStore } from '../data/adminStore';

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleMobileMenu }) => {
  const { user, logout, switchRole } = useAuth();
  const { enquiries, products } = useAdminStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const quickActionRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (quickActionRef.current && !quickActionRef.current.contains(event.target as Node)) {
        setQuickActionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get current page title from pathname
  const getPageTitle = (path: string) => {
    if (path.includes('/admin/products/new')) return 'Add New Product';
    if (path.includes('/admin/products/') && path.includes('/edit')) return 'Edit Product';
    if (path.includes('/admin/products')) return 'Product Inventory';
    if (path.includes('/admin/categories')) return 'Category Management';
    if (path.includes('/admin/brands')) return 'Brand Management';
    if (path.includes('/admin/gallery')) return 'Media & Gallery';
    if (path.includes('/admin/testimonials')) return 'Customer Reviews';
    if (path.includes('/admin/faqs')) return 'FAQ Management';
    if (path.includes('/admin/enquiries')) return 'Customer Enquiry Inbox';
    if (path.includes('/admin/business')) return 'Business Information';
    if (path.includes('/admin/content')) return 'Homepage CMS';
    if (path.includes('/admin/users')) return 'Team & Access Control';
    if (path.includes('/admin/activity')) return 'Activity Audit Trail';
    if (path.includes('/admin/settings')) return 'System Settings';
    if (path.includes('/admin/analytics')) return 'Performance Analytics';
    if (path.includes('/admin/security-states')) return 'Security State Showcase';
    return 'Dashboard Overview';
  };

  const unreadEnquiries = enquiries.filter(e => e.status === 'NEW').slice(0, 4);

  // Filter products or enquiries in quick search
  const searchResults = searchQuery.trim() === '' ? [] : [
    ...products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(p => ({
      type: 'Product',
      title: p.name,
      subtitle: `${p.brand} • ${p.category}`,
      to: `/admin/products/${p.id}/edit`
    })),
    ...enquiries.filter(e => e.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || e.productRequirement.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3).map(e => ({
      type: 'Enquiry',
      title: e.customerName,
      subtitle: e.productRequirement,
      to: '/admin/enquiries'
    }))
  ];

  return (
    <>
      <header className="h-16 bg-dark-1/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
        {/* Left Side: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-none">
              {getPageTitle(location.pathname)}
            </h1>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-medium">
              <span>Admin</span>
              <span>/</span>
              <span className="text-volt">{getPageTitle(location.pathname)}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Search, Quick Actions, Notifications, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Button (Desktop) */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-volt" />
            <span>Search admin...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-dark-0 text-[10px] text-slate-400 border border-white/10 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Quick Action Button */}
          <div className="relative" ref={quickActionRef}>
            <button
              onClick={() => setQuickActionOpen(!quickActionOpen)}
              className="btn-primary py-1.5 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Action</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {quickActionOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-dark-1 border border-white/15 rounded-2xl p-2 shadow-2xl z-50 animate-scale-in space-y-1">
                <button
                  onClick={() => { setQuickActionOpen(false); navigate('/admin/products/new'); }}
                  className="flex items-center gap-2.5 w-full p-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 text-left transition-colors"
                >
                  <Package className="w-4 h-4 text-volt" />
                  <span>Add New Product</span>
                </button>
                <button
                  onClick={() => { setQuickActionOpen(false); navigate('/admin/enquiries'); }}
                  className="flex items-center gap-2.5 w-full p-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 text-left transition-colors"
                >
                  <Inbox className="w-4 h-4 text-emerald-400" />
                  <span>View Recent Enquiries</span>
                </button>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 w-full p-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 text-left transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-blue-400" />
                  <span>Open Public Store</span>
                </a>
              </div>
            )}
          </div>

          {/* Notifications Center */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadEnquiries.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-volt text-dark-0 text-[10px] font-black flex items-center justify-center shadow-[0_0_8px_rgba(0,229,255,0.8)]">
                  {unreadEnquiries.length}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-dark-1 border border-white/15 rounded-3xl p-4 shadow-2xl z-50 animate-scale-in">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">Notifications</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-volt text-dark-0">
                      {unreadEnquiries.length} New
                    </span>
                  </div>
                  <button
                    onClick={() => { setNotifOpen(false); navigate('/admin/enquiries'); }}
                    className="text-xs text-volt hover:underline font-semibold"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {unreadEnquiries.length > 0 ? (
                    unreadEnquiries.map((enq) => (
                      <div
                        key={enq.id}
                        onClick={() => { setNotifOpen(false); navigate('/admin/enquiries'); }}
                        className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-white truncate">{enq.customerName}</span>
                          <span className="text-[10px] text-volt">{enq.date}</span>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-1">{enq.productRequirement}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">
                      All caught up! No unread notifications.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user?.name || 'Admin'}
                className="w-7 h-7 rounded-full object-cover border border-volt/40"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1 hidden sm:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-dark-1 border border-white/15 rounded-3xl p-3 shadow-2xl z-50 animate-scale-in">
                {/* User Info Header */}
                <div className="p-3 border-b border-white/10 mb-2">
                  <div className="font-extrabold text-white text-sm">{user?.name}</div>
                  <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-volt/15 text-volt border border-volt/30">
                    <ShieldCheck className="w-3 h-3" />
                    Role: {user?.role}
                  </div>
                </div>

                {/* Quick Role Switcher for Testing */}
                <div className="p-2 bg-white/5 rounded-2xl border border-white/5 mb-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
                    Demo Role Switcher:
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(['OWNER', 'MANAGER', 'STAFF'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => switchRole(r)}
                        className={`py-1 rounded-xl text-[10px] font-bold transition-all ${
                          user?.role === r
                            ? 'bg-volt text-dark-0 shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                            : 'bg-dark-2 text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dropdown Navigation */}
                <div className="space-y-1">
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/admin/settings'); }}
                    className="flex items-center gap-2.5 w-full p-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 text-left transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Account Settings</span>
                  </button>

                  <button
                    onClick={() => { setProfileOpen(false); logout(); navigate('/admin/login'); }}
                    className="flex items-center gap-2.5 w-full p-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Quick Search Modal (Cmd+K) */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md">
          <div className="fixed inset-0" onClick={() => setSearchModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-dark-1 border border-white/20 rounded-3xl p-4 sm:p-6 shadow-2xl z-10 animate-scale-in">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-volt" />
              <input
                type="text"
                autoFocus
                placeholder="Search products, orders, categories, or pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-volt/50"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => { setSearchModalOpen(false); navigate(item.to); }}
                    className="p-3 rounded-2xl hover:bg-white/10 flex items-center justify-between cursor-pointer transition-colors border border-transparent hover:border-white/10"
                  >
                    <div>
                      <div className="text-xs font-extrabold text-white">{item.title}</div>
                      <div className="text-[11px] text-slate-400">{item.subtitle}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-volt/15 text-volt border border-volt/30">
                      {item.type}
                    </span>
                  </div>
                ))
              ) : searchQuery ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No matching results for "{searchQuery}"
                </div>
              ) : (
                <div className="py-4 text-xs text-slate-400 space-y-2">
                  <div className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-2">Quick Shortcuts</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { setSearchModalOpen(false); navigate('/admin/products'); }} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-left text-slate-200">📦 Products</button>
                    <button onClick={() => { setSearchModalOpen(false); navigate('/admin/enquiries'); }} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-left text-slate-200">📥 Enquiries</button>
                    <button onClick={() => { setSearchModalOpen(false); navigate('/admin/business'); }} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-left text-slate-200">🏢 Business Info</button>
                    <button onClick={() => { setSearchModalOpen(false); navigate('/admin/analytics'); }} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-left text-slate-200">📊 Analytics</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
