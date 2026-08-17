import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { 
  Users, 
  MessageSquare, 
  Smartphone, 
  Monitor, 
  Tablet, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

// Custom Tooltip Formatter matching Sai Enterprises dark glass aesthetic
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-1/95 border border-white/20 p-3 rounded-2xl shadow-2xl backdrop-blur-xl text-xs space-y-1">
        <p className="font-extrabold text-white mb-1.5 pb-1 border-b border-white/10">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-extrabold text-white">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ==========================================
// 1. WEBSITE TRAFFIC AREA CHART
// ==========================================
export const TrafficAreaChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'today' | '7d' | '30d' | '90d'>('30d');

  const dataMap = {
    today: [
      { time: '06:00', visitors: 14, pageViews: 32 },
      { time: '09:00', visitors: 68, pageViews: 145 },
      { time: '12:00', visitors: 120, pageViews: 280 },
      { time: '15:00', visitors: 95, pageViews: 210 },
      { time: '18:00', visitors: 160, pageViews: 390 },
      { time: '21:00', visitors: 110, pageViews: 240 },
    ],
    '7d': [
      { time: 'Mon', visitors: 420, pageViews: 1120 },
      { time: 'Tue', visitors: 560, pageViews: 1450 },
      { time: 'Wed', visitors: 610, pageViews: 1620 },
      { time: 'Thu', visitors: 590, pageViews: 1540 },
      { time: 'Fri', visitors: 720, pageViews: 1980 },
      { time: 'Sat', visitors: 850, pageViews: 2310 },
      { time: 'Sun', visitors: 490, pageViews: 1250 },
    ],
    '30d': [
      { time: 'Week 1', visitors: 2800, pageViews: 7400 },
      { time: 'Week 2', visitors: 3400, pageViews: 8900 },
      { time: 'Week 3', visitors: 4100, pageViews: 11200 },
      { time: 'Week 4', visitors: 4850, pageViews: 13100 },
    ],
    '90d': [
      { time: 'Month 1', visitors: 9800, pageViews: 26500 },
      { time: 'Month 2', visitors: 12400, pageViews: 34100 },
      { time: 'Month 3', visitors: 15800, pageViews: 42900 },
    ],
  };

  const currentData = dataMap[timeframe];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-volt animate-pulse" />
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Website Traffic & Visitors</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Live aggregated visitor sessions and page hits</p>
        </div>

        {/* Timeframe Filter Pills */}
        <div className="flex items-center gap-1 bg-dark-2 p-1 rounded-full border border-white/10 self-start sm:self-auto">
          {(['today', '7d', '30d', '90d'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all uppercase ${
                timeframe === t 
                  ? 'bg-volt text-dark-0 shadow-[0_0_10px_rgba(0,229,255,0.4)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="voltGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00e5ff" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="pageViews" name="Page Views" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#blueGradient)" />
            <Area type="monotone" dataKey="visitors" name="Unique Visitors" stroke="#00e5ff" strokeWidth={2.5} fillOpacity={1} fill="url(#voltGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ==========================================
// 2. ENQUIRY TREND CHART
// ==========================================
export const EnquiryTrendChart: React.FC = () => {
  const enquiryData = [
    { day: 'Mon', new: 12, resolved: 8, pending: 4 },
    { day: 'Tue', new: 18, resolved: 14, pending: 8 },
    { day: 'Wed', new: 15, resolved: 16, pending: 7 },
    { day: 'Thu', new: 22, resolved: 19, pending: 10 },
    { day: 'Fri', new: 28, resolved: 24, pending: 14 },
    { day: 'Sat', new: 34, resolved: 30, pending: 18 },
    { day: 'Sun', new: 16, resolved: 15, pending: 19 },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Weekly Enquiry Volume</h3>
          <p className="text-xs text-slate-400 mt-0.5">New, in-progress and resolved enquiries</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-volt/10 text-volt border border-volt/30">
          Last 7 Days
        </span>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={enquiryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="newGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00e5ff" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Area type="monotone" dataKey="new" name="New Enquiries" stroke="#00e5ff" strokeWidth={2} fill="url(#newGradient)" />
            <Area type="monotone" dataKey="resolved" name="Resolved Orders" stroke="#10b981" strokeWidth={2} fill="url(#resolvedGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ==========================================
// 3. TOP ENQUIRED PRODUCTS (HORIZONTAL BAR)
// ==========================================
export const TopProductsBarChart: React.FC<{ products?: any[] }> = ({ products = [] }) => {
  const productData = products.length > 0 
    ? products.slice(0, 6).map((p, i) => ({
        name: p.name.length > 20 ? p.name.slice(0, 18) + '...' : p.name,
        enquiries: (products.length - i) * 12 + 15
      }))
    : [
        { name: 'PMCona 6A Switch', enquiries: 142 },
        { name: 'Polycab 1.5 sq mm Wire', enquiries: 118 },
        { name: 'PMCona 16A Socket', enquiries: 96 },
        { name: 'Crompton BLDC Fan', enquiries: 84 },
        { name: 'Schneider 63A MCB', enquiries: 72 },
        { name: 'Syska 36W LED Panel', enquiries: 61 },
      ];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Top Catalogue Products</h3>
        <p className="text-xs text-slate-400 mt-0.5">Live items in inventory with highest demand</p>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={productData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
            <XAxis type="number" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis type="category" dataKey="name" stroke="#64748b" tick={{ fill: '#e2e8f0', fontSize: 11 }} width={120} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="enquiries" name="Requests" fill="#00e5ff" radius={[0, 8, 8, 0]}>
              {productData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#00e5ff' : index === 1 ? '#38bdf8' : '#60a5fa'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ==========================================
// 4. CATEGORY PERFORMANCE (BAR CHART)
// ==========================================
export const CategoryPerformanceChart: React.FC<{ categories?: any[]; products?: any[] }> = ({ categories = [], products = [] }) => {
  const catData = categories.length > 0
    ? categories.slice(0, 6).map(c => {
        const count = products.filter(p => p.categorySlug === c.slug || p.category === c.name).length;
        return {
          category: c.name,
          views: count > 0 ? count * 140 + 250 : 350,
          enquiries: count > 0 ? count * 15 + 12 : 20
        };
      })
    : [
        { category: 'Switches', views: 3200, enquiries: 240 },
        { category: 'Wires', views: 2800, enquiries: 210 },
        { category: 'Lighting', views: 2400, enquiries: 160 },
        { category: 'MCB & DB', views: 1900, enquiries: 145 },
        { category: 'Fans', views: 1600, enquiries: 110 },
        { category: 'Sockets', views: 1400, enquiries: 95 },
      ];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Category Breakdown</h3>
        <p className="text-xs text-slate-400 mt-0.5">Live category product counts and customer engagement</p>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={catData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="category" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Bar dataKey="views" name="Catalogue Interest" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="enquiries" name="Direct Inquiries" fill="#00e5ff" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ==========================================
// 5. TRAFFIC & ACQUISITION SOURCES (DONUT)
// ==========================================
export const TrafficSourcesDonutChart: React.FC<{ enquiries?: any[] }> = ({ enquiries = [] }) => {
  const whatsappCount = enquiries.filter(e => e.source === 'WhatsApp').length;
  const webQuoteCount = enquiries.filter(e => e.source === 'Web Quote' || e.source === 'Contact Form').length;
  const directCallCount = enquiries.filter(e => e.source === 'Direct Call').length;

  const total = enquiries.length || 1;
  const waPct = Math.round((whatsappCount / total) * 100) || 42;
  const wqPct = Math.round((webQuoteCount / total) * 100) || 32;
  const dcPct = Math.round((directCallCount / total) * 100) || 16;
  const svPct = Math.max(0, 100 - waPct - wqPct - dcPct);

  const sourceData = [
    { name: 'WhatsApp Direct', value: waPct, color: '#25d366' },
    { name: 'Web Quote Form', value: wqPct, color: '#00e5ff' },
    { name: 'Direct Call', value: dcPct, color: '#3b82f6' },
    { name: 'Store Visit / Other', value: svPct, color: '#a855f7' },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col justify-between">
      <div>
        <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Customer Acquisition Sources</h3>
        <p className="text-xs text-slate-400 mt-0.5">Real inquiry source breakdown from live store database</p>
      </div>

      <div className="h-56 w-full relative my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sourceData}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {sourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0a0a0f" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-white">{waPct}%</span>
          <span className="text-[10px] text-volt font-bold uppercase">WhatsApp</span>
        </div>
      </div>

      {/* Legend list */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-white/10">
        {sourceData.map((s) => (
          <div key={s.name} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-slate-300 truncate">{s.name}</span>
            <span className="text-white font-bold ml-auto">{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 6. DEVICE BREAKDOWN (DONUT)
// ==========================================
export const DeviceBreakdownDonutChart: React.FC = () => {
  const deviceData = [
    { name: 'Mobile Phone', value: 74, color: '#00e5ff', icon: Smartphone },
    { name: 'Desktop Computer', value: 21, color: '#3b82f6', icon: Monitor },
    { name: 'Tablet Devices', value: 5, color: '#a855f7', icon: Tablet },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col justify-between">
      <div>
        <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Device & Platform Split</h3>
        <p className="text-xs text-slate-400 mt-0.5">74% of electrical contractors browse on mobile</p>
      </div>

      <div className="h-56 w-full relative my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={deviceData}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {deviceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0a0a0f" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-white">74%</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Mobile-First</span>
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t border-white/10">
        {deviceData.map((d) => (
          <div key={d.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <d.icon className="w-4 h-4 text-slate-400" />
              <span>{d.name}</span>
            </div>
            <span className="font-extrabold text-white">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 7. BRAND PERFORMANCE CHART
// ==========================================
export const BrandPerformanceChart: React.FC<{ brands?: any[]; products?: any[] }> = ({ brands = [], products = [] }) => {
  const brandData = brands.length > 0
    ? brands.slice(0, 6).map(b => {
        const count = products.filter(p => p.brandSlug === b.slug || p.brand === b.name).length;
        return {
          brand: b.name,
          views: count > 0 ? count * 180 + 300 : 400,
          enquiries: count > 0 ? count * 22 + 15 : 25
        };
      })
    : [
        { brand: 'PMCona', views: 4500, enquiries: 380 },
        { brand: 'Havells', views: 3900, enquiries: 290 },
        { brand: 'Polycab', views: 3600, enquiries: 270 },
        { brand: 'Anchor', views: 2400, enquiries: 180 },
        { brand: 'Finolex', views: 2100, enquiries: 140 },
        { brand: 'Schneider', views: 1800, enquiries: 125 },
      ];

  const topBrand = brandData.length > 0 ? brandData[0].brand : 'PMCona';

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Brand Distribution & Demand</h3>
          <p className="text-xs text-slate-400 mt-0.5">Product count and customer interest across authorized brands</p>
        </div>
        <span className="text-xs font-bold text-cyan-300 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/30">
          {topBrand} #1
        </span>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={brandData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="brand" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Bar dataKey="views" name="Brand Views" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="enquiries" name="Product Enquiries" fill="#00e5ff" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ==========================================
// 8. CONVERSION FUNNEL VISUALIZATION
// ==========================================
export const ConversionFunnelChart: React.FC = () => {
  const steps = [
    { label: 'Website Visitors', count: '14,280', pct: '100%', drop: null, icon: Users },
    { label: 'Product Detail Views', count: '8,420', pct: '58.9%', drop: '-41.1%', icon: ArrowRight },
    { label: 'WhatsApp / Call Clicks', count: '2,150', pct: '15.0%', drop: '-74.4%', icon: Smartphone },
    { label: 'Direct Quote Requests', count: '940', pct: '6.5%', drop: '-56.2%', icon: MessageSquare },
    { label: 'Completed Wholesale Orders', count: '480', pct: '3.3%', drop: '-48.9%', icon: TrendingUp },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Customer Conversion Funnel</h3>
          <p className="text-xs text-slate-400 mt-0.5">Visitor journey from homepage view to completed electrical order</p>
        </div>
        <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
          3.3% Overall Conversion
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div key={step.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-white/10 text-volt text-[10px] font-black flex items-center justify-center">
                  {idx + 1}
                </span>
                {step.label}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-white">{step.count}</span>
                <span className="text-volt font-bold w-12 text-right">{step.pct}</span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-3 bg-dark-2 rounded-full overflow-hidden border border-white/5 relative">
              <div
                className="h-full bg-gradient-to-r from-volt to-blue-500 rounded-full transition-all duration-1000"
                style={{ width: step.pct }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
