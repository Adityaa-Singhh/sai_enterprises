import { useEffect, useRef, useState, forwardRef, type ReactNode, type Ref } from 'react';

import { useAdminStore } from '../admin/data/adminStore';
import { submitEnquiry } from '../services/enquiryService';

// ===== Scroll Reveal Hook =====
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

// ===== Section Wrapper =====
export const Section = forwardRef(function Section(
  {
    children,
    className = '',
    id,
  }: {
    children: ReactNode;
    className?: string;
    id?: string;
  },
  forwardedRef: Ref<HTMLElement>
) {
  const scrollRef = useScrollReveal<HTMLElement>();
  // Use forwarded ref if provided, otherwise use scroll reveal ref
  const ref = forwardedRef || scrollRef;
  return (
    <section ref={ref as Ref<HTMLElement>} id={id} className={`reveal section-padding ${className}`}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
});

// ===== Section Header =====
export function SectionHeader({
  label,
  title,
  subtitle,
  className = '',
}: {
  label: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`section-header ${className}`}>
      <span className="section-label">{label}</span>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}

// ===== Star Rating =====
export function StarRating({ rating, size = 16, className = '' }: { rating: number; size?: number; className?: string }) {
  return (
    <div className={`star-rating ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={i <= rating ? 0 : 1.5}
          style={{ opacity: i <= rating ? 1 : 0.3 }}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// ===== Product Placeholder Image =====
export function ProductImage({
  src,
  alt,
  className = '',
  size = 'md',
}: {
  src: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [error, setError] = useState(false);

  const sizeMap = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
  };

  if (error || !src) {
    return (
      <div
        className={`${sizeMap[size]} w-full flex items-center justify-center bg-gradient-to-br from-dark-2 to-dark-3 ${className}`}
      >
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-white/5 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white/20"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <span className="text-[10px] text-white/20 font-medium">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeMap[size]} w-full object-cover ${className}`}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

// ===== Badge =====
export function Badge({
  children,
  variant = 'volt',
  className = '',
}: {
  children: ReactNode;
  variant?: 'volt' | 'green' | 'amber';
  className?: string;
}) {
  return <span className={`badge badge-${variant} ${className}`}>{children}</span>;
}

// ===== Empty State =====
export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-white/20">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white/60 mb-2">{title}</h3>
      <p className="text-sm text-white/30 max-w-md">{description}</p>
    </div>
  );
}

// ===== Lightbox =====
export function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        className="absolute top-4 right-4 text-white/60 hover:text-white z-10 p-2"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <img src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

// ===== Animated Counter =====
export function Counter({ end, suffix = '' }: { end: string | number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState('0');
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const endStr = end.toString();
          const numericPart = parseInt(endStr.replace(/\D/g, '')) || 0;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(numericPart * eased);
            setValue(current.toString());
            if (progress < 1) requestAnimationFrame(animate);
            else setValue(endStr);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

// ===== Quote Modal =====
export function QuoteModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    product: '',
    quantity: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const { addEnquiry } = useAdminStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const messageText = formData.message
      ? `${formData.message}${formData.quantity ? ' | Qty: ' + formData.quantity : ''}`
      : (formData.quantity ? `Qty: ${formData.quantity}` : 'No notes');

    addEnquiry({
      customerName: formData.name,
      phone: formData.phone,
      productRequirement: formData.product,
      message: messageText,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      source: 'Web Quote',
      priority: 'MEDIUM',
    });

    try {
      await submitEnquiry({
        customerName: formData.name,
        phone: formData.phone,
        productRequirement: formData.product,
        message: messageText,
        source: 'Web Quote',
      });
    } catch (err) {
      console.warn('[QuoteModal] Firestore enquiry submission queued locally:', err);
    }

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg liquid-glass-strong rounded-2xl p-6 sm:p-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Request Sent!</h3>
            <p className="text-white/50 text-sm">We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-white mb-1">Request a Quote</h3>
            <p className="text-white/40 text-sm mb-6">
              Tell us what you need and we'll share pricing details.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="quote-name" className="block text-xs font-medium text-white/50 mb-1.5">
                  Your Name *
                </label>
                <input
                  id="quote-name"
                  type="text"
                  required
                  className="input-glass"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="quote-phone" className="block text-xs font-medium text-white/50 mb-1.5">
                  Phone Number *
                </label>
                <input
                  id="quote-phone"
                  type="tel"
                  required
                  className="input-glass"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="quote-product" className="block text-xs font-medium text-white/50 mb-1.5">
                  Product / Requirement *
                </label>
                <input
                  id="quote-product"
                  type="text"
                  required
                  className="input-glass"
                  placeholder="e.g., 100 modular switches, wiring for 3BHK"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="quote-qty" className="block text-xs font-medium text-white/50 mb-1.5">
                  Quantity (optional)
                </label>
                <input
                  id="quote-qty"
                  type="text"
                  className="input-glass"
                  placeholder="e.g., 50 pieces, 500 meters"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="quote-msg" className="block text-xs font-medium text-white/50 mb-1.5">
                  Additional Details
                </label>
                <textarea
                  id="quote-msg"
                  rows={3}
                  className="input-glass resize-none"
                  placeholder="Any specific brands, models, or requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <button type="submit" className="btn-primary w-full justify-center">
                Submit Quote Request
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
