import React from 'react';
import { FileText, ShieldAlert } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F2EC] py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-mono block">
            TERMS &amp; CONDITIONS OF ONLINE SALE
          </span>
          <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-wider text-white font-extrabold">
            TERMS OF SERVICE
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans max-w-xl mx-auto">
            Governing the purchase and delivery of official merchandise from The Connoisseurs Show and Vintage Connoisseurs.
          </p>
        </div>

        <div className="bg-[#121212] border border-white/10 rounded-xs p-8 space-y-8 text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed shadow-2xl">
          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase tracking-wider text-white font-bold">
              1. ELECTRONIC CONTRACT FORMATION
            </h2>
            <p>
              By accessing our store, registering an order, or completing checkout, you agree to these Terms and Conditions in accordance with the Electronic Communications and Transactions Act (ECTA) No. 25 of 2002 and the Consumer Protection Act (CPA) No. 68 of 2008 of South Africa.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase tracking-wider text-white font-bold">
              2. PRICING &amp; VALUE-ADDED TAX (VAT)
            </h2>
            <p>
              All prices quoted on the website are in South African Rand (ZAR) and are inclusive of standard 15% Value-Added Tax (VAT). Shipping courier charges are calculated and displayed prior to payment authorization. We reserve the right to correct pricing errors should technical anomalies occur.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase tracking-wider text-white font-bold">
              3. MERCHANDISE AVAILABILITY &amp; LIMITED DROPS
            </h2>
            <p>
              Due to the limited and archival nature of our collections, items placed in your cart are not reserved until checkout payment confirmation is received. In the event an item becomes oversold prior to transaction completion, the customer will be promptly notified and offered an immediate full refund or exchange.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase tracking-wider text-white font-bold">
              4. INTELLECTUAL PROPERTY &amp; TRADEMARKS
            </h2>
            <p>
              All logos, soundwave graphics, typography, photos, and clothing designs associated with <strong>The Connoisseurs Show</strong> and <strong>Vintage Connoisseurs</strong> are protected under South African trademark and copyright laws. Unauthorized reproduction, counterfeiting, or commercial redistribution is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase tracking-wider text-white font-bold">
              5. GOVERNING LAW &amp; JURISDICTION
            </h2>
            <p>
              These terms shall be governed by and interpreted in accordance with the laws of the Republic of South Africa. Any disputes arising in connection with orders shall be subject to the non-exclusive jurisdiction of the High Court of South Africa.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
