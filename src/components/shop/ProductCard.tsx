import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { Product } from '../../types';
import { formatZAR } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { getAssetPath } from '../../utils/assets';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const { addToCart } = useCart();

  const primaryImage = product.images[0]?.image_url || getAssetPath('products/hoodie_vintage_black_front.jpg');
  const secondaryImage = product.images[1]?.image_url || primaryImage;

  // Active variants and stock
  const activeVariants = product.variants.filter((v) => v.active);
  const totalStock = activeVariants.reduce((sum, v) => sum + v.available_stock, 0);
  const isSoldOut = totalStock <= 0;

  // Unique sizes
  const sizes = Array.from(new Set(activeVariants.map((v) => v.size)));

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSoldOut) return;

    // If multiple sizes exist, prompt quick view or select first in-stock variant
    if (activeVariants.length > 1 && onQuickView) {
      onQuickView(product);
      return;
    }

    const firstInStock = activeVariants.find((v) => v.available_stock > 0);
    if (firstInStock) {
      const res = addToCart(product, firstInStock, 1);
      if (res.success) {
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 2000);
      }
    }
  };

  return (
    <div
      className="group flex flex-col h-full bg-[#0d0d0d] border border-white/10 rounded-xs overflow-hidden transition-all duration-300 hover:border-white/30 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#161616]">
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1.5 items-start">
          {product.is_limited_edition && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-amber-500 text-black font-bold rounded-xs shadow">
              <Sparkles className="w-2.5 h-2.5" />
              <span>LIMITED DROP</span>
            </span>
          )}
          {product.is_new_drop && !product.is_limited_edition && (
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-white text-black font-bold rounded-xs shadow">
              NEW DROP
            </span>
          )}
          {product.sale_price && (
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-rose-600 text-white font-bold rounded-xs shadow">
              SALE
            </span>
          )}
        </div>

        {/* Sold out overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] z-25 flex items-center justify-center">
            <span className="font-display tracking-widest text-lg font-bold text-white uppercase px-3 py-1 border border-white/30">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Product Images with Cross-fade on Hover */}
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={primaryImage}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
              isHovered && secondaryImage !== primaryImage ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {secondaryImage !== primaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </Link>

        {/* Quick View and Action Overlay (Desktop) */}
        <div className="absolute bottom-3 inset-x-3 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex-1 py-2.5 px-3 bg-[#121212]/90 backdrop-blur-md border border-white/20 text-white text-[11px] font-display uppercase tracking-wider font-bold hover:bg-white hover:text-black transition-colors rounded-xs flex items-center justify-center space-x-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>QUICK VIEW</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isSoldOut}
            className={`py-2.5 px-3 backdrop-blur-md border border-white/20 text-[11px] font-display uppercase tracking-wider font-bold transition-colors rounded-xs flex items-center justify-center space-x-1.5 ${
              addedFeedback
                ? 'bg-emerald-500 text-black border-emerald-500'
                : 'bg-white text-black hover:bg-neutral-200'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {addedFeedback ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ADDED</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{activeVariants.length > 1 ? 'SELECT' : 'ADD'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand Collection Name */}
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#777777] block mb-1">
            {product.brand_collection}
          </span>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug}`}
            className="text-xs sm:text-sm font-semibold text-white hover:text-neutral-300 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Size Chips */}
          {sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-white/5 border border-white/10 text-white/70 rounded-2xs"
                >
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing in ZAR */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-baseline justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-sm sm:text-base font-bold font-sans text-white">
              {formatZAR(product.sale_price ?? product.base_price)}
            </span>
            {product.sale_price && (
              <span className="text-xs text-white/40 line-through font-mono">
                {formatZAR(product.base_price)}
              </span>
            )}
          </div>

          <span className="text-[10px] font-mono text-white/40">
            {isSoldOut ? 'Sold out' : `${totalStock} in stock`}
          </span>
        </div>
      </div>
    </div>
  );
};
