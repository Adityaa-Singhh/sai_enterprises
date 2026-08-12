import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, MessageCircle, Phone, Search, Award } from 'lucide-react';
import { Section, Badge, useScrollReveal } from '../components/ui';
import { brands, businessInfo, getWhatsAppUrl, getPhoneUrl, categories } from '../data';

export default function Brands() {
  const revealRef = useScrollReveal<HTMLDivElement>();
  
  const authorizedBrandsCount = useMemo(() => 
    brands.filter(b => b.isAuthorized).length
  , []);

  // Map category IDs to names for the tags
  const getCategoryName = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : catId;
  };

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero Section */}
      <Section className="relative overflow-hidden pt-12 pb-20">
        <div className="absolute inset-0 grid-bg opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] orb orb-volt"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Badge variant="volt" className="mb-6 mx-auto">
            <Award className="w-4 h-4 mr-2" />
            Premium Partnerships
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
            Our Brand <span className="text-transparent bg-clip-text bg-gradient-to-r from-volt to-cyan-400">Partners</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-normal">
            We partner with the industry's leading manufacturers to bring you top-quality, reliable electrical products. 
          </p>
          
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 liquid-glass shadow-xl">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-left">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Trust Indicator</div>
              <div className="font-bold text-white text-sm sm:text-base">Authorized dealer for {authorizedBrandsCount} brands</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Brands List */}
      <Section id="brands-list" className="pb-24">
        <div className="container mx-auto px-6">
          <div 
            ref={revealRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {brands.map((brand, index) => (
              <div 
                key={brand.id}
                className={`glass-card relative overflow-hidden group flex flex-col rounded-3xl border border-white/10 hover:border-volt/40 transition-all duration-300 ${
                  brand.isAuthorized 
                    ? 'p-8 md:p-10 border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]' 
                    : 'p-6 md:p-8'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Subtle gradient background for authorized brands */}
                {brand.isAuthorized && (
                  <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20 transition-opacity duration-500 group-hover:bg-green-500/10" />
                )}

                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-5 md:gap-6">
                    {/* Placeholder Logo */}
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl md:text-3xl font-extrabold text-white group-hover:text-volt transition-colors shrink-0 shadow-lg">
                      {brand.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-volt transition-colors">
                        {brand.name}
                      </h2>
                      <div className="text-volt font-semibold text-xs md:text-sm">
                        {brand.tagline}
                      </div>
                    </div>
                  </div>
                  
                  {brand.isAuthorized && (
                    <Badge variant="green" className="shrink-0 flex items-center gap-1.5 shadow-lg ml-4">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="hidden sm:inline">Authorized Dealer</span>
                      <span className="sm:hidden">Authorized</span>
                    </Badge>
                  )}
                </div>

                <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 flex-grow relative z-10 font-normal">
                  {brand.description}
                </p>

                <div className="mt-auto relative z-10">
                  <div className="mb-6">
                    <div className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Product Categories</div>
                    <div className="flex flex-wrap gap-2">
                      {brand.categories.map(catId => (
                        <span 
                          key={catId} 
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white/10 text-white border border-white/10"
                        >
                          {getCategoryName(catId)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link 
                    to={`/products?brand=${brand.slug}`}
                    className="inline-flex items-center gap-2 text-white hover:text-volt transition-colors font-bold group/link text-sm md:text-base"
                  >
                    View Products
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform text-volt" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="glass-card p-10 md:p-16 text-center relative overflow-hidden rounded-3xl border border-white/15">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl bg-gradient-to-br from-volt/10 to-blue-500/10 blur-3xl rounded-full"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Search className="w-8 h-8 text-volt" />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Looking for a specific brand?
              </h2>
              <p className="text-lg text-slate-300 mb-10 font-normal">
                We can source products from many other manufacturers. Reach out to our team with your requirements and we'll help you find exactly what you need.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href={getWhatsAppUrl("Hi, I'm looking for a specific electrical brand. Can you help?")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full sm:w-auto py-3.5 px-8 rounded-full font-bold shadow-xl"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Us
                </a>
                <a 
                  href={getPhoneUrl()}
                  className="btn-secondary w-full sm:w-auto py-3.5 px-8 rounded-full font-bold text-white border border-white/10"
                >
                  <Phone className="w-5 h-5 mr-2 text-volt" />
                  {businessInfo.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
