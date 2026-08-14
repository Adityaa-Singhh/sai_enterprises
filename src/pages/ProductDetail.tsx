import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Check, X, ShieldCheck, Truck, Phone, MessageCircle } from 'lucide-react';
import { products, getWhatsAppUrl, getPhoneUrl, getProductEnquiryUrl } from '../data';
import { Section, SectionHeader, ProductImage, Badge, EmptyState, useScrollReveal } from '../components/ui';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find(p => p.slug === slug);
  const revealRef = useScrollReveal<HTMLDivElement>();
  
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImage(0);
  }, [slug]);

  if (!product) {
    return (
      <div className="pt-24 pb-16 min-h-[60vh] flex flex-col items-center justify-center text-center gap-6">
        <EmptyState 
          icon={<X size={48} />}
          title="Product Not Found"
          description="The product you are looking for does not exist or has been removed."
        />
        <div>
          <Link to="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="pt-24 pb-0">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex text-sm text-dark-3 items-center space-x-2">
          <Link to="/" className="hover:text-volt transition-colors">Home</Link>
          <ChevronRight size={16} />
          <Link to="/products" className="hover:text-volt transition-colors">Products</Link>
          <ChevronRight size={16} />
          <Link to={`/categories/${product.categorySlug}`} className="hover:text-volt transition-colors">
            {product.category}
          </Link>
          <ChevronRight size={16} />
          <span className="text-white truncate">{product.name}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <Section id="product-detail" className="pt-0 pb-16">
        <div ref={revealRef} className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Left: Images */}
            <div className="space-y-4 animate-stagger">
              <div className="glass-card p-2 sm:p-4 rounded-2xl flex items-center justify-center bg-dark-1/50 border border-dark-2">
                <ProductImage 
                  src={product.images[activeImage]} 
                  alt={product.name} 
                  size="lg" 
                  className="rounded-xl w-full object-contain max-h-[500px]"
                />
              </div>
              
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`glass-card p-1 rounded-lg overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-volt' : 'border-transparent hover:border-dark-3'}`}
                    >
                      <ProductImage 
                        src={img} 
                        alt={`${product.name} thumbnail ${idx + 1}`} 
                        className="w-full h-full object-cover aspect-square rounded-md"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="flex flex-col animate-stagger">
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="volt">{product.brand}</Badge>
                  <Badge variant="volt">{product.category}</Badge>
                  {product.inStock ? (
                    <Badge variant="green" className="flex items-center gap-1">
                      <Check size={12} /> In Stock
                    </Badge>
                  ) : (
                    <Badge variant="amber">Out of Stock</Badge>
                  )}
                  {product.isNew && <Badge variant="volt">New Arrival</Badge>}
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {product.name}
                </h1>
                
                <p className="text-slate-300 text-lg mb-6 leading-relaxed font-normal">
                  {product.description || product.shortDescription}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10 pb-10 border-b border-white/10">
                <a href={getProductEnquiryUrl(product.name)} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 justify-center py-4 rounded-full font-bold shadow-xl">
                  Enquire Now
                </a>
                <a href={getWhatsAppUrl(`Hi, I'm interested in the ${product.name}.`)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp flex-1 justify-center py-4 rounded-full font-bold shadow-xl">
                  <MessageCircle size={20} className="mr-2" />
                  WhatsApp
                </a>
                <a href={getPhoneUrl()} className="btn-secondary flex-1 justify-center py-4 rounded-full font-bold">
                  <Phone size={20} className="mr-2 text-volt" />
                  Call Us
                </a>
              </div>

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-volt" size={24} />
                    Technical Specifications
                  </h3>
                  <div className="glass-card rounded-2xl overflow-hidden border border-white/15 shadow-xl">
                    {product.specifications.map((spec, index) => (
                      <div 
                        key={index} 
                        className={`flex flex-col sm:flex-row py-3.5 px-5 sm:px-6 border-b border-white/10 last:border-0 ${index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`}
                      >
                        <span className="text-cyan-400 sm:w-1/3 font-bold mb-1 sm:mb-0 text-sm tracking-wide">{spec.label}</span>
                        <span className="text-white sm:w-2/3 font-medium text-sm">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service tags */}
              <div className="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-white/10">
                <div className="flex items-center gap-3 text-slate-200">
                  <div className="w-10 h-10 rounded-2xl bg-dark-2 border border-white/10 flex items-center justify-center text-volt">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-sm font-semibold">Genuine<br/>Products</span>
                </div>
                <div className="flex items-center gap-3 text-slate-200">
                  <div className="w-10 h-10 rounded-2xl bg-dark-2 border border-white/10 flex items-center justify-center text-volt">
                    <Truck size={20} />
                  </div>
                  <span className="text-sm font-semibold">Fast<br/>Delivery</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </Section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Section id="related-products" className="bg-dark-1 relative overflow-hidden">
          <div className="orb orb-volt top-0 right-0 opacity-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex justify-between items-end mb-10">
              <SectionHeader 
                label="Related Items" 
                title="Similar Products" 
                className="mb-0 text-left items-start"
              />
              <Link to={`/categories/${product.categorySlug}`} className="text-volt hover:text-white transition-colors flex items-center font-medium">
                View Category <ChevronRight size={18} className="ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-stagger">
              {relatedProducts.map((p) => (
                <Link key={p.id} to={`/products/${p.slug}`} className="glass-card rounded-2xl overflow-hidden group hover:border-volt/50 transition-all duration-300 flex flex-col h-full border border-dark-2">
                  <div className="relative aspect-[4/3] bg-dark-2/30 p-6 flex items-center justify-center overflow-hidden">
                    <ProductImage 
                      src={p.images[0]} 
                      alt={p.name} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                    />
                    {p.isNew && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="volt" className="shadow-lg">New</Badge>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant="volt" className="bg-dark-1/80 backdrop-blur-md shadow-lg">{p.brand}</Badge>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow border-t border-dark-2/50">
                    <div className="text-xs text-dark-3 font-medium uppercase tracking-wider mb-2">
                      {p.category}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-volt transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-dark-4 text-sm mb-4 line-clamp-2 flex-grow">
                      {p.shortDescription}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-dark-2/50">
                      <span className="text-sm font-medium text-dark-3">View Details</span>
                      <div className="w-8 h-8 rounded-full bg-dark-2 flex items-center justify-center text-white group-hover:bg-volt group-hover:text-dark-0 transition-colors">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* CTA Section */}
      <Section id="cta" className="bg-dark-0 relative overflow-hidden border-t border-dark-1">
        <div className="grid-bg opacity-30"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto animate-stagger">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Need this product?</h2>
            <p className="text-dark-4 text-lg mb-10">
              Get in touch with us for pricing, bulk orders, or technical details regarding the {product.name}.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a href={getProductEnquiryUrl(product.name)} target="_blank" rel="noopener noreferrer" className="btn-primary py-4 px-8 w-full sm:w-auto justify-center text-lg">
                Enquire Now
              </a>
              <a href={getWhatsAppUrl(`I need more information about ${product.name}.`)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp py-4 px-8 w-full sm:w-auto justify-center text-lg">
                <MessageCircle size={20} className="mr-2" />
                WhatsApp
              </a>
              <a href={getPhoneUrl()} className="btn-secondary py-4 px-8 w-full sm:w-auto justify-center text-lg">
                <Phone size={20} className="mr-2" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
