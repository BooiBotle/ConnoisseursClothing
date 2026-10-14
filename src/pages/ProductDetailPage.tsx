import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Ruler,
  Check,
  ChevronDown,
  Sparkles,
  Share2
} from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { dbService } from '../services/db';
import { formatZAR } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { SizeGuideModal } from '../components/shop/SizeGuideModal';
import { ProductCard } from '../components/shop/ProductCard';

const RECENTLY_VIEWED_KEY = 'tcs_recently_viewed_v1';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Variant & purchase state
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [addFeedback, setAddFeedback] = useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Accordion tabs
  const [openAccordion, setOpenAccordion] = useState<'details' | 'shipping' | 'returns' | null>('details');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    dbService.getProductBySlug(slug).then(async (prod) => {
      setProduct(prod);
      if (prod) {
        // Select first variant with stock or first variant
        const inStock = prod.variants.find((v) => v.available_stock > 0);
        setSelectedVariant(inStock || prod.variants[0] || null);
        setQuantity(1);
        setActiveImageIdx(0);

        // Fetch related products
        const all = await dbService.getProducts();
        const related = all
          .filter((p) => p.id !== prod.id && (p.category_id === prod.category_id || p.brand_collection === prod.brand_collection))
          .slice(0, 4);
        setRelatedProducts(related);

        // Track recently viewed in localStorage
        try {
          const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
          let recIds: string[] = raw ? JSON.parse(raw) : [];
          recIds = [prod.id, ...recIds.filter((id) => id !== prod.id)].slice(0, 5);
          localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recIds));

          const recentProds = all.filter((p) => recIds.includes(p.id) && p.id !== prod.id);
          setRecentlyViewed(recentProds);
        } catch {
          // ignore
        }
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-white/40 font-mono text-sm tracking-widest uppercase animate-pulse">
          Loading Garment Archives...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] py-24 text-center px-4">
        <h2 className="font-display text-3xl uppercase tracking-wider text-white mb-4">
          PRODUCT ARCHIVE NOT FOUND
        </h2>
        <p className="text-xs text-white/50 mb-8 max-w-sm mx-auto">
          The requested product may have retired to our archives or been discontinued.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-white text-black font-display text-sm uppercase tracking-widest font-bold"
        >
          RETURN TO CATALOGUE
        </Link>
      </div>
    );
  }

  const activeVariants = product.variants.filter((v) => v.active);
  const currentVariant = selectedVariant || activeVariants[0];
  const maxStock = currentVariant ? currentVariant.available_stock : 0;
  const isSoldOut = maxStock <= 0;

  const handleAddToCart = () => {
    if (!currentVariant || isSoldOut) return;
    const res = addToCart(product, currentVariant, quantity);
    setAddFeedback(res.message);
    setTimeout(() => setAddFeedback(null), 3000);
  };

  const images = product.images.length > 0 ? product.images : [{ id: '1', product_id: product.id, image_url: '/products/hoodie_vintage_black_front.jpg', alt_text: product.name, display_order: 1 }];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F2EC] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-mono text-white/50 mb-8">
          <Link to="/" className="hover:text-white transition-colors">
            HOME
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-white transition-colors">
            SHOP
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/collections/${product.category.slug}`} className="hover:text-white transition-colors">
                {product.category.name.toUpperCase()}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-white truncate">{product.name.toUpperCase()}</span>
        </nav>

        {/* Product Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Image Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[3/4] w-full bg-[#141414] rounded-xs overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={images[activeImageIdx]?.image_url}
                alt={images[activeImageIdx]?.alt_text || product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Status Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.is_limited_edition && (
                  <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-amber-500 text-black font-bold rounded-xs shadow">
                    LIMITED DROP
                  </span>
                )}
                {product.is_new_drop && !product.is_limited_edition && (
                  <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-white text-black font-bold rounded-xs shadow">
                    NEW ARRIVAL
                  </span>
                )}
                {product.sale_price && (
                  <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest bg-rose-600 text-white font-bold rounded-xs shadow">
                    SALE
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`aspect-[3/4] rounded-xs overflow-hidden border-2 transition-all bg-[#181818] ${
                      activeImageIdx === idx ? 'border-white opacity-100' : 'border-white/10 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Configuration (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Brand Label Badge */}
              <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-[0.25em] text-[#777777] mb-2">
                <span>{product.brand_collection}</span>
                <span>•</span>
                <span>OFFICIAL MERCH</span>
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-wider font-extrabold leading-tight">
                {product.name}
              </h1>

              {/* Price in ZAR */}
              <div className="flex items-baseline space-x-3 my-4">
                <span className="text-2xl sm:text-3xl font-bold font-sans text-white">
                  {formatZAR(currentVariant?.price_override ?? product.sale_price ?? product.base_price)}
                </span>
                {product.sale_price && (
                  <span className="text-base text-white/40 line-through font-mono">
                    {formatZAR(product.base_price)}
                  </span>
                )}
                <span className="text-[11px] text-white/40 font-mono">
                  (Incl. VAT)
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Size Configuration */}
              <div className="space-y-3 py-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono tracking-wider font-bold text-white">
                    SELECT SIZE:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="inline-flex items-center space-x-1 text-xs text-white/60 hover:text-white underline underline-offset-4"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>View Measurements (cm)</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {activeVariants.map((v) => {
                    const isSelected = currentVariant?.id === v.id;
                    const isStockOut = v.available_stock <= 0;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        disabled={isStockOut}
                        onClick={() => {
                          setSelectedVariant(v);
                          setQuantity(1);
                        }}
                        className={`py-3 px-1 text-xs uppercase font-mono font-bold rounded-xs border transition-all text-center ${
                          isSelected
                            ? 'bg-white text-black border-white shadow'
                            : isStockOut
                            ? 'border-white/5 text-white/20 line-through cursor-not-allowed bg-white/2'
                            : 'border-white/20 text-white hover:border-white/50 bg-white/5'
                        }`}
                      >
                        {v.size}
                      </button>
                    );
                  })}
                </div>

                {/* Stock Feedback */}
                {currentVariant && (
                  <div className="flex items-center justify-between text-xs text-white/60 font-mono pt-1">
                    <span>
                      Colourway: <strong className="text-white">{currentVariant.colour}</strong>
                    </span>
                    <span>
                      {currentVariant.available_stock > 5 ? (
                        <span className="text-emerald-400">In Stock ({currentVariant.available_stock} units)</span>
                      ) : currentVariant.available_stock > 0 ? (
                        <span className="text-amber-400 font-bold">Only {currentVariant.available_stock} left!</span>
                      ) : (
                        <span className="text-rose-400">Sold out in this size</span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {!isSoldOut && (
                <div className="flex items-center space-x-4 py-4 border-t border-white/10">
                  <span className="text-xs uppercase font-mono tracking-wider font-bold text-white">
                    QUANTITY:
                  </span>
                  <div className="flex items-center border border-white/20 rounded-xs bg-white/5">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-1.5 text-white/70 hover:text-white"
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-mono font-bold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                      className="px-3.5 py-1.5 text-white/70 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-white/40 font-mono">Max: {maxStock}</span>
                </div>
              )}

              {/* Add Feedback Notification */}
              {addFeedback && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded text-xs font-mono text-emerald-300 flex items-center space-x-2 animate-in fade-in">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>{addFeedback}</span>
                </div>
              )}

              {/* Primary Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isSoldOut}
                  className="w-full py-4 bg-white text-black font-display tracking-widest text-lg font-bold uppercase hover:bg-neutral-200 transition-all hover-lift rounded-xs flex items-center justify-center space-x-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{isSoldOut ? 'SOLD OUT IN THIS VARIATION' : 'ADD TO SHOPPING BAG'}</span>
                </button>
              </div>

              {/* Key Trust Signals */}
              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/10 text-xs text-white/60">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-white/80" />
                  <span>Nationwide SA Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4 text-white/80" />
                  <span>14-Day Exchanges</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified PayFast &amp; Yoco</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-white/80" />
                  <span>Official Movement Merchandise</span>
                </div>
              </div>
            </div>

            {/* Accordion Details */}
            <div className="pt-6 border-t border-white/10 divide-y divide-white/10 text-xs">
              {/* Product Specifications & Fabric */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}
                  className="w-full py-3 flex items-center justify-between text-left font-bold text-white uppercase tracking-wider font-mono"
                >
                  <span>FABRIC COMPOSITION &amp; CRAFTSMANSHIP</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openAccordion === 'details' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openAccordion === 'details' && (
                  <div className="pb-4 text-white/70 space-y-2 leading-relaxed">
                    {product.fabric_composition && (
                      <p>
                        <strong>Material:</strong> {product.fabric_composition}
                      </p>
                    )}
                    {product.details && product.details.length > 0 && (
                      <ul className="list-disc pl-4 space-y-1 text-white/60">
                        {product.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery Times */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                  className="w-full py-3 flex items-center justify-between text-left font-bold text-white uppercase tracking-wider font-mono"
                >
                  <span>SOUTH AFRICAN SHIPPING &amp; DELIVERY</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openAccordion === 'shipping' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="pb-4 text-white/70 space-y-2 leading-relaxed">
                    <p>
                      • <strong>Standard Nationwide Courier:</strong> 3 – 5 business days (R120, or Free over R1,200).
                    </p>
                    <p>
                      • <strong>Express Major Metros:</strong> 1 – 2 business days (Gauteng, Cape Town, Durban) (R180).
                    </p>
                    <p>
                      • <strong>Pargo / Smart Lockers:</strong> 2 – 4 business days (R85).
                    </p>
                    <p className="text-[11px] text-white/40">
                      Dispatched securely with tracking notifications via SMS and email.
                    </p>
                  </div>
                )}
              </div>

              {/* Exchanges */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'returns' ? null : 'returns')}
                  className="w-full py-3 flex items-center justify-between text-left font-bold text-white uppercase tracking-wider font-mono"
                >
                  <span>14-DAY EXCHANGES &amp; RETURNS (CPA)</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openAccordion === 'returns' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openAccordion === 'returns' && (
                  <div className="pb-4 text-white/70 space-y-2 leading-relaxed">
                    <p>
                      We accept unworn, unwashed garments in their original packaging within 14 days of receipt for size exchanges or credit notes, fully adhering to the South African Consumer Protection Act.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-white/10">
            <h3 className="font-display text-3xl uppercase tracking-wider text-white mb-8">
              COMPLETE THE LOOK
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <section className="mt-16 pt-12 border-t border-white/5">
            <h3 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-6">
              RECENTLY VIEWED ARCHIVES
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentlyViewed.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Mobile Add To Bag Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#0d0d0d]/95 backdrop-blur-md border-t border-white/15 p-3 z-40 flex items-center justify-between gap-3 shadow-2xl">
        <div className="min-w-0">
          <div className="text-xs font-bold font-sans text-white truncate">{product.name}</div>
          <div className="text-xs font-mono text-white/70">
            {formatZAR(currentVariant?.price_override ?? product.sale_price ?? product.base_price)}
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isSoldOut}
          className="px-6 py-2.5 bg-white text-black font-display tracking-widest uppercase font-bold text-sm rounded-xs flex items-center space-x-1.5 flex-shrink-0 disabled:opacity-40"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isSoldOut ? 'SOLD OUT' : 'ADD TO BAG'}</span>
        </button>
      </div>

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
};
