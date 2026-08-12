import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, Package, SlidersHorizontal, LayoutGrid, List, Check, MessageCircle, Eye, ShieldCheck } from 'lucide-react';
import { Section, SectionHeader, ProductImage, Badge, EmptyState, useScrollReveal } from '../components/ui';
import { products, categories, brands, getProductEnquiryUrl } from '../data';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialBrand = searchParams.get('brand') || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quickViewProduct, setQuickViewProduct] = useState<typeof products[0] | null>(null);

  const headerRef = useScrollReveal<HTMLDivElement>();
  const gridRef = useScrollReveal<HTMLDivElement>();

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedBrand) params.set('brand', selectedBrand);
    setSearchParams(params);
  }, [selectedCategory, selectedBrand, setSearchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === '' || product.categorySlug === selectedCategory;
      const matchesBrand = selectedBrand === '' || product.brandSlug === selectedBrand;
      const matchesStock = !inStockOnly || product.inStock;

      return matchesSearch && matchesCategory && matchesBrand && matchesStock;
    });
  }, [searchQuery, selectedCategory, selectedBrand, inStockOnly]);

  const activeFiltersCount = (selectedCategory ? 1 : 0) + (selectedBrand ? 1 : 0) + (searchQuery ? 1 : 0) + (inStockOnly ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setInStockOnly(false);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      {/* Header & Hero */}
      <Section className="!pt-8 !pb-4">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-6">
          <SectionHeader 
            label="Catalogue & Inventory" 
            title="Genuine Electrical Supplies" 
            subtitle="Explore electrical switches, cables, DBs, LEDs & accessories from certified brands like PMCona, Havells & Polycab." 
          />
        </div>
      </Section>

      {/* STICKY E-COMMERCE CONTROL & FILTER BAR */}
      <div className="sticky top-[72px] z-30 bg-dark-0/95 backdrop-blur-xl border-y border-white/10 py-3 shadow-2xl">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Top Row / Search & Filter Drawer Trigger */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="btn-primary py-2.5 px-4 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter & Refine</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-dark-0 text-volt text-[11px] font-extrabold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Search Bar */}
            <div className="relative flex-grow md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-volt/70" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-8 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-volt/50 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Horizontal Scrollable Category Pills Bar (Non-blocking touch scroll) */}
          <div className="flex items-center gap-2 overflow-x-auto snap-x no-scrollbar w-full md:w-auto py-1">
            <button
              onClick={() => setSelectedCategory('')}
              className={`snap-start flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === '' 
                  ? 'bg-volt text-dark-0 shadow-[0_0_10px_rgba(0,229,255,0.4)]' 
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug === selectedCategory ? '' : cat.slug)}
                className={`snap-start flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat.slug 
                    ? 'bg-volt text-dark-0 font-bold shadow-[0_0_10px_rgba(0,229,255,0.4)]' 
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* View Mode & Count */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <span className="text-xs text-slate-300 font-medium">
              <strong className="text-white">{filteredProducts.length}</strong> items
            </span>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-volt text-dark-0' : 'text-slate-400 hover:text-white'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-volt text-dark-0' : 'text-slate-400 hover:text-white'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Active Filters Pill Strip */}
      {activeFiltersCount > 0 && (
        <div className="container mx-auto px-4 mt-4 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider">Active Filters:</span>
          {selectedCategory && (
            <span className="px-3 py-1 rounded-full bg-volt/15 text-volt border border-volt/30 font-semibold flex items-center gap-1">
              Category: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
              <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedCategory('')} />
            </span>
          )}
          {selectedBrand && (
            <span className="px-3 py-1 rounded-full bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 font-semibold flex items-center gap-1">
              Brand: {brands.find(b => b.slug === selectedBrand)?.name || selectedBrand}
              <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedBrand('')} />
            </span>
          )}
          {inStockOnly && (
            <span className="px-3 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/30 font-semibold flex items-center gap-1">
              In Stock Only
              <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setInStockOnly(false)} />
            </span>
          )}
          <button onClick={clearFilters} className="text-volt hover:underline font-bold ml-2">
            Clear All
          </button>
        </div>
      )}

      {/* PRODUCTS DISPLAY GRID / LIST */}
      <Section className="!pt-6">
        <div ref={gridRef}>
          {filteredProducts.length > 0 ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className={`glass-card rounded-3xl overflow-hidden flex flex-col group border border-white/10 hover:border-volt/40 transition-all duration-300 shadow-xl ${
                    viewMode === 'list' ? 'sm:flex-row items-center' : ''
                  }`}
                >
                  <div className={`relative overflow-hidden bg-dark-2 shrink-0 ${viewMode === 'list' ? 'w-full sm:w-64 aspect-[4/3]' : 'aspect-[4/3]'}`}>
                    <ProductImage 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {product.isNew && <Badge variant="volt">NEW</Badge>}
                      {!product.inStock && <Badge variant="amber">OUT OF STOCK</Badge>}
                      {product.inStock && !product.isNew && <Badge variant="green">IN STOCK</Badge>}
                    </div>
                    <div className="absolute top-4 right-4 liquid-glass px-3 py-1 rounded-full text-xs font-extrabold text-white backdrop-blur-md border border-white/20">
                      {product.brand}
                    </div>

                    {/* Quick View Floating Button */}
                    <button 
                      onClick={() => setQuickViewProduct(product)}
                      className="absolute bottom-4 right-4 p-2.5 rounded-full bg-dark-0/80 text-volt hover:bg-volt hover:text-dark-0 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg border border-white/10"
                      title="Quick Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow w-full">
                    <p className="text-xs text-volt font-extrabold tracking-wider uppercase mb-1.5 flex items-center justify-between">
                      <span>{product.category}</span>
                      <span className="text-slate-400 font-normal">{product.brand}</span>
                    </p>
                    <Link to={`/products/${product.slug}`}>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-volt transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-slate-300 text-sm mb-6 flex-grow line-clamp-2 font-normal leading-relaxed">
                      {product.shortDescription}
                    </p>
                    
                    <div className="flex gap-2.5 mt-auto pt-2">
                      <Link 
                        to={`/products/${product.slug}`}
                        className="btn-primary flex-1 py-3 rounded-full justify-center text-xs sm:text-sm font-bold shadow-lg"
                      >
                        View Details
                      </Link>
                      <a 
                        href={getProductEnquiryUrl(product.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp flex-1 py-3 rounded-full justify-center text-xs sm:text-sm font-bold gap-1.5"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Enquire
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={<Package className="w-12 h-12 text-volt" />}
              title="No matching electrical products"
              description="Try adjusting your filters or clearing your search term."
            />
          )}
        </div>
      </Section>

      {/* MOBILE BOTTOM SHEET FILTER MODAL */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => setIsMobileFilterOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-dark-1 border-t border-white/20 rounded-t-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto animate-bottom-sheet z-10">
            {/* Drag Bar */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-volt" /> Filter Catalogue
                </h3>
                <p className="text-xs text-slate-300 mt-1 font-normal">Select category, brand, or availability</p>
              </div>
              <button 
                onClick={() => setIsMobileFilterOpen(false)} 
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Category Filter Pills Grid */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 block">
                  Product Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold text-left transition-all ${
                      selectedCategory === '' 
                        ? 'bg-volt text-dark-0 font-extrabold shadow-[0_0_12px_rgba(0,229,255,0.4)]' 
                        : 'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug === selectedCategory ? '' : cat.slug)}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between ${
                        selectedCategory === cat.slug 
                          ? 'bg-volt text-dark-0 font-extrabold shadow-[0_0_12px_rgba(0,229,255,0.4)]' 
                          : 'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {selectedCategory === cat.slug && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 block">
                  Manufacturer / Brand
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedBrand('')}
                    className={`py-2 px-3.5 rounded-full text-xs font-bold transition-all ${
                      selectedBrand === '' 
                        ? 'bg-volt text-dark-0 font-extrabold shadow-[0_0_10px_rgba(0,229,255,0.4)]' 
                        : 'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBrand(b.slug === selectedBrand ? '' : b.slug)}
                      className={`py-2 px-3.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                        selectedBrand === b.slug 
                          ? 'bg-volt text-dark-0 font-extrabold shadow-[0_0_10px_rgba(0,229,255,0.4)]' 
                          : b.slug === 'pmcona'
                          ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-400/30'
                          : 'bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {b.name}
                      {b.isAuthorized && <ShieldCheck className="w-3 h-3 text-volt" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <div className="text-sm font-bold text-white">In Stock Only</div>
                  <div className="text-xs text-slate-400">Show only ready-to-dispatch products</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-5 h-5 accent-volt cursor-pointer"
                />
              </div>

              {/* Action Bar */}
              <div className="pt-4 flex gap-3 border-t border-white/10">
                <button
                  onClick={clearFilters}
                  className="btn-secondary flex-1 py-3.5 rounded-full text-xs font-bold text-white border border-white/10"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="btn-primary flex-1 py-3.5 rounded-full text-xs font-bold shadow-xl"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* QUICK VIEW PRODUCT MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-dark-1 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setQuickViewProduct(null)} 
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              <div className="aspect-square rounded-2xl overflow-hidden bg-dark-2 border border-white/10 relative">
                <ProductImage src={quickViewProduct.images[0]} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  {quickViewProduct.inStock ? <Badge variant="green">IN STOCK</Badge> : <Badge variant="amber">OUT OF STOCK</Badge>}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-volt font-bold uppercase tracking-wider">{quickViewProduct.category}</span>
                  <h3 className="text-xl font-extrabold text-white mt-1">{quickViewProduct.name}</h3>
                  <div className="text-xs text-slate-300 mt-1">Brand: <strong className="text-white">{quickViewProduct.brand}</strong></div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed font-normal">{quickViewProduct.description}</p>

                {quickViewProduct.specifications && (
                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <div className="text-xs font-bold text-volt uppercase">Specifications:</div>
                    {quickViewProduct.specifications.slice(0, 4).map((spec: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-xs py-1 border-b border-white/5">
                        <span className="text-slate-300 font-semibold">{spec.label || 'N/A'}:</span>
                        <span className="text-white font-bold">{spec.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <a 
                    href={getProductEnquiryUrl(quickViewProduct.name)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-whatsapp w-full py-3 rounded-full text-xs font-bold flex justify-center items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> Enquire on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
