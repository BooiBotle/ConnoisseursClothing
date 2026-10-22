import React, { useState } from 'react';
import { X, ShoppingBag, ArrowRight, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product, ProductVariant } from '../../types';
import { formatZAR } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { getAssetPath } from '../../utils/assets';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenSizeGuide: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onOpenSizeGuide
}) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!product) return null;

  // Initialize selected variant if null
  const activeVariants = product.variants.filter((v) => v.active);
  const currentVariant = selectedVariant || activeVariants.find((v) => v.available_stock > 0) || activeVariants[0];

  const handleAddToCart = () => {
    if (!currentVariant) return;
    const res = addToCart(product, currentVariant, quantity);
    setFeedback(res.message);
    if (res.success) {
      setTimeout(() => {
        onClose();
      }, 900);
    }
  };

  const images = product.images.length > 0 ? product.images : [{ id: '1', product_id: product.id, image_url: getAssetPath('products/hoodie_vintage_black_front.jpg'), alt_text: product.name, display_order: 1 }];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#121212] border border-white/15 rounded-lg shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-white/50 hover:text-white rounded-full bg-black/50 backdrop-blur-sm transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Images Section */}
          <div className="bg-[#181818] p-6 flex flex-col justify-between">
            <div className="aspect-[3/4] w-full rounded-sm overflow-hidden bg-black/40">
              <img
                src={images[activeImageIndex]?.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-18 rounded overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIndex === idx ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase font-mono tracking-widest text-[#777777] block mb-1">
                {product.brand_collection}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-white">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline space-x-3 my-3">
                <span className="text-xl sm:text-2xl font-bold font-sans text-white">
                  {formatZAR(currentVariant?.price_override ?? product.sale_price ?? product.base_price)}
                </span>
                {product.sale_price && (
                  <span className="text-sm text-white/40 line-through font-mono">
                    {formatZAR(product.base_price)}
                  </span>
                )}
              </div>

              <p className="text-xs text-white/70 leading-relaxed line-clamp-3 mb-6">
                {product.description}
              </p>

              {/* Size Selector */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-white">
                    Select Size:
                  </span>
                  <button
                    type="button"
                    onClick={onOpenSizeGuide}
                    className="text-[10px] uppercase tracking-wider font-mono text-white/50 hover:text-white underline underline-offset-2"
                  >
                    Size Guide
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeVariants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-3 py-2 text-[10px] uppercase tracking-wider border rounded-xs ${
                        currentVariant?.id === variant.id
                          ? 'border-white bg-white text-black'
                          : 'border-white/15 bg-[#1a1a1a] text-white hover:border-white/30'
                      }`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs uppercase tracking-wider font-semibold text-white">Qty:</span>
                <div className="flex items-center border border-white/15 bg-[#1a1a1a] rounded-xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-white/70 hover:text-white"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-xs text-white font-mono">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min((currentVariant?.available_stock ?? 1), q + 1))}
                    className="px-3 py-2 text-white/70 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white text-black font-display text-sm uppercase tracking-widest font-bold rounded-xs hover:bg-neutral-200 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              {feedback && (
                <div className="text-xs text-emerald-300 font-mono bg-emerald-500/10 border border-emerald-500/30 rounded-xs px-3 py-2">
                  {feedback}
                </div>
              )}

              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-wider text-white/45 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Secure checkout | Fast shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
