import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatZAR } from '../../utils/formatters';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    finalTotal,
    totalItemsCount,
    freeShippingRemaining,
    freeShippingProgress,
    activePromo,
    applyPromoCode,
    removePromoCode
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoFeedback(res.message);
    if (res.success) setPromoInput('');
  };

  const handleCheckoutNavigation = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e0e0e] border-l border-white/10 text-white flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-white/70" />
              <h2 className="font-display tracking-widest text-lg uppercase font-bold">
                YOUR SHOPPING BAG ({totalItemsCount})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 text-white/50 hover:text-white transition-colors"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#141414] px-6 py-3 border-b border-white/5">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="flex items-center space-x-1.5 text-neutral-300">
                <Truck className="w-3.5 h-3.5 text-white/70" />
                <span>
                  {freeShippingRemaining === 0 ? (
                    <strong className="text-emerald-400">You unlocked FREE Nationwide Delivery!</strong>
                  ) : (
                    <>
                      Add <strong>{formatZAR(freeShippingRemaining)}</strong> for Free Delivery
                    </>
                  )}
                </span>
              </span>
              <span className="text-[11px] font-mono text-neutral-400">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  freeShippingRemaining === 0 ? 'bg-emerald-400' : 'bg-white'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-white/5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/40">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-display text-xl uppercase tracking-wider text-white mb-2">
                  YOUR BAG IS CURRENTLY EMPTY
                </h3>
                <p className="text-xs text-white/50 max-w-xs mb-6">
                  Discover our new music culture drops, heavyweight hoodies, and vintage archival streetwear.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    navigate('/shop');
                  }}
                  className="px-6 py-3 bg-white text-black text-xs uppercase font-bold tracking-widest hover:bg-neutral-200 transition-colors"
                >
                  START BROWSING
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex space-x-4 group">
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-20 h-24 object-cover rounded-sm bg-[#1c1c1c] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <Link
                          to={`/product/${item.product_slug}`}
                          onClick={closeDrawer}
                          className="text-xs font-semibold uppercase tracking-wider text-white hover:text-neutral-300 line-clamp-1"
                        >
                          {item.product_name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-white/40 hover:text-rose-400 transition-colors ml-2 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] text-white/50 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase">
                          Size: {item.size}
                        </span>
                        <span className="truncate">{item.colour}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-white/20 rounded-xs bg-white/5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.max_stock}
                          className="p-1 hover:bg-white/10 text-white/70 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right">
                        <span className="text-xs font-bold font-sans text-white">
                          {formatZAR(item.unit_price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <div className="text-[10px] text-white/40">{formatZAR(item.unit_price)} each</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="px-6 py-5 bg-[#121212] border-t border-white/10 space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex space-x-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo code (e.g. CONNOISSEUR10)"
                  className="flex-1 bg-black/60 border border-white/15 px-3 py-2 text-xs uppercase placeholder-white/30 text-white rounded-xs focus:outline-none focus:border-white/40"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors"
                >
                  APPLY
                </button>
              </form>

              {promoFeedback && (
                <p className="text-[11px] text-amber-300 font-mono -mt-2">{promoFeedback}</p>
              )}

              {activePromo && (
                <div className="flex items-center justify-between text-xs bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded text-emerald-300">
                  <span>
                    Promo: <strong>{activePromo.code}</strong> (-{activePromo.discountPercentage}%)
                  </span>
                  <button onClick={removePromoCode} className="text-white/50 hover:text-white text-xs">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-white/60">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatZAR(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatZAR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white text-sm font-bold pt-2 border-t border-white/10">
                  <span>Estimated Total</span>
                  <span className="font-mono text-base">{formatZAR(finalTotal)}</span>
                </div>
                <div className="text-[10px] text-white/40">
                  Shipping and applicable South African courier calculated during checkout.
                </div>
              </div>

              {/* Primary Actions */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleCheckoutNavigation}
                  className="w-full py-3.5 bg-white text-black font-display tracking-widest text-base font-bold uppercase hover:bg-neutral-200 transition-transform active:scale-[0.99] flex items-center justify-center space-x-2 rounded-xs"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <Link
                    to="/cart"
                    onClick={closeDrawer}
                    className="text-white/60 hover:text-white underline underline-offset-4"
                  >
                    View detailed bag
                  </Link>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="text-white/60 hover:text-white"
                  >
                    Continue shopping &rarr;
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center space-x-3 text-[10px] text-white/40 pt-2 border-t border-white/5">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>3D Secure Payments</span>
                </span>
                <span>•</span>
                <span>PayFast &amp; Yoco Ready</span>
                <span>•</span>
                <span>14-Day Exchanges</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
