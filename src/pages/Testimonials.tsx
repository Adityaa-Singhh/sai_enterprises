
import { Star, Quote, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Section, SectionHeader, StarRating, useScrollReveal } from '../components/ui';
import { useAdminStore } from '../admin/data/adminStore';

export default function Testimonials() {
  const { testimonials, businessInfo } = useAdminStore();
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();
  const ctaRef = useScrollReveal<HTMLDivElement>();

  // Calculate overall rating
  const averageRating = testimonials.length > 0 
    ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
    : '5.0';

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <Section id="testimonials-header" className="!pt-8 !pb-12" ref={headerRef}>
        <SectionHeader 
          label="What Our Customers Say" 
          title="Trusted by the Community" 
          subtitle={`Don't just take our word for it. See why electricians, contractors, and homeowners trust ${businessInfo.name}.`}
        />
        
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center mt-10">
          <div className="glass-card px-8 py-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 border border-white/15 relative overflow-hidden shadow-2xl">
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-volt/10 rounded-full blur-3xl"></div>
             <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            
            <div className="flex flex-col items-center text-center md:border-r md:border-white/10 md:pr-6 relative z-10">
              <span className="text-5xl font-extrabold text-white tracking-tight">{averageRating}</span>
              <div className="flex items-center gap-1 mt-2 text-volt">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider mt-2">Overall Rating</span>
            </div>
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-dark-3 flex items-center justify-center border border-white/10">
                  <span className="font-extrabold text-volt text-lg">{businessInfo.customersServed}</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Happy Customers</h4>
                  <p className="text-sm text-slate-300 font-normal">Based on authentic reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="testimonials-grid" className="!pt-0" ref={gridRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="glass-card rounded-3xl p-8 relative flex flex-col h-full hover:-translate-y-1 transition-transform duration-300 group border border-white/10 hover:border-volt/40"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-white/10 group-hover:text-volt/20 transition-colors duration-300" />
              
              <div className="mb-6">
                <StarRating rating={testimonial.rating} size={18} />
              </div>
              
              <p className="text-slate-200 leading-relaxed mb-8 flex-grow font-normal">
                "{testimonial.review}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-dark-3 to-dark-2 flex items-center justify-center border border-white/10 shrink-0 shadow-lg">
                  <span className="text-lg font-extrabold text-volt">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{testimonial.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
                    <span>{testimonial.role}</span>
                    {testimonial.date && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                        <span>{testimonial.date}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="testimonials-cta" ref={ctaRef}>
        <div className="glass-card p-8 md:p-12 rounded-3xl text-center border border-white/15 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
              Have you worked with us?
            </h3>
            <p className="text-slate-300 mb-8 font-normal">
              We appreciate your feedback! Share your experience to help others find quality electrical products.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href={businessInfo.social.google} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary py-3.5 px-8 rounded-full font-bold shadow-xl inline-flex items-center gap-2"
              >
                Leave a Google Review <ExternalLink className="w-4 h-4" />
              </a>
              <Link to="/contact" className="btn-secondary py-3.5 px-8 rounded-full font-bold text-white border border-white/10 inline-flex items-center gap-2">
                Contact Us <ArrowRight className="w-4 h-4 text-volt" />
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
