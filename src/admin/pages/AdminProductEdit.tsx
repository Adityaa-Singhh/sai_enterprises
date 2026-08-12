import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Package, 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Eye, 
  Image as ImageIcon, 
  ShieldCheck
} from 'lucide-react';
import { useAdminStore } from '../data/adminStore';
import { AdminBreadcrumbs } from '../components/AdminUI';
import { type Product } from '../../data';

export const AdminProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, categories, brands, addProduct, updateProduct } = useAdminStore();

  const isEditMode = Boolean(id && id !== 'new');
  const existingProduct = products.find((p) => p.id === id);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([
    { label: 'Rating', value: '6A, 250V AC' },
    { label: 'Material', value: 'Polycarbonate' },
    { label: 'Warranty', value: '10 Years Replacement' },
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'specs' | 'media' | 'settings'>('basic');

  useEffect(() => {
    if (isEditMode && existingProduct) {
      setName(existingProduct.name);
      setSlug(existingProduct.slug);
      setBrand(existingProduct.brand);
      setCategory(existingProduct.category);
      setDescription(existingProduct.description || '');
      setShortDescription(existingProduct.shortDescription || '');
      setImageUrl(existingProduct.images?.[0] || '');
      setInStock(existingProduct.inStock ?? true);
      setIsFeatured(existingProduct.isFeatured ?? false);
      setIsNew(existingProduct.isNew ?? false);
      
      if (existingProduct.specifications && existingProduct.specifications.length > 0) {
        setSpecs(existingProduct.specifications.map((s: any) => ({
          label: s.label || s.key || s[0] || 'Property',
          value: s.value || s[1] || ''
        })));
      }
    } else if (!isEditMode) {
      // Default presets
      if (categories[0]) setCategory(categories[0].name);
      if (brands[0]) setBrand(brands[0].name);
    }
  }, [id, existingProduct, isEditMode, categories, brands]);

  // Auto-generate slug when name changes in new mode
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditMode) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { label: '', value: '' }]);
  };

  const handleUpdateSpec = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCatObj = categories.find(c => c.name === category) || categories[0];
    const selectedBrandObj = brands.find(b => b.name === brand) || brands[0];

    const cleanSpecs = specs.filter(s => s.label.trim() !== '' && s.value.trim() !== '');

    const productPayload: Omit<Product, 'id'> = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand,
      brandSlug: selectedBrandObj ? selectedBrandObj.slug : 'pmcona',
      category,
      categorySlug: selectedCatObj ? selectedCatObj.slug : 'switches',
      description,
      shortDescription: shortDescription || description.slice(0, 80),
      inStock,
      isFeatured,
      isNew,
      images: imageUrl ? [imageUrl] : ['/images/products/placeholder.jpg'],
      specifications: cleanSpecs,
      tags: [category.toLowerCase(), brand.toLowerCase(), 'electrical', 'certified'],
    };

    if (isEditMode && id) {
      updateProduct(id, productPayload);
    } else {
      addProduct(productPayload);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      navigate('/admin/products');
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <AdminBreadcrumbs
        items={[
          { label: 'Admin' },
          { label: 'Products', href: '/admin/products' },
          { label: isEditMode ? `Edit: ${name || 'Product'}` : 'Add New Product', active: true },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isEditMode ? 'Edit Product' : 'Add New Electrical Product'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {isEditMode ? `Editing ID: ${id}` : 'Fill in specifications to publish to live catalogue'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="btn-primary py-3 px-6 rounded-full font-bold text-xs flex items-center gap-2 shadow-xl"
        >
          <Save className="w-4 h-4" />
          <span>Save & Publish</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 animate-scale-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">Product successfully saved to Sai Enterprises catalogue! Redirecting...</span>
        </div>
      )}

      {/* Main Edit Form + Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Tabs & Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs Bar */}
          <div className="flex items-center gap-2 bg-dark-1 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeTab === 'basic' ? 'bg-volt text-dark-0 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Basic Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeTab === 'specs' ? 'bg-volt text-dark-0 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Specifications ({specs.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeTab === 'media' ? 'bg-volt text-dark-0 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              3. Media & Image
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeTab === 'settings' ? 'bg-volt text-dark-0 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              4. Inventory & Badges
            </button>
          </div>

          {/* Tab 1: Basic Information */}
          {activeTab === 'basic' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 shadow-xl">
              <h3 className="text-lg font-bold text-white tracking-tight border-b border-white/10 pb-3">
                General Product Information
              </h3>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. PMCona 6A 1-Way Modular Switch"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Brand *
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-dark-2 border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-volt/50"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-dark-2 border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-volt/50"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  URL Slug
                </label>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-slate-400">
                  <span>/products/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="bg-transparent text-white font-mono flex-grow focus:outline-none ml-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Short One-Line Summary
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Ultra-durable modular switch with antimicrobial polycarbonate frame."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Detailed Product Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the electrical product, applications, build quality, and features..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Specifications Manager */}
          {activeTab === 'specs' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">Key Technical Specifications</h3>
                  <p className="text-xs text-slate-400">Displayed in high-contrast specification tables for buyers</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="btn-secondary py-1.5 px-3 rounded-full text-xs font-bold text-volt border border-volt/30 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Property
                </button>
              </div>

              <div className="space-y-3">
                {specs.map((s, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Property (e.g. Current, Voltage)"
                      value={s.label}
                      onChange={(e) => handleUpdateSpec(index, 'label', e.target.value)}
                      className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 16A, 240V AC)"
                      value={s.value}
                      onChange={(e) => handleUpdateSpec(index, 'value', e.target.value)}
                      className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(index)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Media & Image */}
          {activeTab === 'media' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 shadow-xl">
              <h3 className="text-lg font-bold text-white tracking-tight border-b border-white/10 pb-3">
                Product Image & Media
              </h3>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Primary Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or /images/products/switch.jpg"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-volt/50"
                  />
                </div>
              </div>

              {/* Sample Preset Images for Fast Demo */}
              <div className="pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase mb-2">Or select from curated electrical presets:</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'PMCona Switch', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80' },
                    { label: 'Polycab Wire', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80' },
                    { label: 'LED Panel', url: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=600&auto=format&fit=crop&q=80' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 hover:text-white truncate text-center"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Inventory & Badges */}
          {activeTab === 'settings' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-xl">
              <h3 className="text-lg font-bold text-white tracking-tight border-b border-white/10 pb-3">
                Inventory Status & Homepage Badges
              </h3>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-white">In Stock Status</div>
                    <div className="text-[11px] text-slate-400">Controls 'In Stock' green badge on product cards</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-white">Feature on Homepage</div>
                    <div className="text-[11px] text-slate-400">Showcases this product in Featured Products carousel</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-white">Mark as New Arrival</div>
                    <div className="text-[11px] text-slate-400">Displays 'NEW' glowing volt badge</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Live Public Website Preview Card */}
        <div className="space-y-4">
          <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-volt" /> Live Card Preview
          </div>

          <div className="glass-card rounded-3xl p-5 border border-white/15 shadow-2xl space-y-4">
            <div className="aspect-square rounded-2xl bg-dark-2 border border-white/10 overflow-hidden relative flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} alt={name || 'Preview'} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-12 h-12 text-volt/40" />
              )}
              {isFeatured && (
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-volt text-dark-0 shadow-md">
                  FEATURED
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-bold text-volt uppercase tracking-wider flex items-center gap-1">
                {brand || 'Brand'}
                {brand === 'PMCona' && <ShieldCheck className="w-3 h-3" />}
              </div>
              <h4 className="font-extrabold text-white text-sm line-clamp-1">{name || 'Product Title'}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 font-normal">{description || 'Product description will appear here...'}</p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                inStock ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}>
                {inStock ? 'In Stock' : 'Out of Stock'}
              </span>
              <span className="text-[11px] text-slate-400">{category || 'Category'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
