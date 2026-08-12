import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, Check, ArrowRight } from 'lucide-react';
import { Section, SectionHeader, useScrollReveal } from '../components/ui';
import { businessInfo, getWhatsAppUrl, getPhoneUrl } from '../data';

interface ContactProps {
  onQuote: () => void;
}

export default function Contact({ onQuote }: ContactProps) {
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    requirement: '',
    quantity: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const revealRef = useScrollReveal<HTMLDivElement>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormState({ name: '', phone: '', requirement: '', quantity: '', message: '' });
      
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-dark-0 text-white">
      <Section id="contact-header" className="pt-12 pb-8">
        <SectionHeader 
          label="Get in Touch" 
          title="Contact Us" 
          subtitle="We're here to help with your electrical needs. Reach out to our team for expert advice, support, or a customized quotation." 
        />
      </Section>

      <Section id="contact-content" className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" ref={revealRef}>
          {/* Left Column: Info & Map */}
          <div className="space-y-8 animate-stagger">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href={getPhoneUrl()} className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center hover:border-volt/50 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-dark-2 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-volt/10 transition-colors">
                  <Phone className="w-6 h-6 text-volt" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">Call Us</h3>
                <p className="text-slate-300 text-sm font-normal">{businessInfo.phone}</p>
              </a>
              
              <a 
                href={getWhatsAppUrl("Hi, I would like to get in touch")} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center hover:border-green-500/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-dark-2 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-green-500/10 transition-colors">
                  <MessageCircle className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">WhatsApp</h3>
                <p className="text-slate-300 text-sm font-normal">{businessInfo.whatsapp}</p>
              </a>
              
              <a href={`mailto:${businessInfo.email}`} className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center hover:border-blue-400/50 transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-dark-2 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-blue-400/10 transition-colors">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">Email</h3>
                <p className="text-slate-300 text-sm font-normal">{businessInfo.email}</p>
              </a>
              
              <a 
                href={businessInfo.mapDirectionsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center hover:border-amber-400/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-dark-2 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-amber-400/10 transition-colors">
                  <MapPin className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">Visit Store</h3>
                <p className="text-slate-300 text-sm font-normal line-clamp-2">{businessInfo.address.full}</p>
              </a>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-volt" />
                <h3 className="text-xl font-bold text-white">Business Hours</h3>
              </div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex justify-between border-b border-white/10 pb-2.5 font-normal">
                  <span className="font-semibold text-white">Mon-Sat</span>
                  <span className="text-volt font-semibold">{businessInfo.hours.weekdays}</span>
                </li>
                <li className="flex justify-between pb-0 font-normal">
                  <span className="font-semibold text-white">Sunday</span>
                  <span className="text-slate-400 font-semibold">{businessInfo.hours.sunday}</span>
                </li>
              </ul>
            </div>

            <div className="h-64 rounded-3xl overflow-hidden glass-card p-2 border border-white/10">
               <iframe 
                src={businessInfo.mapUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '1rem' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Store Location"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="glass-card p-8 h-fit relative overflow-hidden">
            <div className="orb orb-volt top-0 right-0 opacity-10"></div>
            <h3 className="text-2xl font-bold mb-6 relative z-10">Send a Message</h3>
            
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center relative z-10">
                <div className="w-16 h-16 bg-volt/20 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-volt" />
                </div>
                <h4 className="text-xl font-bold mb-2">Message Sent Successfully!</h4>
                <p className="text-gray-400">We will get back to you as soon as possible.</p>
                <button onClick={() => setIsSuccess(false)} className="btn-secondary mt-8">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-sm text-gray-400 ml-1">Full Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      value={formState.name} 
                      onChange={handleChange} 
                      className="input-glass w-full" 
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-sm text-gray-400 ml-1">Phone Number *</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      required 
                      value={formState.phone} 
                      onChange={handleChange} 
                      className="input-glass w-full" 
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="requirement" className="text-sm text-gray-400 ml-1">Product / Requirement *</label>
                    <input 
                      type="text" 
                      id="requirement" 
                      name="requirement" 
                      required 
                      value={formState.requirement} 
                      onChange={handleChange} 
                      className="input-glass w-full" 
                      placeholder="E.g., Havells Wire, Switches"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="quantity" className="text-sm text-gray-400 ml-1">Quantity (Optional)</label>
                    <input 
                      type="text" 
                      id="quantity" 
                      name="quantity" 
                      value={formState.quantity} 
                      onChange={handleChange} 
                      className="input-glass w-full" 
                      placeholder="E.g., 10 Coils"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="text-sm text-gray-400 ml-1">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    value={formState.message} 
                    onChange={handleChange} 
                    className="input-glass w-full resize-none" 
                    placeholder="Any specific details or requirements..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className={`btn-primary w-full flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-dark-0 border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </Section>

      <Section id="quote-cta" className="py-12">
        <div className="liquid-glass rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden flex flex-col items-center">
          <div className="orb orb-volt top-0 right-1/4 opacity-20"></div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-4 relative z-10">Need a Bulk Quotation?</h3>
          <p className="text-gray-300 mb-8 max-w-2xl relative z-10">
            For large orders, commercial projects, or special requirements, request a customized quotation and get our best competitive pricing.
          </p>
          <button onClick={onQuote} className="btn-primary flex items-center gap-2 relative z-10 text-lg px-8 py-4">
            Request a Quotation
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </Section>
    </div>
  );
}
