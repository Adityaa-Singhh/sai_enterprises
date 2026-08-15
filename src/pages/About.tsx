import {
  ShieldCheck,
  Sparkles,
  Heart,
  IndianRupee,
  MapPin,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Clock,
  Phone,
  MessageCircle,
  Check,
  HelpCircle,
  ToggleRight,
  Plug,
  Cable,
  Unplug,
  Lightbulb,
  Fan,
  Wrench,
  Factory
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Section, SectionHeader, Counter, useScrollReveal } from '../components/ui';
import { getWhatsAppUrl, getPhoneUrl, categories } from '../data';
import { usePublicStore } from '../data/publicStore';

const CAT_ICONS: Record<string, any> = {
  ToggleRight,
  Plug,
  Cable,
  Unplug,
  Lightbulb,
  ShieldCheck,
  Fan,
  Wrench,
  Factory
};

export default function About() {
  const { businessInfo } = usePublicStore();
  const revealRef = useScrollReveal<HTMLDivElement>();
  
  const values = [
    {
      icon: ShieldCheck,
      title: 'Trust & Integrity',
      description: 'We believe in doing the right thing, always. We only source genuine products from authorized brands to ensure absolute safety and reliability for your electrical needs.'
    },
    {
      icon: Sparkles,
      title: 'Product Expertise',
      description: 'Our team possesses deep technical knowledge of the electrical products we sell. We do not just move boxes; we offer tailored advice to help you make informed decisions.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We treat every customer like family. From large-scale contractors to individual homeowners, everyone receives the same dedicated attention, respect, and support.'
    },
    {
      icon: IndianRupee,
      title: 'Fair Pricing',
      description: 'We strive to offer competitive and transparent pricing without compromising on quality. We believe that premium electrical supplies should be accessible and affordable.'
    },
    {
      icon: MapPin,
      title: 'Local Commitment',
      description: 'We are deeply rooted in our community. We pride ourselves on understanding the specific needs of our local area and building long-lasting relationships with our neighbors.'
    },
    {
      icon: TrendingUp,
      title: 'Continuous Growth',
      description: 'The electrical industry is always evolving, and so are we. We continuously expand our catalog to include the latest technologies and innovations to serve you better.'
    }
  ];

  return (
    <div className="pt-24 lg:pt-32 pb-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-dark-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555627255-08e8b28f8045?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-[0.15]" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-0 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-0 via-dark-0/80 to-transparent" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-volt/15 border border-volt/30 text-volt text-sm font-semibold mb-6 shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>Our Story</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              About <span className="text-volt">{businessInfo.name}</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
              {businessInfo.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <Section id="story" className="relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-volt/5 rounded-full blur-[100px] -z-10" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div ref={revealRef} className="space-y-8 reveal">
            <SectionHeader 
              label="Our Journey"
              title="Built on Trust and Quality"
              className="text-left mb-0"
            />
            
            <div className="space-y-6 text-slate-300 text-lg leading-relaxed font-normal">
              <p>
                {businessInfo.name} was founded with a simple belief — that every home, every project, and every electrician deserves access to genuine, high-quality electrical products at fair prices. What started as a small neighborhood electrical shop has grown into a trusted supplier serving thousands of customers across the region.
              </p>
              <p>
                With over {businessInfo.experience} years of hands-on experience in the electrical industry, our team has built {businessInfo.name} on the values of trust, quality, and personal attention. We know our customers by name, understand their requirements, and go the extra mile to ensure they get exactly what they need.
              </p>
              <p>
                We're not just another electrical supplier. We are your partners in powering your projects safely and efficiently. Whether you're wiring a new home, upgrading an industrial facility, or just changing a switch, we're here to help.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden glass-card p-2 border border-white/15 relative z-10 group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-dark-0/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1542013936693-884638332954?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt={`${businessInfo.name} Store`} 
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-dark-1 border border-white/15 p-6 rounded-3xl shadow-2xl z-20 liquid-glass animate-bounce-slow hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-volt/20 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-volt" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white flex items-center">
                    <Counter end={parseInt(businessInfo.experience)} suffix="+" />
                  </div>
                  <div className="text-sm text-slate-300 font-medium">Years of Trust</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section id="stats" className="border-y border-white/10 bg-dark-1/50 relative overflow-hidden">
        <div className="grid-bg opacity-30" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10">
          <div className="text-center space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-4xl md:text-5xl font-extrabold text-volt flex items-center justify-center">
              <Counter end={parseInt(businessInfo.experience)} suffix="+" />
            </div>
            <div className="text-slate-300 font-semibold uppercase tracking-wider text-xs">Years Experience</div>
          </div>
          <div className="text-center space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-4xl md:text-5xl font-extrabold text-white flex items-center justify-center">
              <Counter end={businessInfo.productsCount} suffix="+" />
            </div>
            <div className="text-slate-300 font-semibold uppercase tracking-wider text-xs">Products</div>
          </div>
          <div className="text-center space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-4xl md:text-5xl font-extrabold text-white flex items-center justify-center">
              <Counter end={businessInfo.brandsCount} suffix="+" />
            </div>
            <div className="text-slate-300 font-semibold uppercase tracking-wider text-xs">Top Brands</div>
          </div>
          <div className="text-center space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="text-4xl md:text-5xl font-extrabold text-white flex items-center justify-center">
              <Counter end={parseInt(businessInfo.customersServed.replace(/[^0-9]/g, ''))} suffix="+" />
            </div>
            <div className="text-slate-300 font-semibold uppercase tracking-wider text-xs">Happy Customers</div>
          </div>
        </div>
      </Section>

      {/* Values Section */}
      <Section id="values" className="relative">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-volt/10 rounded-full blur-[120px] -z-10 -translate-y-1/2" />
        
        <SectionHeader 
          label="Our Core Values"
          title="What Drives Us Every Day"
          subtitle="The principles that guide our business and how we treat our customers."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
          {values.map((value, idx) => (
            <div key={idx} className="glass-card p-8 rounded-3xl border border-white/10 hover:border-volt/40 transition-colors duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-dark-2 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-volt group-hover:text-dark-0 transition-colors duration-300 shadow-lg">
                <value.icon className="w-7 h-7 text-volt group-hover:text-dark-0 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
              <p className="text-slate-300 leading-relaxed font-normal">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* What We Offer Section */}
      <Section id="offerings" className="bg-dark-1 border-y border-white/10">
        <SectionHeader 
          label="Our Expertise"
          title="Comprehensive Electrical Solutions"
          subtitle="We carry a wide range of genuine products across major categories to meet all your residential, commercial, and industrial needs."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {categories.map((category) => {
            const IconComponent = CAT_ICONS[category.icon] || HelpCircle;
            return (
              <Link key={category.id} to={`/products?category=${category.slug}`} className="group">
                <div className="glass-card p-6 rounded-3xl flex items-start gap-4 border border-white/10 hover:border-volt/40 transition-all duration-300 h-full">
                  <div className="p-3 rounded-2xl bg-dark-2 text-volt shrink-0 group-hover:bg-volt/10 transition-colors border border-white/10">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-volt transition-colors">{category.name}</h4>
                    <p className="text-slate-300 text-sm line-clamp-2 font-normal leading-relaxed">{category.description}</p>
                    <div className="flex items-center gap-1 mt-4 text-volt text-sm font-semibold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      Explore Category <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/products" className="btn-primary py-3.5 px-8 rounded-full font-bold shadow-xl">
            View All Products
          </Link>
        </div>
      </Section>

      {/* CTA Section */}
      <Section id="visit-us" className="relative pb-0">
        <div className="glass-card rounded-3xl p-8 md:p-12 lg:p-16 border-t-4 border-t-volt relative overflow-hidden border border-white/15">
          <div className="absolute top-0 right-0 w-64 h-64 bg-volt/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Visit Us Today</h2>
              <p className="text-xl text-slate-300 mb-8 font-normal">
                Drop by our store to consult with our experts or see our products firsthand. We're always ready to help you with your next project.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-3 rounded-2xl bg-dark-2 text-volt border border-white/10">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Our Location</h4>
                    <p className="text-slate-300 font-normal">{businessInfo.address.full}</p>
                    <a href={businessInfo.mapDirectionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-volt text-sm font-semibold mt-2 hover:underline">
                      Get Directions <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-3 rounded-2xl bg-dark-2 text-volt border border-white/10">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Business Hours</h4>
                    <p className="text-slate-300 font-normal whitespace-pre-line">Mon-Sat: {businessInfo.hours.weekdays}<br/>Sun: {businessInfo.hours.sunday}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-center space-y-4">
              <a href={getPhoneUrl()} className="glass-card p-6 rounded-3xl flex items-center justify-between group border border-white/15 hover:border-volt/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-dark-2 border border-white/10 flex items-center justify-center group-hover:bg-volt group-hover:text-dark-0 transition-colors">
                    <Phone className="w-6 h-6 text-volt group-hover:text-dark-0" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Call us directly</div>
                    <div className="text-xl font-extrabold text-white">{businessInfo.phone}</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-volt transition-colors" />
              </a>
              
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="glass-card p-6 rounded-3xl flex items-center justify-between group border border-white/15 hover:border-[#25D366]/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-dark-2 border border-white/10 flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                    <MessageCircle className="w-6 h-6 text-[#25D366] group-hover:text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Chat on WhatsApp</div>
                    <div className="text-xl font-extrabold text-white">{businessInfo.whatsapp}</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#25D366] transition-colors" />
              </a>
              
              <Link to="/contact" className="glass-card p-6 rounded-3xl flex items-center justify-between group border border-white/15 hover:border-white/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-dark-2 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-dark-0 transition-colors">
                    <Check className="w-6 h-6 text-white group-hover:text-dark-0" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Need a bulk quote?</div>
                    <div className="text-xl font-extrabold text-white">Request Quotation</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
