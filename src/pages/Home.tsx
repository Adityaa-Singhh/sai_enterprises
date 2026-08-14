import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Section, 
  SectionHeader, 
  StarRating, 
  ProductImage, 
  Badge, 
  Counter, 
  useScrollReveal 
} from '../components/ui';
import { ElectricCanvas } from '../components/ElectricCanvas';
import { SpotlightCard } from '../components/SpotlightCard';
import { 
  products, 
  categories, 
  brands, 
  testimonials, 
  businessInfo, 
  whyChooseUs, 
  galleryImages,
  getWhatsAppUrl, 
  getPhoneUrl,
  getProductEnquiryUrl
} from '../data';

interface HomeProps {
  onQuote: () => void;
}

// Map string icon names to actual Lucide components dynamically
const IconComponent = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (Icons as any)[name] || Icons.HelpCircle;
  return <Icon className={className} />;
};

export default function Home({ onQuote }: HomeProps) {
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4); // Show top 4
  const featuredTestimonials = testimonials.slice(0, 3);
  const featuredGallery = galleryImages.slice(0, 4); // Or 6

  const heroReveal = useScrollReveal<HTMLDivElement>();

  // SaaS Interactive Telemetry / Load Calculator State
  const [loadKw, setLoadKw] = useState<number>(6);
  const [phase, setPhase] = useState<'single' | 'three'>('single');
  const [activeCategoryTab, setActiveCategoryTab] = useState<'switches' | 'wires' | 'mcb' | 'lighting'>('switches');

  // Dynamic calculations
  const voltage = phase === 'single' ? 230 : 415;
  const currentAmps = phase === 'single' 
    ? ((loadKw * 1000) / voltage).toFixed(1) 
    : ((loadKw * 1000) / (Math.sqrt(3) * voltage * 0.85)).toFixed(1);
  
  const recommendedMcb = Number(currentAmps) <= 10 ? '10A C-Curve'
    : Number(currentAmps) <= 16 ? '16A C-Curve'
    : Number(currentAmps) <= 25 ? '25A C-Curve'
    : Number(currentAmps) <= 32 ? '32A C-Curve'
    : Number(currentAmps) <= 63 ? '63A D-Curve'
    : '100A MCCB Industrial';

  const recommendedCable = Number(currentAmps) <= 12 ? '1.5 sq mm Cu FR'
    : Number(currentAmps) <= 18 ? '2.5 sq mm Cu FR'
    : Number(currentAmps) <= 26 ? '4.0 sq mm Cu FR-LSH'
    : Number(currentAmps) <= 35 ? '6.0 sq mm Cu FR-LSH'
    : '10.0+ sq mm Armoured Cu';

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION WITH INTERACTIVE ELECTRIC CANVAS */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-20 pb-20">
        {/* Interactive Electrical Background Canvas */}
        <ElectricCanvas className="opacity-70 dark:opacity-80" particleCount={50} connectionDistance={135} interactive={true} />
        
        <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none"></div>
        
        {/* Ambient Gradient Orbs */}
        <div className="orb orb-volt top-1/4 left-1/4 w-96 h-96 opacity-40 blur-3xl mix-blend-screen pointer-events-none"></div>
        <div className="orb orb-blue bottom-1/4 right-1/4 w-96 h-96 opacity-40 blur-3xl mix-blend-screen pointer-events-none"></div>
        
        <div className="container px-4 sm:px-6 relative z-10 mx-auto max-w-7xl">
          <motion.div 
            ref={heroReveal} 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-8"
          >
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
              The Modern Platform for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-volt via-cyan-400 to-blue-500 drop-shadow-[0_0_25px_rgba(0,229,255,0.3)]">
                Electrical Infrastructure
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed font-normal">
              Direct brand-authorized distribution platform for switches, cables, switchgear, and commercial lighting with {businessInfo.experience}+ years of enterprise reliability.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center pt-2">
              <Link to="/products" className="btn-primary py-4 px-8 text-base font-bold rounded-full flex items-center justify-center gap-2 group shadow-[0_4px_25px_rgba(0,229,255,0.35)] hover:scale-105 transition-all w-full sm:w-auto">
                <Icons.Layers className="w-5 h-5" />
                Browse Catalog
                <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button onClick={onQuote} className="btn-secondary py-4 px-8 text-base font-semibold rounded-full flex items-center justify-center gap-2 group hover:scale-105 transition-all w-full sm:w-auto">
                <Icons.Zap className="w-5 h-5 text-volt" />
                Instant Quotation
              </button>
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp py-4 px-8 text-base font-semibold rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg w-full sm:w-auto">
                <Icons.MessageCircle className="w-5 h-5" />
                Direct WhatsApp Dispatch
              </a>
            </div>

            {/* SaaS Interactive Telemetry & Configurator Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="saas-glow-card w-full max-w-4xl p-6 sm:p-8 mt-10 text-left"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-white/10 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-volt/15 border border-volt/30 flex items-center justify-center text-volt">
                    <Icons.Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white flex flex-wrap items-center gap-2">
                      Live Electrical Load & Spec Engine
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                        ⚡ Real-time
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 font-normal">
                      Calculate breaker sizing, cable requirements, and check instant warehouse inventory
                    </p>
                  </div>
                </div>

                {/* Phase Toggle */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 self-stretch md:self-auto justify-center">
                  <button
                    onClick={() => setPhase('single')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      phase === 'single' 
                        ? 'bg-volt text-dark-0 shadow-md' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    230V 1-Phase
                  </button>
                  <button
                    onClick={() => setPhase('three')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      phase === 'three' 
                        ? 'bg-volt text-dark-0 shadow-md' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    415V 3-Phase
                  </button>
                </div>
              </div>

              {/* Slider & Telemetry Output */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
                {/* Left: Load Control */}
                <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Connected Total Load
                    </label>
                    <span className="text-lg font-extrabold text-volt">
                      {loadKw} kW <span className="text-xs text-slate-400 font-normal">({(loadKw * 1.341).toFixed(1)} HP)</span>
                    </span>
                  </div>
                  
                  <input
                    type="range"
                    min="1"
                    max="25"
                    step="1"
                    value={loadKw}
                    onChange={(e) => setLoadKw(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>1 kW (Residential)</span>
                    <span>12 kW (Commercial)</span>
                    <span>25 kW (Industrial)</span>
                  </div>

                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[
                      { id: 'switches', label: 'Switches', icon: 'ToggleLeft' },
                      { id: 'wires', label: 'Cables & Wires', icon: 'Activity' },
                      { id: 'mcb', label: 'MCB Protection', icon: 'ShieldCheck' },
                      { id: 'lighting', label: 'LED Lighting', icon: 'Sun' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategoryTab(cat.id as any)}
                        className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
                          activeCategoryTab === cat.id
                            ? 'bg-white/15 border-volt/40 text-volt font-bold'
                            : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        <IconComponent name={cat.icon} className="w-3.5 h-3.5" />
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Real-time Computed Specs */}
                <div className="lg:col-span-6 grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-3 rounded-xl bg-dark-0/60 border border-white/5 flex flex-col justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">Estimated Amperage</span>
                    <div className="mt-1">
                      <span className="text-xl font-extrabold text-white">{currentAmps}</span>
                      <span className="text-xs text-volt font-bold ml-1">Amps</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                      <Icons.CheckCircle2 className="w-3 h-3" /> Nominal Continuous
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-dark-0/60 border border-white/5 flex flex-col justify-between min-w-0">
                    <span className="text-[11px] text-slate-400 font-medium">Recommended MCB</span>
                    <div className="mt-1 min-w-0">
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-volt block whitespace-normal break-words">{recommendedMcb}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">10kA Breaking Cap.</span>
                  </div>

                  <div className="p-3 rounded-xl bg-dark-0/60 border border-white/5 flex flex-col justify-between min-w-0">
                    <span className="text-[11px] text-slate-400 font-medium">Recommended Cable</span>
                    <div className="mt-1 min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-white block whitespace-normal break-words">{recommendedCable}</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 mt-1">IS 694 Certified</span>
                  </div>

                  <div className="p-3 rounded-xl bg-dark-0/60 border border-white/5 flex flex-col justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">Warehouse Availability</span>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs sm:text-sm font-bold text-emerald-400">Ready Stock</span>
                    </div>
                    <button
                      onClick={onQuote}
                      className="mt-1 text-[11px] font-bold text-volt hover:underline text-left flex items-center gap-1"
                    >
                      Request Bulk Quote <Icons.ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* SaaS Trust & Metric Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-10 w-full border-t border-white/10 mt-12">
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-volt/30 transition-all group">
                <span className="text-3xl md:text-4xl font-extrabold text-volt mb-1 group-hover:scale-105 transition-transform"><Counter end={businessInfo.experience} suffix="+" /></span>
                <span className="text-xs text-slate-300 uppercase tracking-widest font-semibold">Years Enterprise Trust</span>
                <span className="text-[10px] text-emerald-400 mt-1 font-medium">▲ ISO 9001:2015 Partner</span>
              </div>
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-volt/30 transition-all group">
                <span className="text-3xl md:text-4xl font-extrabold text-volt mb-1 group-hover:scale-105 transition-transform"><Counter end={businessInfo.productsCount} suffix="+" /></span>
                <span className="text-xs text-slate-300 uppercase tracking-widest font-semibold">SKUs in Catalog</span>
                <span className="text-[10px] text-cyan-400 mt-1 font-medium">⚡ 100% Genuine Brands</span>
              </div>
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-volt/30 transition-all group">
                <span className="text-3xl md:text-4xl font-extrabold text-volt mb-1 group-hover:scale-105 transition-transform"><Counter end={businessInfo.brandsCount} suffix="+" /></span>
                <span className="text-xs text-slate-300 uppercase tracking-widest font-semibold">Authorized Brands</span>
                <span className="text-[10px] text-emerald-400 mt-1 font-medium">▲ Direct OEM Sourcing</span>
              </div>
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-volt/30 transition-all group">
                <span className="text-3xl md:text-4xl font-extrabold text-volt mb-1 group-hover:scale-105 transition-transform"><Counter end={businessInfo.customersServed} suffix="+" /></span>
                <span className="text-xs text-slate-300 uppercase tracking-widest font-semibold">B2B Clients Served</span>
                <span className="text-[10px] text-volt mt-1 font-medium">★ 4.9/5 Client Rating</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. PRODUCT CATEGORIES */}
      <Section id="categories" className="bg-dark-1">
        <SectionHeader 
          label="Categories" 
          title="Extensive Product Range" 
          subtitle="Discover our comprehensive selection of high-quality electrical supplies for every need."
        />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/products?category=${category.slug}`}
              className="block h-full group"
            >
              <SpotlightCard className="p-6 h-full flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-dark-2 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 group-hover:border-volt/40 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_25px_rgba(0,229,255,0.3)]">
                  <IconComponent name={category.icon} className="w-8 h-8 text-volt" />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">{category.name}</h3>
                <p className="text-xs text-slate-300 mb-4 line-clamp-2 font-normal leading-relaxed">{category.description}</p>
                
                <div className="mt-auto flex items-center gap-2 text-sm text-cyan-400 font-semibold group-hover:text-volt transition-colors">
                  <span>Browse {category.productCount}</span>
                  <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </SpotlightCard>
            </Link>
          ))}
        </div>
      </Section>

      {/* 3. FEATURED PRODUCTS */}
      <Section id="featured-products">
        <SectionHeader 
          label="Featured" 
          title="Top Selling Products" 
          subtitle="Our most requested and highly rated electrical components and equipment."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {featuredProducts.map((product) => (
            <SpotlightCard key={product.id} className="flex flex-col h-full overflow-hidden group">
              <Link to={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-dark-2">
                <ProductImage 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {product.isNew && <Badge variant="volt">NEW</Badge>}
                  {!product.inStock && <Badge variant="amber">OUT OF STOCK</Badge>}
                </div>
              </Link>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-xs text-volt font-bold tracking-wider mb-2 uppercase">{product.brand}</div>
                <Link to={`/products/${product.slug}`} className="hover:text-volt transition-colors">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{product.name}</h3>
                </Link>
                <p className="text-sm text-slate-300 mb-6 line-clamp-2 font-normal leading-relaxed">{product.shortDescription}</p>
                
                <div className="mt-auto flex flex-col gap-3">
                  <Link to={`/products/${product.slug}`} className="btn-secondary w-full py-2.5 rounded-full text-sm font-semibold flex justify-center items-center gap-2">
                    <Icons.Eye className="w-4 h-4 text-volt" /> View Details
                  </Link>
                  <a 
                    href={getProductEnquiryUrl(product.name)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full py-2.5 rounded-full text-sm font-semibold flex justify-center items-center gap-2"
                  >
                    <Icons.MessageCircle className="w-4 h-4" /> Enquire Now
                  </a>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <Link to="/products" className="btn-secondary py-3.5 px-8 rounded-full flex items-center gap-2 group font-semibold text-white hover:border-volt/50">
            View All Products
            <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-volt" />
          </Link>
        </div>
      </Section>

      {/* 4. HIGH-PERFORMANCE DUAL-TRACK ANIMATED BRANDS & PARTNERS MARQUEE */}
      <section className="py-16 bg-gradient-to-b from-dark-1 via-dark-0 to-dark-1 border-y border-white/10 overflow-hidden relative">
        <div className="container mx-auto px-4 mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-volt/10 border border-volt/30 text-volt text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            <Icons.Zap className="w-4 h-4 text-volt animate-pulse" />
            <span>Authorized Dealer & Trusted Industry Brand Partners</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
            Powering Projects with <span className="text-volt">Certified Quality</span>
          </h2>
        </div>

        {/* Dual Marquee Track Container */}
        <div className="relative space-y-4">
          {/* Gradient Blur Mask Edges for Smooth Fade */}
          <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-16 sm:w-32 bg-gradient-to-r from-dark-1 via-dark-1/80 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-16 sm:w-32 bg-gradient-to-l from-dark-1 via-dark-1/80 to-transparent" />

          {/* Row 1: Moving Left - Premier Brands */}
          <div className="relative flex overflow-x-hidden group">
            <div className="animate-marquee-left group-hover:[animation-play-state:paused] py-1">
              {[...brands, ...brands].map((brand, idx) => (
                <Link 
                  key={`brand-r1-${brand.id}-${idx}`} 
                  to={`/brands/${brand.slug}`} 
                  className={`mx-2 sm:mx-3 flex items-center gap-3 rounded-2xl border px-5 py-3 sm:px-7 sm:py-4 transition-all duration-300 min-w-[150px] sm:min-w-[190px] shadow-lg group/card ${
                    brand.slug === 'pmcona' 
                      ? 'border-volt/60 bg-volt/10 hover:bg-volt/20 hover:border-volt shadow-[0_0_20px_rgba(0,229,255,0.15)]' 
                      : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-dark-2 flex items-center justify-center text-volt border border-white/10 shrink-0 font-black text-sm">
                    {brand.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-extrabold text-white group-hover/card:text-volt transition-colors whitespace-nowrap">
                      {brand.name}
                    </div>
                    {brand.isAuthorized ? (
                      <span className="text-[10px] sm:text-[11px] text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Icons.ShieldCheck className="w-3 h-3 text-volt" /> Authorized
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">Genuine Supplier</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Row 2: Moving Right - Product Solutions */}
          <div className="relative flex overflow-x-hidden group">
            <div className="animate-marquee-right group-hover:[animation-play-state:paused] py-1">
              {[
                { name: 'PMCona Modular Switches', icon: Icons.ToggleLeft, tag: 'Official Distributor' },
                { name: 'Industrial MCBs & RCCB DBs', icon: Icons.Cpu, tag: 'Safety Guaranteed' },
                { name: 'Flame-Retardant House Wires', icon: Icons.Zap, tag: 'ISI Certified' },
                { name: 'Heavy Armoured Cables', icon: Icons.Layers, tag: 'Submersible & Underground' },
                { name: 'Architectural LED Panel Lights', icon: Icons.Sun, tag: '50,000 Hours Lifespan' },
                { name: 'BLDC High-Speed Energy Fans', icon: Icons.Wind, tag: '5 Star Rated' },
                { name: 'Modular Gang Boxes & Sockets', icon: Icons.Box, tag: 'Shock Proof' },
              ].map((item, idx) => (
                <div 
                  key={`solution-r2-${idx}`} 
                  className="mx-2 sm:mx-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 hover:border-volt/40 hover:bg-white/10 px-5 py-3 sm:px-6 sm:py-3.5 transition-all duration-300 min-w-[200px] sm:min-w-[240px] shadow-lg group/sol"
                >
                  <div className="w-8 h-8 rounded-xl bg-dark-2 flex items-center justify-center text-volt border border-white/10 shrink-0">
                    <item.icon className="w-4 h-4 text-volt" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white group-hover/sol:text-volt transition-colors whitespace-nowrap">
                      {item.name}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                      {item.tag}
                    </span>
                  </div>
                </div>
              ))}
              {/* Duplicate set for loop */}
              {[
                { name: 'PMCona Modular Switches', icon: Icons.ToggleLeft, tag: 'Official Distributor' },
                { name: 'Industrial MCBs & RCCB DBs', icon: Icons.Cpu, tag: 'Safety Guaranteed' },
                { name: 'Flame-Retardant House Wires', icon: Icons.Zap, tag: 'ISI Certified' },
                { name: 'Heavy Armoured Cables', icon: Icons.Layers, tag: 'Submersible & Underground' },
                { name: 'Architectural LED Panel Lights', icon: Icons.Sun, tag: '50,000 Hours Lifespan' },
                { name: 'BLDC High-Speed Energy Fans', icon: Icons.Wind, tag: '5 Star Rated' },
                { name: 'Modular Gang Boxes & Sockets', icon: Icons.Box, tag: 'Shock Proof' },
              ].map((item, idx) => (
                <div 
                  key={`solution-r2-dup-${idx}`} 
                  className="mx-2 sm:mx-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 hover:border-volt/40 hover:bg-white/10 px-5 py-3 sm:px-6 sm:py-3.5 transition-all duration-300 min-w-[200px] sm:min-w-[240px] shadow-lg group/sol"
                >
                  <div className="w-8 h-8 rounded-xl bg-dark-2 flex items-center justify-center text-volt border border-white/10 shrink-0">
                    <item.icon className="w-4 h-4 text-volt" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white group-hover/sol:text-volt transition-colors whitespace-nowrap">
                      {item.name}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                      {item.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <Section id="why-choose-us" className="relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-volt/5 to-transparent pointer-events-none"></div>
        
        <SectionHeader 
          label="Why Choose Us" 
          title="The Sai Enterprises Advantage" 
          subtitle="What sets us apart as your preferred electrical products supplier."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {whyChooseUs.map((feature, idx) => (
            <SpotlightCard key={idx} className="p-8 group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-dark-2 border border-white/10 flex items-center justify-center mb-6 text-volt group-hover:scale-110 group-hover:bg-volt/10 transition-all duration-300 shadow-md">
                <IconComponent name={feature.icon} className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-300 leading-relaxed font-normal">{feature.description}</p>
            </SpotlightCard>
          ))}
        </div>
      </Section>

      {/* 6. ABOUT PREVIEW */}
      <Section id="about" className="bg-dark-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 flex flex-col gap-6">
            <Badge variant="volt" className="self-start">About Us</Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Powering your projects with <span className="text-transparent bg-clip-text bg-gradient-to-r from-volt to-cyan-400">quality and trust.</span>
            </h2>
            <p className="text-lg text-slate-200 leading-relaxed font-normal">
              {businessInfo.description}
            </p>
            <p className="text-slate-300 leading-relaxed font-normal">
              Founded over {businessInfo.experience} years ago, {businessInfo.name} has grown from a small local shop to one of the region's most trusted distributors of electrical components. We pride ourselves on technical expertise, genuine products, and unmatched customer service.
            </p>
            
            <div className="mt-4 flex gap-4">
              <Link to="/about" className="btn-primary py-3.5 px-8 rounded-full flex items-center justify-center gap-2 font-bold shadow-xl">
                Learn More About Us
              </Link>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative flex flex-col items-center w-full">
            <div className="absolute inset-0 bg-gradient-to-tr from-volt/20 to-blue-500/20 blur-3xl rounded-full"></div>
            <div className="glass-card p-2 relative z-10 w-full aspect-video lg:aspect-square overflow-hidden rounded-3xl border border-white/10">
              <div className="w-full h-full bg-dark-2 flex flex-col items-center justify-center text-slate-300 rounded-2xl border border-white/5 py-8">
                <Icons.Building2 className="w-16 h-16 sm:w-24 sm:h-24 mb-4 text-volt opacity-70" />
                <span className="text-lg sm:text-xl font-bold tracking-widest uppercase text-white">{businessInfo.name}</span>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:-left-6 glass-card p-4 sm:p-6 z-20 flex items-center gap-3 sm:gap-4 animate-bounce-slow rounded-3xl border border-white/15 shadow-2xl w-full sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-volt/20 flex items-center justify-center text-volt shrink-0">
                <Icons.Award className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-white leading-tight">Authorized</div>
                <div className="text-xs sm:text-sm text-slate-300 font-medium">Distributor</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 7. TESTIMONIALS PREVIEW */}
      <Section id="testimonials">
        <SectionHeader 
          label="Testimonials" 
          title="What Our Clients Say" 
          subtitle="Don't just take our word for it — hear from the contractors and businesses we serve."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {featuredTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="glass-card p-8 rounded-3xl flex flex-col relative border border-white/10 hover:border-volt/40 transition-all">
              <Icons.Quote className="absolute top-6 right-6 w-10 h-10 text-white/10" />
              <StarRating rating={testimonial.rating} className="mb-6" />
              <p className="text-slate-200 italic leading-relaxed mb-8 flex-grow font-normal">
                "{testimonial.review}"
              </p>
              <div className="mt-auto">
                <div className="font-bold text-white text-lg">{testimonial.name}</div>
                <div className="text-sm text-volt font-semibold">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <Link to="/testimonials" className="btn-secondary py-3.5 px-8 rounded-full flex items-center gap-2 group font-semibold text-white">
            Read All Reviews
            <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-volt" />
          </Link>
        </div>
      </Section>

      {/* 8. GALLERY PREVIEW */}
      <Section id="gallery" className="bg-dark-1">
        <SectionHeader 
          label="Gallery" 
          title="Our Store & Products" 
          subtitle="Take a glimpse inside our expansive inventory and facility."
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {featuredGallery.map((img) => (
            <div key={img.id} className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 group cursor-pointer">
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-semibold px-4 py-2 bg-black/60 rounded-full backdrop-blur-md border border-white/20 text-sm">
                  {img.category}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <Link to="/gallery" className="btn-secondary py-3.5 px-8 rounded-full flex items-center gap-2 group font-semibold text-white">
            View Full Gallery
            <Icons.ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-volt" />
          </Link>
        </div>
      </Section>

      {/* 9. LOCATION & CONTACT */}
      <Section id="location">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 glass-card overflow-hidden rounded-3xl p-0 border border-white/10">
          <div className="h-96 lg:h-auto min-h-[400px] w-full">
            <iframe 
              src={businessInfo.mapUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Sai Enterprises Location"
              className="filter invert-[90%] hue-rotate-180 contrast-125 grayscale-[30%] opacity-80"
            ></iframe>
          </div>
          
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <Badge variant="volt" className="self-start mb-6">Visit Us</Badge>
            <h3 className="text-3xl font-bold text-white mb-8">Located in the heart of the electrical market.</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-dark-2 flex items-center justify-center flex-shrink-0 text-volt mt-1 border border-white/10">
                  <Icons.MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white mb-1">Address</div>
                  <div className="text-slate-300 font-normal whitespace-pre-line">{businessInfo.address.full}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-dark-2 flex items-center justify-center flex-shrink-0 text-volt mt-1 border border-white/10">
                  <Icons.Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white mb-1">Business Hours</div>
                  <div className="text-slate-300 font-normal whitespace-pre-line">Mon-Sat: {businessInfo.hours.weekdays}<br/>Sun: {businessInfo.hours.sunday}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-dark-2 flex items-center justify-center flex-shrink-0 text-volt mt-1 border border-white/10">
                  <Icons.Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white mb-1">Contact</div>
                  <div className="text-slate-300 font-normal">{businessInfo.phone}</div>
                  <div className="text-slate-300 font-normal">{businessInfo.email}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <a href={businessInfo.mapDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary py-3 px-6 rounded-full flex items-center justify-center gap-2 font-bold shadow-xl">
                <Icons.Navigation className="w-5 h-5" /> Get Directions
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* 10. FINAL CTA */}
      <section className="relative py-24 overflow-hidden border-t border-white/10 mt-12">
        <div className="absolute inset-0 bg-dark-0"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE1KSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        {/* Colorful background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-volt/20 via-cyan-500/20 to-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="container px-4 mx-auto relative z-10 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Ready to power your <span className="text-transparent bg-clip-text bg-gradient-to-r from-volt to-cyan-400">next project?</span>
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-normal">
            Get competitive pricing on genuine electrical products. Contact us today for quick quotes and reliable supply.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp py-4 px-8 rounded-full text-lg font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-xl">
              <Icons.MessageCircle className="w-6 h-6" /> WhatsApp Us
            </a>
            <button onClick={onQuote} className="btn-primary py-4 px-8 rounded-full text-lg font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-[0_0_25px_rgba(0,229,255,0.4)]">
              <Icons.FileText className="w-6 h-6" /> Request a Quote
            </button>
            <a href={getPhoneUrl()} className="btn-secondary py-4 px-8 rounded-full text-lg font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105">
              <Icons.PhoneCall className="w-6 h-6 text-volt" /> Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
