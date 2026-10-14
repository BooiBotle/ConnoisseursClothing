import React from 'react';
import { ShieldCheck, Lock, FileText } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F2EC] py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-mono block">
            STATUTORY COMPLIANCE • ACT 4 OF 2013
          </span>
          <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-wider text-white font-extrabold">
            PRIVACY POLICY (POPIA)
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans max-w-xl mx-auto">
            Protection of Personal Information Act (POPIA) compliance policy for The Connoisseurs Show and Vintage Connoisseurs online store.
          </p>
        </div>

        <div className="bg-[#121212] border border-white/10 rounded-xs p-8 space-y-8 text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed shadow-2xl">
          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase tracking-wider text-white font-bold">
              1. INTRODUCTION &amp; SCOPE
            </h2>
            <p>
              The Connoisseurs Show (Pty) Ltd operates this online merchandise store. We are committed to safeguarding the privacy and integrity of your personal information in accordance with the Protection of Personal Information Act (Act 4 of 2013) of the Republic of South Africa.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase tracking-wider text-white font-bold">
              2. INFORMATION WE COLLECT
            </h2>
            <p>
              When you purchase merchandise or subscribe to drop alerts, we process the following information:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-white/70">
              <li>Full names and contact information (email address and mobile telephone number).</li>
              <li>Delivery address details (street, suburb, city, province, and postal code) for courier parcel dispatch.</li>
              <li>Order reference snapshots and transaction references provided by payment gateways.</li>
              <li>Communications and inquiries submitted through our concierge channels.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase tracking-wider text-white font-bold">
              3. PAYMENT PROCESSING SECURITY
            </h2>
            <p>
              We do not store, process, or retain credit card numbers, debit card PINs, or CVV codes on our servers. All financial transactions are tokenized and processed through PCI-DSS Level 1 certified South African payment processors (PayFast by Network and Yoco Technologies).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase tracking-wider text-white font-bold">
              4. YOUR STATUTORY RIGHTS UNDER POPIA
            </h2>
            <p>
              As a data subject in South Africa, you have the right to request access to the personal information we hold about you, request rectification of inaccurate records, or request deletion of your information, subject to statutory record-keeping obligations for tax and financial reporting.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-white/10 font-mono text-xs">
            <h3 className="text-white font-bold uppercase">INFORMATION OFFICER CONTACT:</h3>
            <p className="text-white/60">Email: compliance@theconnoisseurs.co.za</p>
            <p className="text-white/60">Location: Cape Town &amp; Johannesburg, South Africa</p>
          </section>
        </div>
      </div>
    </div>
  );
};
