import { useState } from 'react';
import { Filter, Image as ImageIcon } from 'lucide-react';
import { Section, SectionHeader, ProductImage, Lightbox, Badge, useScrollReveal } from '../components/ui';
import { useAdminStore } from '../admin/data/adminStore';

export default function Gallery() {
  const { gallery: galleryImages, businessInfo } = useAdminStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);
  
  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(galleryImages.map(img => img.category)))];

  const filteredImages = activeFilter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeFilter);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <Section id="gallery-header" className="!pt-8 !pb-12" ref={headerRef}>
        <SectionHeader 
          label="Our Gallery" 
          title={`See ${businessInfo.name} in Action`} 
          subtitle="Explore our store, products, and the trusted brands we carry."
        />
        
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeFilter === category 
                  ? 'bg-volt text-dark-0 font-bold shadow-[0_0_15px_rgba(0,229,255,0.4)]' 
                  : 'liquid-glass text-slate-200 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <span className="capitalize">{category}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section id="gallery-grid" className="!pt-0" ref={gridRef}>
        {filteredImages.length > 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filteredImages.map((image) => (
              <div 
                key={image.id}
                className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-3xl glass-card transition-all duration-300 border border-white/10 hover:border-volt/40 shadow-xl"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative overflow-hidden w-full h-full">
                  <ProductImage 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-auto object-cover img-zoom"
                  />
                  <div className="absolute inset-0 bg-dark-0/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                    <ImageIcon className="w-8 h-8 text-volt mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="text-white text-sm font-bold text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {image.alt}
                    </span>
                  </div>
                </div>
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <Badge variant="volt" className="capitalize text-xs px-2.5 py-1 rounded-full font-bold">{image.category}</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center glass-card rounded-3xl border border-white/10">
            <Filter className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Images Found</h3>
            <p className="text-slate-300 font-normal">Try selecting a different category.</p>
            <button 
              onClick={() => setActiveFilter('all')}
              className="mt-6 btn-ghost py-2.5 px-6 rounded-full text-volt hover:bg-volt/10"
            >
              Clear Filters
            </button>
          </div>
        )}
      </Section>

      {selectedImage && (
        <Lightbox
          src={selectedImage.src}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
