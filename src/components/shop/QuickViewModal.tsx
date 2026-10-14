import React, { useState } from 'react';
import { X, ShoppingBag, ArrowRight, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product, ProductVariant } from '../../types';
import { formatZAR } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';

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

  const images = product.images.length > 0 ? product.images : [{ id: '1', product_id: product.id, image_url: '/products/hoodie_vintage_black_front.jpg', alt_text: product.name, display_order: 1 }];

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
                    className="text-[11px] text-white/60 hover:text-white underline underline-offset-4"
                  >
                    Size Guide (cm)
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {activeVariants.map((v) => {
                    const isSelected = currentVariant?.id === v.id;
                    const isOut = v.available_stock <= 0;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        disabled={isOut}
                        onClick={() => {
                          setSelectedVariant(v);
                          setQuantity(1);
                        }}
                        className={`py-2 px-1 text-xs uppercase font-mono font-bold rounded-xs border transition-all ${
                          isSelected
                            ? 'bg-white text-black border-white'
                            : isOut
                            ? 'border-white/5 text-white/20 line-through cursor-not-allowed bg-white/2'
                            : 'border-white/20 text-white hover:border-white/50 bg-white/5'
                        }`}
                      >
                        {v.size}
                      </button>
                    );
                  })}
                </div>

                {currentVariant && (
                  <div className="flex items-center justify-between text-[11px] text-white/50 pt-1 font-mono">
                    <span>Colour: {currentVariant.colour}</span>
                    <span>
                      {currentVariant.available_stock > 0
                        ? `${currentVariant.available_stock} available in stock`
                        : 'Sold out in this size'}
                    </span>
                  </div>
                )}
              </div>

              {/* Quantity */}
              {currentVariant && currentVariant.available_stock > 0 && (
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-xs uppercase tracking-wider font-semibold text-white">Quantity:</span>
                  <div className="flex items-center border border-white/20 rounded-xs bg-white/5">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-white/70 hover:text-white"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-mono font-bold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(currentVariant.available_stock, quantity + 1))}
                      className="px-3 py-1 text-white/70 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              {feedback && (
                <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                  <Check className="w-4 h-4" />
                  <span>{feedback}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!currentVariant || currentVariant.available_stock <= 0}
                className="w-full py-3.5 bg-white text-black font-display tracking-widest text-base font-bold uppercase hover:bg-neutral-200 transition-colors flex items-center justify-center space-x-2 rounded-xs disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {currentVariant && currentVariant.available_stock > 0
                    ? 'ADD TO SHOPPING BAG'
                    : 'OUT OF STOCK'}
                </span>
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="text-white/60 hover:text-white flex items-center space-x-1"
                >
                  <span>View full product details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <span className="flex items-center space-x-1 text-[11px] text-white/40">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Door-to-door SA courier</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
