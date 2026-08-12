import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Zap,
  Phone,
  MessageCircle,
  ChevronDown,
} from 'lucide-react';
import { businessInfo, getWhatsAppUrl, getPhoneUrl } from '../data';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Brands', to: '/brands' },
  { label: 'About', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  {
    label: 'More',
    children: [
      { label: 'Testimonials', to: '/testimonials' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar({ onQuote }: { onQuote: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [clickTimes, setClickTimes] = useState<number[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [location]);

  const isActive = (to: string) => location.pathname === to;

  const handleLogoClick = (e: React.MouseEvent) => {
    const now = Date.now();
    const recentClicks = [...clickTimes, now].filter(t => now - t < 2000); // clicks in last 2 seconds
    setClickTimes(recentClicks);
    
    if (recentClicks.length >= 5) {
      e.preventDefault();
      navigate('/admin/login');
      setClickTimes([]);
    }
  };

  return (
    <>
      {/* Enterprise Announcement Top Bar */}
      <div className="bg-gradient-to-r from-dark-2 via-dark-1 to-dark-2 text-slate-300 text-[11px] sm:text-xs py-1.5 px-4 border-b border-white/10 hidden sm:block z-50 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-volt font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Open Today: {businessInfo.hours.weekdays}
            </span>
            <span className="text-slate-500">|</span>
            <span className="font-normal text-slate-300">Authorized Dealer: <strong className="text-white">PMCona</strong>, <strong className="text-white">Havells</strong> & <strong className="text-white">Polycab</strong></span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 font-medium">
            <a href={getPhoneUrl()} className="hover:text-volt transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3 text-volt" /> {businessInfo.phone}
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'backdrop-blur-xl bg-dark-0/90 border-b border-white/10 shadow-2xl py-3'
            : 'backdrop-blur-lg bg-dark-0/70 border-b border-white/5 py-4'
        }`}
      >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 text-white font-bold text-xl group"
          aria-label="Sai Enterprises Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-volt to-volt-dim flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)] group-hover:scale-105 transition-all">
            <Zap size={20} strokeWidth={2.5} className="text-dark-0" />
          </div>
          <span className="tracking-tight">
            Sai<span className="text-volt">Enterprises</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center">
          <div className="liquid-glass flex items-center gap-1 rounded-2xl px-3 py-1.5 border border-white/10">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                      link.children.some((c) => isActive(c.to))
                        ? 'bg-white/15 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setMoreOpen(!moreOpen)}
                    onBlur={() => setTimeout(() => setMoreOpen(false), 200)}
                    aria-expanded={moreOpen}
                    aria-haspopup="true"
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {moreOpen && (
                    <div className="absolute top-full left-0 mt-2 w-44 liquid-glass-strong rounded-2xl p-2 animate-scale-in border border-white/15 shadow-2xl">
                      {link.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className={`block px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                            isActive(child.to)
                              ? 'bg-white/15 text-white'
                              : 'text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to!}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.to!)
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={getPhoneUrl()}
            className="liquid-glass text-white text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-white/10 transition-all flex items-center gap-2 border border-white/10"
          >
            <Phone size={14} className="text-volt" />
            Call Us
          </a>
          <button
            onClick={onQuote}
            className="bg-gradient-to-r from-volt to-volt-dim text-dark-0 text-sm font-bold px-5 py-2.5 rounded-full hover:shadow-[0_4px_25px_rgba(0,229,255,0.45)] hover:scale-105 transition-all"
          >
            Get a Quote
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden liquid-glass text-white p-2.5 rounded-2xl border border-white/10"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-4 right-4 mt-2 liquid-glass-strong rounded-3xl p-5 flex flex-col gap-1.5 animate-scale-in border border-white/15 shadow-2xl">
          {navLinks.map((link) =>
            link.children ? (
              link.children.map((child) => (
                <Link
                  key={child.to}
                  to={child.to}
                  className={`flex items-center w-full px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                    isActive(child.to)
                      ? 'bg-white/15 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {child.label}
                </Link>
              ))
            ) : (
              <Link
                key={link.to}
                to={link.to!}
                className={`flex items-center w-full px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                  isActive(link.to!)
                    ? 'bg-white/15 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            )
          )}

          <div className="flex gap-2.5 mt-3 pt-3 border-t border-white/10">
            <a
              href={getPhoneUrl()}
              className="flex-1 liquid-glass text-white text-sm font-semibold px-4 py-3 rounded-2xl text-center flex items-center justify-center gap-2 border border-white/10"
            >
              <Phone size={15} className="text-volt" />
              Call
            </a>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25d366] text-white text-sm font-semibold px-4 py-3 rounded-2xl text-center flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
          </div>
          <button
            onClick={() => { setMenuOpen(false); onQuote(); }}
            className="w-full bg-gradient-to-r from-volt to-volt-dim text-dark-0 text-sm font-bold px-4 py-3.5 rounded-2xl mt-2 shadow-lg"
          >
            Get a Quote
          </button>
        </div>
      )}
    </header>
    </>
  );
}

// ===== FOOTER =====
export function Footer() {
  const footerLinks = [
    {
      title: 'Products',
      links: [
        { label: 'Switches', to: '/products?category=switches' },
        { label: 'Sockets', to: '/products?category=sockets' },
        { label: 'Wires', to: '/products?category=wires' },
        { label: 'Lighting', to: '/products?category=lighting' },
        { label: 'MCB & Protection', to: '/products?category=mcb-protection' },
        { label: 'All Products', to: '/products' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Gallery', to: '/gallery' },
        { label: 'Testimonials', to: '/testimonials' },
        { label: 'Brands', to: '/brands' },
        { label: 'FAQ', to: '/faq' },
        { label: 'Contact', to: '/contact' },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 pb-24 md:pb-0 bg-dark-1/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 text-white font-bold text-xl mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-volt to-volt-dim flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                <Zap size={18} strokeWidth={2.5} className="text-dark-0" />
              </div>
              <span className="tracking-tight">
                Sai<span className="text-volt">Enterprises</span>
              </span>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm mb-6 font-normal">
              {businessInfo.description}
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-slate-200">
                <Phone size={15} className="text-volt" />
                <a href={getPhoneUrl()} className="hover:text-volt transition-colors font-medium">
                  {businessInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-200">
                <MessageCircle size={15} className="text-[#25d366]" />
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25d366] transition-colors font-medium"
                >
                  WhatsApp Us
                </a>
              </div>
              <div className="flex items-start gap-2.5 text-slate-300">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-volt">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="font-normal">{businessInfo.address.full}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-white font-bold text-base mb-4 tracking-wide">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-slate-300 text-sm hover:text-volt transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs font-medium">
            © {new Date().getFullYear()} {businessInfo.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span>Made with</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ===== MOBILE BOTTOM BAR =====
export function MobileBottomBar({ onQuote }: { onQuote: () => void }) {
  return (
    <div className="mobile-bottom-bar">
      <a
        href={getPhoneUrl()}
        className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-white/10 text-white text-xs font-semibold border border-white/10 shadow-lg"
      >
        <Phone size={15} className="text-volt" />
        Call
      </a>
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-[#25d366] text-white text-xs font-semibold shadow-lg"
      >
        <MessageCircle size={15} />
        WhatsApp
      </a>
      <button
        onClick={onQuote}
        className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-gradient-to-r from-volt to-volt-dim text-dark-0 text-xs font-bold shadow-lg"
      >
        <Zap size={15} />
        Quote
      </button>
    </div>
  );
}

// ===== WHATSAPP FAB WITH RAY EMISSION ANIMATION =====
export function WhatsAppFab() {
  return (
    <div className="whatsapp-fab-container">
      <div className="whatsapp-sunburst" />
      <div className="whatsapp-ray-ring" />
      <div className="whatsapp-ray-ring-2" />
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} className="text-white drop-shadow-md" />
      </a>
    </div>
  );
}
