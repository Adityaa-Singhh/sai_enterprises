import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Download, 
  Search, 
  MapPin
} from 'lucide-react';
import { AdminBreadcrumbs, KPICard } from '../components/AdminUI';
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

export const AdminAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '12m'>('30d');

  const handleExportReport = () => {
    alert(`Exporting Sai Enterprises Performance Report (${timeRange}) in PDF format...`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <AdminBreadcrumbs items={[{ label: 'Admin' }, { label: 'Performance Analytics', active: true }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Performance & Business Analytics</h1>
            <span className="px-3 py-1 rounded-full bg-volt/15 text-volt border border-volt/30 text-xs font-black">
              Live Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track user engagement, lead generation conversion funnel, product search popularity and brand demand
          </p>
        </div>

        {/* Time Range Selector & Export */}
        <div className="flex items-center gap-2">
          <div className="bg-dark-1 border border-white/10 rounded-2xl p-1 flex items-center gap-1 text-xs">
            {(['7d', '30d', '90d', '12m'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all ${
                  timeRange === r ? 'bg-volt text-dark-0 shadow-md font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReport}
            className="btn-primary py-2 px-4 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 Analytics KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KPICard
          title="Total Store Visitors"
          value="14,280"
          change="+24.2%"
          isPositive={true}
          icon={Users}
          accentColor="volt"
          subtitle="482 avg daily active visitors"
        />

        <KPICard
          title="Quotation Conversion"
          value="15.05%"
          change="+3.8%"
          isPositive={true}
          icon={TrendingUp}
          accentColor="emerald"
          subtitle="2,150 total WhatsApp inquiries"
        />

        <KPICard
          title="Avg Quotation Value"
          value="₹38,400"
          change="+12.4%"
          isPositive={true}
          icon={MessageSquare}
          accentColor="amber"
          subtitle="Driven by bulk contractor orders"
        />

        <KPICard
          title="Mobile Share"
          value="74.2%"
          change="+5.1%"
          isPositive={true}
          icon={Users}
          accentColor="blue"
          subtitle="Optimized for touch catalog browsing"
        />
      </div>

      {/* Primary Chart Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrafficAreaChart />
        <EnquiryTrendChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsBarChart />
        <CategoryPerformanceChart />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TrafficSourcesDonutChart />
        <DeviceBreakdownDonutChart />
        <BrandPerformanceChart />
      </div>

      <ConversionFunnelChart />

      {/* Deep Dive Tables (Top Search Queries & Regional Demand) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Search Keywords Table */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-volt" />
              <h3 className="text-lg font-bold text-white tracking-tight">Top Store Search Queries</h3>
            </div>
            <span className="text-xs text-slate-400 font-bold">Past 30 Days</span>
          </div>

          <div className="space-y-2.5">
            {[
              { query: 'PMCona modular switches rate list', count: 1840, growth: '+42%' },
              { query: 'Polycab 2.5 sq mm wire coil', count: 1420, growth: '+28%' },
              { query: 'Havells MCB double pole 32A', count: 980, growth: '+15%' },
              { query: '15W LED panel light warm white', count: 850, growth: '+19%' },
              { query: 'Schneider 12 Way Distribution Board', count: 640, growth: '+8%' },
              { query: 'Finolex 4 core flexible cable', count: 520, growth: '+12%' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-dark-2 flex items-center justify-center font-bold text-slate-400 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-white">{item.query}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-300 font-mono font-bold">{item.count.toLocaleString()}</span>
                  <span className="text-emerald-400 font-extrabold text-[11px]">{item.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Customer Demand */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-volt" />
              <h3 className="text-lg font-bold text-white tracking-tight">Regional Demand Breakdown</h3>
            </div>
            <span className="text-xs text-slate-400 font-bold">Odisha Distribution</span>
          </div>

          <div className="space-y-3">
            {[
              { region: 'Rourkela (Udit Nagar, Civil Township)', percent: 48, orders: '1,032 quotes' },
              { region: 'Sundargarh & Jharsuguda', percent: 24, orders: '516 quotes' },
              { region: 'Birmitrapur & Kansbahal Industrial Area', percent: 16, orders: '344 quotes' },
              { region: 'Rajgangpur', percent: 8, orders: '172 quotes' },
              { region: 'Other Odisha Districts (Sambalpur, Keonjhar)', percent: 4, orders: '86 quotes' },
            ].map((reg, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-200">{reg.region}</span>
                  <span className="text-volt font-bold">{reg.percent}% ({reg.orders})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-dark-2 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-volt to-blue-500" style={{ width: `${reg.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
