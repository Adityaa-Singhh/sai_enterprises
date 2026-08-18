import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Check, X, ShieldCheck, Truck, Phone, MessageCircle, Loader2 } from 'lucide-react';
import { getWhatsAppUrl, getPhoneUrl, getProductEnquiryUrl } from '../data';
import { Section, SectionHeader, ProductImage, Badge, EmptyState, useScrollReveal } from '../components/ui';
import { getProductBySlug, getPublishedProductsPaginated } from '../services/productService';
import { trackProductView, trackProductClick, trackWhatsAppClick, trackPhoneCallClick } from '../services/analyticsService';
import type { FirestoreProduct } from '../lib/firestore-types';
import SEO from '../components/SEO';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const revealRef = useScrollReveal<HTMLDivElement>();
  
  const [product, setProduct] = useState<FirestoreProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImage(0);
    
    let mounted = true;
    
    const fetchProductData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const fetchedProduct = await getProductBySlug(slug);
        
        if (mounted && fetchedProduct) {
          setProduct(fetchedProduct);
          trackProductView({
            id: fetchedProduct.id,
            name: fetchedProduct.name,
            category: fetchedProduct.category,
            brand: fetchedProduct.brand,
          });
          // Fetch related products (fetch 5 in case the current one is included)
          const { products: related } = await getPublishedProductsPaginated(
            null, 
            fetchedProduct.categorySlug, 
            '', 
            5
          );
          
          if (mounted) {
            setRelatedProducts(
              related.filter(p => p.id !== fetchedProduct.id).slice(0, 4)
            );
          }
        } else if (mounted) {
          setProduct(null);
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProductData();
    return () => { mounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-volt animate-spin mb-4" />
        <p className="text-slate-400">Loading product details...</p>
      </div>
    );
  }

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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || product.shortDescription,
    "image": product.images && product.images.length > 0 ? product.images[0] : "",
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "category": product.category,
    "sku": product.id,
    "url": `https://saienterprises.in/products/${product.slug}`
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://saienterprises.in/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://saienterprises.in/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.category,
        "item": `https://saienterprises.in/products?category=${product.categorySlug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": product.name,
        "item": `https://saienterprises.in/products/${product.slug}`
      }
    ]
  };

  const pageDescription = product.shortDescription || (product.description ? product.description.slice(0, 155) : "");

  return (
    <div className="pt-20 sm:pt-24 pb-0">
      <SEO 
        title={`${product.name} | ${product.brand} | Sai Enterprises Rourkela`}
        description={pageDescription}
        jsonLd={[productSchema, breadcrumbSchema]}
      />

      {/* Hero Section */}
      <Section id="product-detail" className="pt-2 sm:pt-4 pb-16">
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
                  {product.images.map((img: any, idx: number) => (
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
                <a
                  href={getProductEnquiryUrl(product.name)}
                  onClick={() => trackWhatsAppClick('product_detail_enquire', { productName: product.name })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex-1 justify-center py-4 rounded-full font-bold shadow-xl"
                >
                  Enquire Now
                </a>
                <a
                  href={getWhatsAppUrl(`Hi, I'm interested in the ${product.name}.`)}
                  onClick={() => trackWhatsAppClick('product_detail_whatsapp', { productName: product.name })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp flex-1 justify-center py-4 rounded-full font-bold shadow-xl"
                >
                  <MessageCircle size={20} className="mr-2" />
                  WhatsApp
                </a>
                <a
                  href={getPhoneUrl()}
                  onClick={() => trackPhoneCallClick('product_detail_call')}
                  className="btn-secondary flex-1 justify-center py-4 rounded-full font-bold"
                >
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
                  <div className={`grid grid-cols-1 ${product.sectionImages?.specs ? 'lg:grid-cols-2 gap-8' : ''}`}>
                    <div className="glass-card rounded-2xl overflow-hidden border border-white/15 shadow-xl">
                      {product.specifications.map((spec: any, index: number) => (
                        <div 
                          key={index} 
                          className={`flex flex-col sm:flex-row py-3.5 px-5 sm:px-6 border-b border-white/10 last:border-0 ${index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`}
                        >
                          <span className="text-cyan-400 sm:w-1/3 font-bold mb-1 sm:mb-0 text-sm tracking-wide">{spec.label}</span>
                          <span className="text-white sm:w-2/3 font-medium text-sm">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                    {product.sectionImages?.specs && (
                      <div className="rounded-2xl overflow-hidden border border-white/15 shadow-xl aspect-square sm:aspect-video lg:aspect-auto">
                        <ProductImage src={product.sectionImages.specs} alt={`${product.name} Specifications`} className="w-full h-full object-cover" />
                      </div>
                    )}
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

      {/* Promo Banner Section */}
      {product.sectionImages?.banner && (
        <Section className="py-0 relative overflow-hidden bg-dark-1 border-t border-dark-2">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative group bg-dark-2">
              <ProductImage src={product.sectionImages.banner} alt={`${product.name} Promo`} className="w-full h-auto min-h-[200px] max-h-[600px] object-cover" />
            </div>
          </div>
        </Section>
      )}

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
                <Link 
                  key={p.id}
                  to={`/products/${p.slug}`}
                  onClick={() => trackProductClick({ id: p.id, name: p.name, category: p.category, brand: p.brand }, 'related_products')}
                  className="glass-card rounded-2xl overflow-hidden group hover:border-volt/50 transition-all duration-300 flex flex-col h-full border border-white/10 bg-dark-2/90 hover:bg-dark-2 shadow-xl"
                >
                  <div className="relative aspect-[4/3] bg-dark-2/50 p-6 flex items-center justify-center overflow-hidden">
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
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow border-t border-white/10">
                    <div className="text-xs font-bold text-volt uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>{p.category}</span>
                      <span className="text-slate-400 font-semibold">{p.brand}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-volt transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-slate-300 text-sm mb-4 line-clamp-2 flex-grow font-normal leading-relaxed">
                      {p.shortDescription || p.description || ''}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                      <span className="text-sm font-semibold text-slate-300 group-hover:text-volt transition-colors">View Details</span>
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-volt group-hover:bg-volt group-hover:text-dark-0 transition-all">
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
      <Section id="cta" className="bg-dark-0 relative overflow-hidden border-t border-white/10">
        <div className="grid-bg opacity-30"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto animate-stagger">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Need this product?</h2>
            <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto font-normal leading-relaxed">
              Get in touch with us for instant pricing, bulk commercial supply, or technical assistance regarding <span className="text-white font-semibold">{product.name}</span>.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href={getProductEnquiryUrl(product.name)}
                onClick={() => trackWhatsAppClick('product_bottom_cta_enquire', { productName: product.name })}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary py-4 px-8 w-full sm:w-auto justify-center text-lg"
              >
                Enquire Now
              </a>
              <a
                href={getWhatsAppUrl(`I need more information about ${product.name}.`)}
                onClick={() => trackWhatsAppClick('product_bottom_cta_whatsapp', { productName: product.name })}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp py-4 px-8 w-full sm:w-auto justify-center text-lg"
              >
                <MessageCircle size={20} className="mr-2" />
                WhatsApp
              </a>
              <a 
                href={getPhoneUrl()} 
                onClick={() => trackPhoneCallClick('product_bottom_cta_call')}
                className="btn-secondary py-4 px-8 w-full sm:w-auto justify-center text-lg"
              >
                <Phone size={20} className="mr-2 text-volt" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
