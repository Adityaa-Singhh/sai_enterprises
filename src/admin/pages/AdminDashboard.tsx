import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Layers, 
  Award, 
  Inbox, 
  Clock, 
  CheckCircle2, 
  Users, 
  MessageSquare, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { KPICard, StatusBadge } from '../components/AdminUI';
import { 
  TrafficAreaChart, 
  EnquiryTrendChart, 
  TopProductsBarChart, 
  CategoryPerformanceChart, 
  TrafficSourcesDonutChart, 
  DeviceBreakdownDonutChart, 
  BrandPerformanceChart, 
  ConversionFunnelChart 
} from '../components/AdminCharts';
import { useAdminStore } from '../data/adminStore';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../../utils/dateUtils';

export const AdminDashboard: React.FC = () => {
  const { products, categories, brands, enquiries, activities, updateEnquiryStatus } = useAdminStore();
  const { userProfile } = useAuth();

  const newEnquiries = enquiries.filter(e => e.status === 'NEW');
  const pendingEnquiries = enquiries.filter(e => e.status === 'CONTACTED' || e.status === 'IN_PROGRESS');
  const resolvedEnquiries = enquiries.filter(e => e.status === 'RESOLVED' || e.status === 'CLOSED');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Welcome & Business Status Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-volt/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-volt/10 border border-volt/30 text-volt text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Store Console • Gurugram Sector 15
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-volt">{userProfile?.displayName || 'Administrator'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-normal leading-relaxed">
              Sai Enterprises is experiencing strong demand today. You have <strong className="text-volt">{newEnquiries.length} unread customer inquiries</strong> requiring quotation and stock verification.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Link
              to="/admin/products/new"
              className="btn-primary py-3 px-5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>

            <Link
              to="/admin/enquiries"
              className="btn-secondary py-3 px-5 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-2 hover:border-volt/40"
            >
              <Inbox className="w-4 h-4 text-volt" />
              <span>Process Inquiries</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Top 8 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard
          title="Total Products"
          value={products.length}
          change="+8.4%"
          isPositive={true}
          icon={Package}
          accentColor="volt"
          subtitle={`${products.filter(p => p.inStock).length} active in-stock items`}
        />

        <KPICard
          title="Product Categories"
          value={categories.length}
          change="+1 new"
          isPositive={true}
          icon={Layers}
          accentColor="blue"
          subtitle="Switches, Wires, Lighting, DBs"
        />

        <KPICard
          title="Authorized Brands"
          value={brands.length}
          change="PMCona Premier"
          isPositive={true}
          icon={Award}
          accentColor="emerald"
          subtitle="Havells, Polycab, Finolex & Anchor"
        />

        <KPICard
          title="New Inquiries"
          value={newEnquiries.length}
          change="+18.2%"
          isPositive={true}
          icon={Inbox}
          accentColor="volt"
          subtitle="Requires immediate staff follow-up"
        />

        <KPICard
          title="Pending Quotes"
          value={pendingEnquiries.length}
          change="In progress"
          isPositive={true}
          icon={Clock}
          accentColor="amber"
          subtitle="Contractors awaiting bulk pricing"
        />

        <KPICard
          title="Resolved Orders"
          value={resolvedEnquiries.length}
          change="+24.5%"
          isPositive={true}
          icon={CheckCircle2}
          accentColor="emerald"
          subtitle="Fulfilled & invoiced this month"
        />

        <KPICard
          title="Monthly Visitors"
          value="14,280"
          change="+22.1%"
          isPositive={true}
          icon={Users}
          accentColor="blue"
          subtitle="74% visiting from mobile devices"
        />

        <KPICard
          title="WhatsApp Queries"
          value="2,150"
          change="+31.4%"
          isPositive={true}
          icon={MessageSquare}
          accentColor="emerald"
          subtitle="Direct WhatsApp quote dispatches"
        />
      </div>

      {/* 3. Primary Charts Grid (Row 1: Traffic & Enquiry Trends) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrafficAreaChart />
        <EnquiryTrendChart />
      </div>

      {/* 4. Secondary Charts Grid (Row 2: Top Products & Category Performance) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsBarChart />
        <CategoryPerformanceChart />
      </div>

      {/* 5. Tertiary Charts Grid (Row 3: Sources, Devices & Brand Inquiries) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TrafficSourcesDonutChart />
        <DeviceBreakdownDonutChart />
        <BrandPerformanceChart />
      </div>

      {/* 6. Conversion Funnel */}
      <ConversionFunnelChart />

      {/* 7. Bottom Operational Feeds (Recent Enquiries & Admin Audit) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enquiries Live Table (2 Columns) */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">Recent Customer Inquiries</h3>
              <p className="text-xs text-slate-400 mt-0.5">Live leads from WhatsApp and website quotation form</p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-bold text-volt hover:underline flex items-center gap-1"
            >
              View All Inquiries <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {enquiries.slice(0, 4).map((enq) => (
              <div
                key={enq.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-volt/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-white text-sm">{enq.customerName}</span>
                    <StatusBadge status={enq.status} />
                    <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-dark-2 rounded-full">
                      {enq.source}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1">{enq.productRequirement}</p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>{enq.phone}</span>
                    <span>•</span>
                    <span>{formatDateTime(enq.date)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${enq.customerName}, regarding your electrical requirement for "${enq.productRequirement}" with Sai Enterprises...`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  {enq.status === 'NEW' && (
                    <button
                      onClick={() => updateEnquiryStatus(enq.id, 'CONTACTED')}
                      className="p-2 rounded-xl bg-volt/10 hover:bg-volt/20 text-volt border border-volt/30 text-xs font-bold transition-colors"
                    >
                      Mark Contacted
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Admin Audit Activity Feed (1 Column) */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-white tracking-tight">Admin Activity Log</h3>
              <p className="text-xs text-slate-400 mt-0.5">Chronological system audit</p>
            </div>
            <Link
              to="/admin/activity"
              className="text-xs font-bold text-volt hover:underline"
            >
              Full Log
            </Link>
          </div>

          <div className="space-y-4">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs pb-3 border-b border-white/5 last:border-0 last:pb-0">
                <div className="w-7 h-7 rounded-xl bg-dark-2 border border-white/10 flex items-center justify-center text-volt shrink-0 mt-0.5 font-bold text-[10px]">
                  {act.userName.charAt(0)}
                </div>
                <div className="space-y-0.5 flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{act.action}</span>
                    <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] truncate">{act.resource}</p>
                  <span className="text-[10px] text-slate-400 font-medium">{act.userName} ({act.userRole})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
