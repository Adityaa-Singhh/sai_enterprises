import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Eye } from 'lucide-react';
import { ProductImage } from './ui';
import { getProductEnquiryUrl } from '../data';

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug?: string;
  shortDescription: string;
  description?: string;
  images: string[];
  inStock: boolean;
  isNew: boolean;
  isFeatured?: boolean;
  [key: string]: any;
}

export interface GridCardProps {
  product: Product;
  onQuickView?: (p: Product) => void;
}

export interface ListCardProps {
  product: Product;
  onQuickView?: (p: Product) => void;
}

// ==========================================
// ==========================================
// 1. PRODUCT GRID CARD (2-Col Mobile, Enhanced Desktop)
// ==========================================
export const ProductGridCard: React.FC<GridCardProps> = ({ product, onQuickView }) => {
  return (
    <div className="w-full rounded-2xl bg-dark-2 border border-white/10 hover:border-volt/40 hover:shadow-[0_12px_28px_rgba(0,0,0,0.5),0_0_20px_rgba(0,229,255,0.08)] overflow-hidden flex flex-col group transition-all duration-300 relative">
      {/* IMAGE AREA (Mobile: 130px, Desktop: 176px - 10-15% larger) */}
      <div className="h-[130px] sm:h-36 lg:h-44 relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950">
        <ProductImage
          src={product.images && product.images.length > 0 ? product.images[0] : ''}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Badges (Top-Left, Stacked 8px gap) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNew && (
            <span
              className="bg-volt text-dark-0 text-[9px] lg:text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider"
              aria-label="New Arrival"
            >
              NEW
            </span>
          )}
          {product.inStock ? (
            !product.isNew && (
              <span
                className="bg-green-500/20 text-green-400 text-[9px] lg:text-[10px] font-extrabold px-2 py-0.5 rounded border border-green-500/30 uppercase tracking-wider backdrop-blur-sm"
                aria-label="In Stock"
              >
                IN STOCK
              </span>
            )
          ) : (
            <span
              className="bg-amber-500/20 text-amber-400 text-[9px] lg:text-[10px] font-extrabold px-2 py-0.5 rounded border border-amber-500/30 uppercase tracking-wider backdrop-blur-sm"
              aria-label="Out of Stock"
            >
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Brand Chip (Top-Right) */}
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-dark-0/80 backdrop-blur-sm text-[9px] lg:text-[10px] font-extrabold px-2 py-0.5 rounded border border-white/20 text-white uppercase tracking-wider">
            {product.brand}
          </span>
        </div>

        {/* Quick View Button (Bottom-Right, 32px-36px circle) */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            aria-label={`Quick view ${product.name}`}
            className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-dark-0/80 hover:bg-volt text-volt hover:text-dark-0 border border-white/15 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg absolute bottom-2 right-2 z-10 cursor-pointer focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-volt/50"
          >
            <Eye className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
          </button>
        )}
      </div>

      {/* BODY (p-3 on mobile, p-4 on desktop) */}
      <div className="p-3 lg:p-4 flex flex-col flex-grow justify-between">
        {/* Category & Brand Row */}
        <div className="flex items-center justify-between gap-1 mb-1.5 text-[10px] lg:text-[11px] leading-none">
          <span className="font-bold uppercase text-volt truncate max-w-[60%]">
            {product.category}
          </span>
          <span className="font-semibold text-slate-400 truncate max-w-[35%]">
            {product.brand}
          </span>
        </div>

        {/* Title */}
        <Link to={`/products/${product.slug}`} className="block">
          <h3 className="text-[13px] lg:text-[14.5px] font-extrabold text-white line-clamp-2 min-h-[34px] lg:min-h-[38px] mb-1.5 leading-tight group-hover:text-volt transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-[11px] lg:text-xs text-slate-400 line-clamp-2 min-h-[30px] lg:min-h-[34px] mb-3 leading-tight font-normal">
          {product.shortDescription || product.description || ''}
        </p>

        {/* CTA Row */}
        <div className="flex gap-[6px] lg:gap-2 items-center mt-auto min-h-[44px]">
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 py-2.5 lg:py-2.5 min-h-[40px] lg:min-h-[42px] rounded-2xl text-[11px] lg:text-xs font-extrabold bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-volt/50 text-center"
            aria-label={`View details for ${product.name}`}
          >
            View Details
          </Link>

          <a
            href={getProductEnquiryUrl(product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 lg:py-2.5 min-h-[40px] lg:min-h-[42px] rounded-2xl text-[11px] lg:text-xs font-extrabold bg-[#25d366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-1 lg:gap-1.5 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-volt/50 text-center"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
          >
            <MessageCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" />
            <span>Enquire</span>
          </a>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. PRODUCT LIST CARD (Enterprise Modern Layout)
// ==========================================
export const ProductListCard: React.FC<ListCardProps> = ({ product, onQuickView }) => {
  // Extract key specs to display (up to 4 specs)
  const displaySpecs = product.specifications && Array.isArray(product.specifications) 
    ? product.specifications.slice(0, 4) 
    : [];

  return (
    <div className="w-full bg-dark-2/90 hover:bg-dark-2 border border-white/10 hover:border-volt/40 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5),0_0_24px_rgba(0,229,255,0.06)] rounded-2xl p-3 sm:p-4 lg:p-5 transition-all duration-300 flex flex-col md:flex-row gap-4 lg:gap-6 items-stretch group relative">
      
      {/* 1. VISUAL SHOWCASE (Mobile: 110px thumb, Desktop: 240px-288px wide aspect ratio - 15% increase) */}
      <div className="w-full sm:w-40 md:w-60 lg:w-72 h-36 sm:h-40 md:h-48 lg:h-52 rounded-xl overflow-hidden relative shrink-0 bg-gradient-to-br from-slate-800 to-slate-950 border border-white/5">
        <ProductImage
          src={product.images && product.images.length > 0 ? product.images[0] : ''}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges (Top-Left) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isNew && (
            <span className="bg-volt text-dark-0 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
              NEW
            </span>
          )}
          {product.inStock ? (
            !product.isNew && (
              <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-extrabold px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider backdrop-blur-sm">
                IN STOCK
              </span>
            )
          ) : (
            <span className="bg-amber-500/20 text-amber-400 text-[9px] font-extrabold px-2 py-0.5 rounded border border-amber-500/30 uppercase tracking-wider backdrop-blur-sm">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Brand Chip (Top-Right on Image) */}
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-dark-0/85 backdrop-blur-md text-[9px] font-extrabold px-2 py-0.5 rounded border border-white/20 text-white uppercase tracking-wider">
            {product.brand}
          </span>
        </div>

        {/* Quick View Button (Bottom-Right on Image) */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            aria-label={`Quick view ${product.name}`}
            className="w-8 h-8 rounded-full bg-dark-0/80 hover:bg-volt text-volt hover:text-dark-0 border border-white/15 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg absolute bottom-2 right-2 z-10 cursor-pointer focus-visible:opacity-100"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. PRODUCT DETAILS & TECHNICAL SPECS (Middle Column) */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Category, Brand & Authorized Badge Header */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-volt">
              {product.category}
            </span>
            <span className="text-white/20 text-xs">•</span>
            <span className="text-[11px] font-semibold text-slate-300">
              {product.brand}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full ml-auto">
              <span>100% Genuine</span>
            </span>
          </div>

          {/* Title */}
          <Link to={`/products/${product.slug}`} className="block">
            <h3 className="text-base lg:text-lg font-extrabold text-white line-clamp-1 group-hover:text-volt transition-colors mb-1.5">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs lg:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-3 font-normal">
            {product.shortDescription || product.description || ''}
          </p>

          {/* Key Specifications Chips (Desktop & Tablet) */}
          {displaySpecs.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-1.5 lg:gap-2 mb-3">
              {displaySpecs.map((spec: any, idx: number) => (
                <div 
                  key={idx}
                  className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-slate-400 font-medium">{spec.label}:</span>
                  <strong className="text-white font-semibold">{spec.value}</strong>
                </div>
              ))}
            </div>
          )}

          {/* Tags if no specs */}
          {displaySpecs.length === 0 && product.tags && product.tags.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-1.5 mb-3">
              {product.tags.slice(0, 4).map((tag: any, idx: number) => (
                <span 
                  key={idx}
                  className="text-[10px] font-medium text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Mobile-only CTA Row (Hidden on Desktop) */}
        <div className="flex sm:hidden gap-2 items-center pt-2 mt-auto border-t border-white/10">
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 py-2 min-h-[38px] rounded-xl text-[11px] font-extrabold bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all active:scale-95 text-center"
            aria-label={`View details for ${product.name}`}
          >
            View Details
          </Link>

          <a
            href={getProductEnquiryUrl(product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 min-h-[38px] rounded-xl text-[11px] font-extrabold bg-[#25d366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-1.5 transition-all active:scale-95 text-center"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Enquire</span>
          </a>
        </div>
      </div>

      {/* 3. TRADE & ACTION PANEL (Desktop Dedicated Right Column) */}
      <div className="hidden sm:flex md:w-48 lg:w-56 shrink-0 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-4 lg:pl-5 flex-col justify-between">
        {/* Availability & Trade Status */}
        <div>
          <div className="mb-2">
            {product.inStock ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Ready for Dispatch</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Available on Order</span>
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight mb-3 hidden md:block">
            Wholesale & retail quotes available directly from authorized distributor.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto">
          <a
            href={getProductEnquiryUrl(product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 min-h-[40px] rounded-xl text-xs font-extrabold bg-[#25d366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_4px_14px_rgba(37,211,102,0.2)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.35)]"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Enquire on WhatsApp</span>
          </a>

          <Link
            to={`/products/${product.slug}`}
            className="w-full py-2.5 min-h-[38px] rounded-xl text-xs font-bold bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 text-white flex items-center justify-center gap-1.5 transition-all active:scale-95"
            aria-label={`View full specifications for ${product.name}`}
          >
            <span>View Full Specs</span>
          </Link>
        </div>
      </div>

    </div>
  );
};
