import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  X, 
  Download, 
  ShieldCheck, 
  Star
} from 'lucide-react';
import { useAdminStore } from '../data/adminStore';
import { AdminBreadcrumbs, ConfirmationModal } from '../components/AdminUI';
import { type Product } from '../../data';
import { useAuth } from '../context/AuthContext';

export const AdminProducts: React.FC = () => {
  const { products, categories, brands, deleteProduct, toggleProductStock, toggleProductFeatured } = useAdminStore();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [featuredFilter, setFeaturedFilter] = useState<'ALL' | 'FEATURED'>('ALL');
  
  // Modals
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  const canEdit = hasPermission('products.edit');
  const canDelete = hasPermission('products.delete');
  const canCreate = hasPermission('products.create');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = searchQuery === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = selectedCategory === '' || p.categorySlug === selectedCategory;
      const matchBrand = selectedBrand === '' || p.brandSlug === selectedBrand;
      const matchStock = stockFilter === 'ALL' || (stockFilter === 'IN_STOCK' ? p.inStock : !p.inStock);
      const matchFeatured = featuredFilter === 'ALL' || p.isFeatured;

      return matchSearch && matchCat && matchBrand && matchStock && matchFeatured;
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, stockFilter, featuredFilter]);

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Brand', 'Category', 'InStock', 'Featured', 'SpecsCount'];
    const rows = filteredProducts.map(p => [
      p.id,
      `"${p.name}"`,
      p.brand,
      p.category,
      p.inStock ? 'Yes' : 'No',
      p.isFeatured ? 'Yes' : 'No',
      p.specifications?.length || 0
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `saienterprises_products_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <AdminBreadcrumbs items={[{ label: 'Admin' }, { label: 'Inventory & Products', active: true }]} />

      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Product Catalogue</h1>
            <span className="px-3 py-1 rounded-full bg-volt/15 text-volt border border-volt/30 text-xs font-black">
              {products.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage modular switches, wires, cables, DBs, lighting and authorized inventory
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="btn-secondary py-2.5 px-4 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-1.5"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-volt" />
            <span>Export CSV</span>
          </button>

          {canCreate && (
            <Link
              to="/admin/products/new"
              className="btn-primary py-2.5 px-5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card rounded-3xl p-4 sm:p-5 border border-white/10 shadow-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by title, brand, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-volt/50"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
              className="w-full bg-dark-2 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-volt/50"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              aria-label="Filter by brand"
              className="w-full bg-dark-2 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-volt/50"
            >
              <option value="">All Brands</option>
              {brands.map(b => <option key={b.id} value={b.slug}>{b.name}</option>)}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              aria-label="Filter by stock status"
              className="w-full bg-dark-2 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-volt/50"
            >
              <option value="ALL">All Stock Statuses</option>
              <option value="IN_STOCK">In Stock Only</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Active Filters Row */}
        {(searchQuery || selectedCategory || selectedBrand || stockFilter !== 'ALL' || featuredFilter !== 'ALL') && (
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400">
            <span>Found <strong>{filteredProducts.length}</strong> matching products</span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedBrand('');
                setStockFilter('ALL');
                setFeaturedFilter('ALL');
              }}
              className="text-volt hover:underline font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Products Data Table */}
      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-4 px-5">Product Details</th>
                <th className="py-4 px-4">Brand</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4 text-center">In Stock</th>
                <th className="py-4 px-4 text-center">Featured</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                    {/* Image & Title */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-dark-2 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                          {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-volt/50" />
                          )}
                        </div>
                        <div>
                          <div className="font-extrabold text-white text-sm group-hover:text-volt transition-colors line-clamp-1">
                            {product.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            /{product.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 font-bold text-xs ${
                        product.brandSlug === 'pmcona' ? 'text-cyan-300 font-black' : 'text-slate-200'
                      }`}>
                        {product.brand}
                        {product.brandSlug === 'pmcona' && <ShieldCheck className="w-3 h-3 text-volt" />}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {product.category}
                    </td>

                    {/* Stock Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleProductStock(product.id)}
                        disabled={!canEdit}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border transition-all ${
                          product.inStock
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleProductFeatured(product.id)}
                        disabled={!canEdit}
                        className={`p-1.5 rounded-xl border transition-all ${
                          product.isFeatured
                            ? 'bg-volt/20 text-volt border-volt/40'
                            : 'bg-white/5 text-slate-600 border-white/5 hover:text-slate-400'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${product.isFeatured ? 'fill-volt' : ''}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewProduct(product)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                          title="Quick View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {canEdit && (
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="p-2 rounded-xl bg-white/5 hover:bg-volt/20 text-slate-300 hover:text-volt transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No products found matching your current search and filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmationModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            if (deleteTarget) deleteProduct(deleteTarget.id);
          }}
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This product will be immediately removed from the customer-facing catalogue.`}
          confirmText="Yes, Delete Product"
          variant="danger"
        />
      )}

      {/* Quick View Product Modal */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-volt uppercase tracking-wider">{previewProduct.category}</span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">{previewProduct.name}</h3>
                <div className="text-xs text-slate-400">Brand: <strong className="text-white">{previewProduct.brand}</strong></div>
              </div>
              <button onClick={() => setPreviewProduct(null)} className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div className="aspect-square rounded-2xl bg-dark-2 border border-white/10 overflow-hidden flex items-center justify-center">
                {previewProduct.images && previewProduct.images[0] ? (
                  <img src={previewProduct.images[0]} alt={previewProduct.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-12 h-12 text-volt" />
                )}
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="font-bold text-slate-300 uppercase mb-1">Description</div>
                  <p className="text-slate-400 leading-relaxed font-normal">{previewProduct.description}</p>
                </div>

                {previewProduct.specifications && (
                  <div>
                    <div className="font-bold text-volt uppercase mb-1">Specifications</div>
                    <div className="space-y-1">
                      {previewProduct.specifications.map((spec: any, i: number) => (
                        <div key={i} className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-slate-400">{spec.label || spec[0]}:</span>
                          <span className="font-bold text-white">{spec.value || spec[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setPreviewProduct(null)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white/5 text-slate-300"
              >
                Close
              </button>
              {canEdit && (
                <button
                  onClick={() => {
                    const id = previewProduct.id;
                    setPreviewProduct(null);
                    navigate(`/admin/products/${id}/edit`);
                  }}
                  className="btn-primary py-2.5 px-6 rounded-full text-xs font-bold shadow-lg"
                >
                  Edit Full Details
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
