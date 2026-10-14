import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, Search, RotateCcw } from 'lucide-react';
import { Product, Category, FilterOptions } from '../types';
import { dbService } from '../services/db';
import { ProductCard } from '../components/shop/ProductCard';
import { QuickViewModal } from '../components/shop/QuickViewModal';
import { SizeGuideModal } from '../components/shop/SizeGuideModal';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get('brand') || '');
  const [selectedSize, setSelectedSize] = useState<string>(searchParams.get('size') || '');
  const [inStockOnly, setInStockOnly] = useState<boolean>(searchParams.get('stock') === 'true');
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(searchParams.get('sale') === 'true');
  const [newDropsOnly, setNewDropsOnly] = useState<boolean>(searchParams.get('filter') === 'new');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState<FilterOptions['sortBy']>('featured');

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    dbService.getCategories().then(setCategories);
  }, []);

  // Update URL params when state changes
  useEffect(() => {
    const params: Record<string, string> = {};
    if (selectedCategory) params.category = selectedCategory;
    if (selectedBrand) params.brand = selectedBrand;
    if (selectedSize) params.size = selectedSize;
    if (inStockOnly) params.stock = 'true';
    if (onSaleOnly) params.sale = 'true';
    if (newDropsOnly) params.filter = 'new';
    if (searchQuery) params.q = searchQuery;
    setSearchParams(params, { replace: true });
  }, [selectedCategory, selectedBrand, selectedSize, inStockOnly, onSaleOnly, newDropsOnly, searchQuery, setSearchParams]);

  // Fetch filtered products
  useEffect(() => {
    setLoading(true);
    const filterOptions: FilterOptions = {
      categorySlug: selectedCategory || undefined,
      brand: selectedBrand || undefined,
      size: selectedSize || undefined,
      inStockOnly: inStockOnly || undefined,
      onSaleOnly: onSaleOnly || undefined,
      newDropsOnly: newDropsOnly || undefined,
      searchQuery: searchQuery || undefined,
      sortBy: sortBy
    };

    dbService.getProducts(filterOptions).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [selectedCategory, selectedBrand, selectedSize, inStockOnly, onSaleOnly, newDropsOnly, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedSize('');
    setInStockOnly(false);
    setOnSaleOnly(false);
    setNewDropsOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters = Boolean(
    selectedCategory || selectedBrand || selectedSize || inStockOnly || onSaleOnly || newDropsOnly || searchQuery
  );

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F2EC] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-b border-white/10 pb-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-mono block mb-2">
                OFFICIAL CATALOGUE
              </span>
              <h1 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-wider font-extrabold leading-none">
                ALL MERCHANDISE
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-sans mt-3 max-w-xl">
                Browse official streetwear, heavyweight hoodies, vintage tees, and collectible merchandise engineered for music connoisseurs across South Africa.
              </p>
            </div>

            {/* Live Search and Mobile Filter Toggle */}
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by name..."
                  className="w-full bg-[#121212] border border-white/15 pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 rounded-xs focus:outline-none focus:border-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center space-x-2 px-3 py-2 bg-[#141414] border border-white/20 text-xs uppercase font-mono rounded-xs text-white"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Controls Toolbar: Active Count & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 text-xs border-b border-white/5 mb-8">
          <div className="flex items-center space-x-3 text-neutral-400 font-mono">
            <span>
              Showing <strong className="text-white">{products.length}</strong> items
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center space-x-1 text-white/70 hover:text-white underline underline-offset-2 ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-white/40 uppercase font-mono text-[11px]">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as FilterOptions['sortBy'])}
              className="bg-[#121212] border border-white/15 text-white text-xs px-3 py-1.5 rounded-xs focus:outline-none focus:border-white"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">Newest Drops First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="alphabetical">Alphabetical (A – Z)</option>
            </select>
          </div>
        </div>

        {/* Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-8 pr-4">
            {/* Categories */}
            <div>
              <h3 className="font-display tracking-widest text-sm uppercase text-white font-bold mb-3 pb-2 border-b border-white/10">
                Categories
              </h3>
              <div className="space-y-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className={`block w-full text-left py-1 transition-colors ${
                    !selectedCategory ? 'text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`block w-full text-left py-1 transition-colors ${
                      selectedCategory === c.slug ? 'text-white font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Collection */}
            <div>
              <h3 className="font-display tracking-widest text-sm uppercase text-white font-bold mb-3 pb-2 border-b border-white/10">
                Brand Label
              </h3>
              <div className="space-y-1.5 text-xs">
                {['', 'The Connoisseurs Show', 'Vintage Connoisseurs'].map((b) => (
                  <button
                    key={b || 'all'}
                    type="button"
                    onClick={() => setSelectedBrand(b)}
                    className={`block w-full text-left py-1 transition-colors ${
                      selectedBrand === b ? 'text-white font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {b || 'All Labels'}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h3 className="font-display tracking-widest text-sm uppercase text-white font-bold mb-3 pb-2 border-b border-white/10">
                Size
              </h3>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'].map((s) => {
                  const isSel = selectedSize === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(isSel ? '' : s)}
                      className={`py-1.5 text-center rounded-xs border transition-colors ${
                        isSel
                          ? 'bg-white text-black border-white font-bold'
                          : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Availability & Toggles */}
            <div className="space-y-3 pt-2">
              <h3 className="font-display tracking-widest text-sm uppercase text-white font-bold mb-3 pb-2 border-b border-white/10">
                Availability &amp; Status
              </h3>
              <label className="flex items-center space-x-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded bg-[#121212] border-white/20 text-white focus:ring-0"
                />
                <span>In Stock Only</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newDropsOnly}
                  onChange={(e) => setNewDropsOnly(e.target.checked)}
                  className="rounded bg-[#121212] border-white/20 text-white focus:ring-0"
                />
                <span>New Drops Only</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                  className="rounded bg-[#121212] border-white/20 text-white focus:ring-0"
                />
                <span>Special Sale Prices</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area (3 cols on desktop, total 4 cols layout) */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-[#141414] animate-pulse rounded-xs" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center bg-[#0d0d0d] border border-white/5 rounded-xs p-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/40">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl uppercase tracking-wider text-white mb-2">
                  NO MERCHANDISE MATCHES YOUR FILTERS
                </h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6">
                  Try adjusting or clearing your active filters to see all available apparel and accessories.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-6 py-3 bg-white text-black font-display tracking-widest text-sm uppercase font-bold hover:bg-neutral-200 transition-colors rounded-xs"
                >
                  CLEAR ALL FILTERS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#121212] border-l border-white/10 h-full p-6 flex flex-col justify-between overflow-y-auto z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="font-display text-lg uppercase tracking-wider text-white">
                  FILTER MERCHANDISE
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <span className="text-xs font-mono uppercase text-white/50 block mb-2">
                  Category
                </span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 text-white text-xs px-3 py-2 rounded-xs"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size */}
              <div>
                <span className="text-xs font-mono uppercase text-white/50 block mb-2">
                  Size
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(selectedSize === s ? '' : s)}
                      className={`py-1.5 text-xs font-mono rounded border ${
                        selectedSize === s
                          ? 'bg-white text-black border-white'
                          : 'border-white/10 text-white/70 bg-white/5'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2">
                <label className="flex items-center space-x-2 text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={newDropsOnly}
                    onChange={(e) => setNewDropsOnly(e.target.checked)}
                  />
                  <span>New Drops Only</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={onSaleOnly}
                    onChange={(e) => setOnSaleOnly(e.target.checked)}
                  />
                  <span>Sale Items</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-white text-black font-display uppercase tracking-widest font-bold text-sm"
              >
                SHOW {products.length} RESULTS
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="w-full py-2 text-xs text-white/60 hover:text-white"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
      />

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
};
