import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Zap, 
  LayoutDashboard, 
  Package, 
  Layers, 
  Award, 
  Image as ImageIcon, 
  MessageSquareQuote, 
  HelpCircle, 
  Inbox, 
  BarChart3, 
  Building2, 
  Users, 
  Settings, 
  Activity, 
  ExternalLink,
  Shield,
  FileText,
  LogOut,
  type LucideIcon
} from 'lucide-react';
import { useAuth, type Permission } from '../context/AuthContext';
import { useAdminStore } from '../data/adminStore';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  permission: Permission | null;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const { userProfile, logout, hasPermission } = useAuth();
  const { enquiries } = useAdminStore();

  const newEnquiriesCount = enquiries.filter(e => e.status === 'NEW').length;

  const navGroups: NavGroup[] = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, permission: null },
        { label: 'Analytics', to: '/admin/analytics', icon: BarChart3, permission: 'analytics.view' },
        { label: 'Enquiries', to: '/admin/enquiries', icon: Inbox, badge: newEnquiriesCount > 0 ? newEnquiriesCount : undefined, permission: 'enquiries.view' },
      ]
    },
    {
      title: 'CATALOGUE & INVENTORY',
      items: [
        { label: 'Products', to: '/admin/products', icon: Package, permission: 'products.view' },
        { label: 'Categories', to: '/admin/categories', icon: Layers, permission: 'categories.manage' },
        { label: 'Brands', to: '/admin/brands', icon: Award, permission: 'brands.manage' },
      ]
    },
    {
      title: 'CONTENT & CMS',
      items: [
        { label: 'Gallery', to: '/admin/gallery', icon: ImageIcon, permission: 'gallery.manage' },
        { label: 'Testimonials', to: '/admin/testimonials', icon: MessageSquareQuote, permission: 'testimonials.manage' },
        { label: 'FAQs', to: '/admin/faqs', icon: HelpCircle, permission: 'faqs.manage' },
        { label: 'Homepage CMS', to: '/admin/content', icon: FileText, permission: 'content.edit' },
      ]
    },
    {
      title: 'SYSTEM & SETTINGS',
      items: [
        { label: 'Business Info', to: '/admin/business', icon: Building2, permission: 'business.edit' },
        { label: 'Team & Users', to: '/admin/users', icon: Users, permission: 'users.manage' },
        { label: 'Activity Audit', to: '/admin/activity', icon: Activity, permission: 'activity.view' },
        { label: 'Settings', to: '/admin/settings', icon: Settings, permission: 'settings.manage' },
        { label: 'Security States', to: '/admin/security-states', icon: Shield, permission: null },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-dark-1 border-r border-white/10 flex flex-col h-full overflow-y-auto no-scrollbar select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 shrink-0">
        <Link to="/admin/dashboard" onClick={onCloseMobile} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-volt to-volt-dim flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)] group-hover:scale-105 transition-transform shrink-0">
            <Zap className="w-5 h-5 text-dark-0" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-extrabold text-white text-base tracking-tight leading-none">
              Sai<span className="text-volt">Enterprises</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                Admin Console
              </span>
            </div>
          </div>
        </Link>

        {/* Current User Role Badge */}
        {userProfile && (
          <div className="mt-4 p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-volt/80 to-blue-500/80 flex items-center justify-center border border-volt/40 text-dark-0 text-[11px] font-extrabold shrink-0">
                {userProfile.displayName?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{userProfile.displayName}</div>
                <div className="text-[10px] text-volt font-semibold uppercase tracking-wider">{userProfile.role}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="p-4 flex-grow space-y-6">
        {navGroups.map((group) => {
          // Filter items based on permissions
          const visibleItems = group.items.filter(
            item => item.permission === null || hasPermission(item.permission)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title}>
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 mb-2">
                {group.title}
              </div>
              <div className="space-y-1">
                {visibleItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                        isActive
                          ? 'bg-volt text-dark-0 font-extrabold shadow-[0_0_15px_rgba(0,229,255,0.35)]'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <item.icon
                            className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                              isActive ? 'text-dark-0' : 'text-slate-400 group-hover:text-volt'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>

                        {item.badge !== undefined && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              isActive
                                ? 'bg-dark-0 text-volt'
                                : 'bg-volt text-dark-0 shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/10 shrink-0 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-volt hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            Live Customer Store
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </a>

        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
