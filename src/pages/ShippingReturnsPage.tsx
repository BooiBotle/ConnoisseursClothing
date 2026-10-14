import React from 'react';
import { Truck, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '../services/shipping';

export const ShippingReturnsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F2EC] py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-mono block">
            SOUTH AFRICAN E-COMMERCE POLICIES
          </span>
          <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-wider text-white font-extrabold">
            SHIPPING &amp; RETURNS
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans max-w-xl mx-auto leading-relaxed">
            Transparent delivery guidelines and consumer protection standards compliant with the South African Consumer Protection Act (CPA).
          </p>
        </div>

        {/* Shipping Rates Section */}
        <div className="bg-[#121212] border border-white/10 rounded-xs p-8 space-y-6 shadow-2xl">
          <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
            <Truck className="w-6 h-6 text-white/80" />
            <h2 className="font-display text-2xl uppercase tracking-wider text-white font-bold">
              SOUTH AFRICAN COURIER OPTIONS
            </h2>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 bg-white/5 rounded border border-white/10 flex flex-col sm:flex-row justify-between gap-2">
              <div>
                <h3 className="font-bold text-white text-sm">Standard Nationwide Courier</h3>
                <p className="text-white/60 font-sans mt-0.5">
                  Door-to-door delivery across all 9 provinces in South Africa.
                </p>
                <span className="text-[11px] text-white/40 block mt-1">Delivery Time: 3 – 5 business days</span>
              </div>
              <div className="font-bold text-white sm:text-right">
                <div>R 120.00</div>
                <div className="text-emerald-400 text-[10px]">FREE for orders over R{FREE_SHIPPING_THRESHOLD}</div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded border border-white/10 flex flex-col sm:flex-row justify-between gap-2">
              <div>
                <h3 className="font-bold text-white text-sm">Express Major Metros Air Courier</h3>
                <p className="text-white/60 font-sans mt-0.5">
                  Priority overnight delivery to Gauteng (JHB/PTA), Cape Town, and Durban metropolitan areas.
                </p>
                <span className="text-[11px] text-white/40 block mt-1">Delivery Time: 1 – 2 business days</span>
              </div>
              <div className="font-bold text-white sm:text-right">
                <div>R 180.00</div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded border border-white/10 flex flex-col sm:flex-row justify-between gap-2">
              <div>
                <h3 className="font-bold text-white text-sm">Pargo / Smart Locker Pickup</h3>
                <p className="text-white/60 font-sans mt-0.5">
                  Collect 24/7 at your nearest verified smart locker or participating retail pickup hub.
                </p>
                <span className="text-[11px] text-white/40 block mt-1">Delivery Time: 2 – 4 business days</span>
              </div>
              <div className="font-bold text-white sm:text-right">
                <div>R 85.00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Returns & Exchanges Section */}
        <div id="returns" className="bg-[#121212] border border-white/10 rounded-xs p-8 space-y-6 shadow-2xl">
          <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
            <RotateCcw className="w-6 h-6 text-white/80" />
            <h2 className="font-display text-2xl uppercase tracking-wider text-white font-bold">
              14-DAY RETURNS &amp; SIZE EXCHANGES
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
            <p>
              We want you to feel confident in the fit and feel of your merchandise. If a garment does not fit as desired, we gladly facilitate size exchanges or store credit within <strong>14 days of delivery receipt</strong>.
            </p>

            <h4 className="font-mono text-xs font-bold uppercase text-white tracking-wider pt-2">
              Eligibility Conditions:
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-white/70">
              <li>Garments must remain unworn, unwashed, and free of fragrance, stains, or pet hair.</li>
              <li>All original swing tags, neck labels, and archival packaging must remain attached.</li>
              <li>Limited Edition numbered drops are subject to stock availability for size replacements; if out of stock, store credit will be issued.</li>
            </ul>

            <h4 className="font-mono text-xs font-bold uppercase text-white tracking-wider pt-2">
              Defective or Damaged Items:
            </h4>
            <p className="text-xs text-white/70">
              In accordance with Section 56 of the South African Consumer Protection Act, if an item arrives with manufacturing defects or shipping damage, we will replace the item or provide a full refund at no additional courier charge to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
