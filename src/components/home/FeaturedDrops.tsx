import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { dbService } from '../../services/db';
import { ProductCard } from '../shop/ProductCard';
import { QuickViewModal } from '../shop/QuickViewModal';
import { SizeGuideModal } from '../shop/SizeGuideModal';

export const FeaturedDrops: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    dbService.getProducts().then((data) => {
      // Prioritize featured products
      const featured = data.filter((p) => p.featured);
      setProducts(featured.length > 0 ? featured : data.slice(0, 4));
      setLoading(false);
    });
  }, []);

  return (
    <section className="py-24 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-[11px] uppercase tracking-[0.25em] text-[#777777] font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5 text-white/70" />
              <span>OFFICIAL APPAREL RELEASE</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-white uppercase tracking-wider font-bold">
              THE LATEST DROPS
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Link
              to="/shop"
              className="text-xs uppercase tracking-widest font-bold text-white hover:text-neutral-300 transition-colors flex items-center space-x-2 border-b border-white pb-1 group"
            >
              <span>VIEW FULL CATALOGUE</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Product Cards Grid: 4 columns on large, 2-3 on tablet, 2 on mobile */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-[#141414] animate-pulse rounded-xs" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}

        {/* Banner Footnote */}
        <div className="mt-14 p-6 bg-[#0f0f0f] border border-white/5 rounded-xs flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
          <div className="flex items-center space-x-4">
            <img
              src="/brand/vintage_connoisseurs_light.png"
              alt="Vintage Connoisseurs"
              className="h-7 w-auto object-contain opacity-80"
            />
            <p className="text-xs text-white/60 font-sans max-w-md">
              Need custom sizing guidance or styling advice? Consult our measurement standards or contact customer care.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            className="text-xs uppercase tracking-widest font-mono text-white/80 hover:text-white underline underline-offset-4"
          >
            Open Size Guide &rarr;
          </button>
        </div>
      </div>

      {/* Modals */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
      />

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </section>
  );
};
