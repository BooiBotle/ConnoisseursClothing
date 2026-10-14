import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Product, Category } from '../types';
import { dbService } from '../services/db';
import { ProductCard } from '../components/shop/ProductCard';
import { QuickViewModal } from '../components/shop/QuickViewModal';
import { SizeGuideModal } from '../components/shop/SizeGuideModal';

export const CollectionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    dbService.getCategories().then((cats) => {
      const found = cats.find((c) => c.slug === slug);
      setCategory(found || null);

      dbService.getProducts({ categorySlug: slug }).then((prods) => {
        setProducts(prods);
        setLoading(false);
      });
    });
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F2EC] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Back Link */}
        <div className="mb-6">
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-mono text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO ALL MERCHANDISE</span>
          </Link>
        </div>

        {/* Collection Editorial Banner */}
        <div className="relative rounded-sm overflow-hidden border border-white/10 bg-[#121212] p-8 sm:p-12 mb-12 shadow-2xl">
          {category?.image_url && (
            <div className="absolute inset-0 z-0 opacity-25">
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-full object-cover filter grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/80 to-transparent" />
            </div>
          )}

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center space-x-2 text-[11px] uppercase tracking-[0.25em] text-[#777777] font-mono">
              <Sparkles className="w-3.5 h-3.5 text-white/70" />
              <span>THE CONNOISSEURS CAPSULE</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-wider font-extrabold leading-none">
              {category?.name || 'COLLECTION DROP'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
              {category?.description ||
                'Curated vintage streetwear and music culture merchandise produced with heavyweight textiles.'}
            </p>
          </div>
        </div>

        {/* Collection Products Grid */}
        <div className="mb-6 flex items-center justify-between text-xs font-mono text-white/50">
          <span>{products.length} Items in this archive</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-[#141414] animate-pulse rounded-xs" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center bg-[#0d0d0d] border border-white/5 rounded-xs p-8">
            <h3 className="font-display text-2xl uppercase tracking-wider text-white mb-2">
              NO MERCHANDISE CURRENTLY IN THIS ARCHIVE
            </h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6">
              New drops for this collection are currently in production. Explore our full merchandise catalogue in the meantime.
            </p>
            <Link
              to="/shop"
              className="px-6 py-3 bg-white text-black font-display tracking-widest text-sm uppercase font-bold hover:bg-neutral-200 transition-colors rounded-xs inline-block"
            >
              BROWSE ALL MERCHANDISE
            </Link>
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
      </div>

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
