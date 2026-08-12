import { useState } from 'react';
import { ChevronDown, MessageCircle, Phone } from 'lucide-react';
import { Section, SectionHeader, useScrollReveal } from '../components/ui';
import { faqs, getWhatsAppUrl, getPhoneUrl } from '../data';

const categories = ['All', 'Products', 'Brands', 'Orders', 'Store', 'Delivery', 'Warranty', 'Returns', 'Services'];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const revealRef = useScrollReveal<HTMLDivElement>();

  const filteredFaqs = activeCategory === 'All'
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-dark-0 text-white">
      <Section id="faq-header" className="pt-12 pb-8">
        <SectionHeader 
          label="Help Center" 
          title="Frequently Asked Questions" 
          subtitle="Find answers to common questions about our products, services, and policies." 
        />
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8 animate-stagger" ref={revealRef}>
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-volt text-dark-0 shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                  : 'bg-dark-2 text-gray-300 hover:bg-dark-3 hover:text-white border border-dark-3'
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {cat}
            </button>
          ))}
        </div>
      </Section>

      <Section id="faq-content" className="py-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div 
                key={faq.id} 
                className={`glass-card rounded-3xl overflow-hidden transition-all duration-300 border border-white/10 ${
                  openFaqId === faq.id 
                    ? 'border-volt/40 shadow-[0_4px_25px_rgba(0,229,255,0.15)] bg-white/5' 
                    : 'hover:border-volt/20'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="text-lg font-bold text-white pr-4">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-volt transition-transform duration-300 flex-shrink-0 ${
                      openFaqId === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    openFaqId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 pt-0 text-slate-300 leading-relaxed border-t border-white/10 mt-2 font-normal">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-300 glass-card rounded-3xl">
              No FAQs found for this category.
            </div>
          )}
        </div>
      </Section>

      <Section id="faq-cta" className="py-12">
        <div className="max-w-2xl mx-auto liquid-glass rounded-3xl p-10 text-center relative overflow-hidden border border-white/15 shadow-2xl">
          <div className="orb orb-volt top-0 right-0 opacity-20"></div>
          <div className="orb orb-blue bottom-0 left-0 opacity-20"></div>
          
          <h3 className="text-2xl font-extrabold text-white mb-4 relative z-10">Still have questions?</h3>
          <p className="text-slate-300 mb-8 relative z-10 font-normal">
            Can't find the answer you're looking for? Our team is ready to help you with any inquiries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a 
              href={getWhatsAppUrl("Hi, I have a question not answered in the FAQ.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full sm:w-auto py-3.5 px-8 rounded-full font-bold shadow-xl flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
            <a 
              href={getPhoneUrl()}
              className="btn-secondary w-full sm:w-auto py-3.5 px-8 rounded-full font-bold text-white border border-white/10 flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5 text-volt" />
              Call Us
            </a>
          </div>
        </div>
      </Section>
    </div>
  );
}
