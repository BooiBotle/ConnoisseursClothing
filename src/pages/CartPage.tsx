import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../../src/context/CartContext';
import { formatZAR } from '../../src/utils/formatters';
import { SHIPPING_OPTIONS } from '../../src/services/shipping';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountAmount,
    shippingFee,
    finalTotal,
    totalItemsCount,
    freeShippingRemaining,
    freeShippingProgress,
    selectedShippingId,
    setSelectedShippingId,
    activePromo,
    applyPromoCode,
    removePromoCode
  } = useCart();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    const res = applyPromoCode(promoCodeInput);
    setPromoMessage(res.message);
    if (res.success) setPromoCodeInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F5F2EC] py-24 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-20 h-20 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-6 text-white/40">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="font-display text-4xl uppercase tracking-wider text-white mb-3">
            YOUR SHOPPING BAG IS EMPTY
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mb-8 font-sans leading-relaxed">
            There are currently no items in your order. Explore our latest drops, heavyweight hoodies, and archival merchandise to start your collection.
          </p>
          <Link
            to="/shop"
            className="px-8 py-4 bg-white text-black font-display text-base uppercase tracking-widest font-bold hover:bg-neutral-200 transition-colors rounded-xs inline-block"
          >
            DISCOVER THE CATALOGUE
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F2EC] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-white/10 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-mono block mb-2">
              YOUR ORDER REVIEW
            </span>
            <h1 className="font-display text-4xl sm:text-5xl text-white uppercase tracking-wider font-extrabold">
              SHOPPING BAG ({totalItemsCount})
            </h1>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-mono text-white/50 hover:text-rose-400 underline underline-offset-4"
          >
            Empty Entire Bag
          </button>
        </div>

        {/* Free Shipping Alert Banner */}
        <div className="bg-[#121212] border border-white/10 rounded-xs p-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono mb-2">
            <span className="flex items-center space-x-2 text-white">
              <Truck className="w-4 h-4 text-white/70" />
              <span>
                {freeShippingRemaining === 0 ? (
                  <strong className="text-emerald-400">
                    Congratulations! You qualified for Free Nationwide Door-to-Door Courier.
                  </strong>
                ) : (
                  <>
                    Add <strong>{formatZAR(freeShippingRemaining)}</strong> more to unlock FREE Nationwide Delivery!
                  </>
                )}
              </span>
            </span>
            <span className="text-neutral-400 text-[11px]">{freeShippingProgress}% of R1,200 threshold</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                freeShippingRemaining === 0 ? 'bg-emerald-400' : 'bg-white'
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* 2 Columns: Items List (8 cols) & Summary (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Cart Table / Items */}
          <div className="lg:col-span-8 space-y-4">
            <div className="hidden sm:grid grid-cols-12 text-[11px] font-mono uppercase tracking-wider text-white/40 pb-3 border-b border-white/10">
              <div className="col-span-6">Garment &amp; Variant</div>
              <div className="col-span-2 text-center">Unit Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Line Total</div>
            </div>

            <div className="divide-y divide-white/5">
              {cart.map((item) => (
                <div key={item.id} className="py-5 flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-4">
                  {/* Image & Title */}
                  <div className="col-span-6 flex items-center space-x-4">
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-20 h-24 object-cover rounded-xs bg-[#141414] flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/product/${item.product_slug}`}
                        className="text-sm font-semibold uppercase text-white hover:text-neutral-300 transition-colors line-clamp-1"
                      >
                        {item.product_name}
                      </Link>
                      <div className="flex items-center space-x-2 text-xs text-white/50 mt-1 font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase">
                          Size: {item.size}
                        </span>
                        <span className="truncate">{item.colour}</span>
                      </div>
                      <div className="text-[10px] text-white/30 font-mono mt-0.5">
                        SKU: {item.sku}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 mt-2 sm:hidden"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="col-span-2 text-left sm:text-center text-xs font-mono text-white/80">
                    <span className="sm:hidden text-white/40 mr-2">Price:</span>
                    {formatZAR(item.unit_price)}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 flex items-center sm:justify-center">
                    <div className="flex items-center border border-white/20 rounded-xs bg-white/5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-white/70 hover:text-white"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-mono font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.max_stock}
                        className="px-2.5 py-1 text-white/70 hover:text-white disabled:opacity-30"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Line Total & Remove button on Desktop */}
                  <div className="col-span-2 flex items-center justify-between sm:justify-end space-x-4">
                    <span className="text-sm font-bold font-mono text-white">
                      {formatZAR(item.unit_price * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="hidden sm:block text-white/40 hover:text-rose-400 transition-colors p-1"
                      title="Remove from bag"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Link
                to="/shop"
                className="text-xs uppercase tracking-widest font-mono text-white/60 hover:text-white inline-flex items-center space-x-2"
              >
                <span>&larr; CONTINUE SHOPPING MERCHANDISE</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-[#121212] border border-white/10 rounded-xs p-6 space-y-6 shadow-2xl">
              <h2 className="font-display tracking-widest text-xl uppercase font-bold text-white border-b border-white/10 pb-3">
                ORDER SUMMARY
              </h2>

              {/* Shipping Method Estimate */}
              <div className="space-y-2">
                <span className="text-xs uppercase font-mono tracking-wider text-white/60 block">
                  Select Delivery Courier:
                </span>
                <div className="space-y-2">
                  {SHIPPING_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-start justify-between p-2.5 rounded-xs border text-xs cursor-pointer transition-colors ${
                        selectedShippingId === opt.id
                          ? 'bg-white/10 border-white text-white'
                          : 'bg-white/2 border-white/10 text-neutral-400 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <input
                          type="radio"
                          name="shipping_cart"
                          checked={selectedShippingId === opt.id}
                          onChange={() => setSelectedShippingId(opt.id)}
                          className="mt-0.5 text-white bg-transparent focus:ring-0"
                        />
                        <div>
                          <span className="font-semibold block text-white">{opt.name}</span>
                          <span className="text-[10px] text-white/50">{opt.estimated_days}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold">
                        {opt.free_threshold && subtotal >= opt.free_threshold
                          ? 'FREE'
                          : formatZAR(opt.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Promo Code Form */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-xs uppercase font-mono tracking-wider text-white/60 block">
                  Discount Promo Code
                </span>
                <form onSubmit={handleApplyPromo} className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="e.g. CONNOISSEUR10"
                    className="flex-1 bg-black/60 border border-white/15 px-3 py-2 text-xs uppercase text-white placeholder-white/30 rounded-xs focus:outline-none focus:border-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors"
                  >
                    APPLY
                  </button>
                </form>

                {promoMessage && (
                  <p className="text-[11px] font-mono text-amber-300">{promoMessage}</p>
                )}

                {activePromo && (
                  <div className="flex items-center justify-between text-xs bg-emerald-950/40 border border-emerald-500/30 p-2 rounded text-emerald-300">
                    <span>
                      Active: <strong>{activePromo.code}</strong> (-{activePromo.discountPercentage}%)
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-white/40 hover:text-white text-xs"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 text-xs border-t border-white/10 pt-4">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-white">{formatZAR(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">-{formatZAR(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-white/70">
                  <span>Shipping Courier</span>
                  <span className="font-mono font-semibold text-white">
                    {shippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : formatZAR(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-white text-base font-bold pt-3 border-t border-white/10">
                  <span>Final Total</span>
                  <span className="font-mono text-xl">{formatZAR(finalTotal)}</span>
                </div>
                <div className="text-[10px] text-white/40 font-mono">
                  All prices include South African 15% VAT.
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-white text-black font-display tracking-widest text-lg font-bold uppercase hover:bg-neutral-200 transition-all hover-lift rounded-xs flex items-center justify-center space-x-2"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center space-x-2 text-[10px] text-white/40 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Encrypted 256-bit South African Gateway</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
