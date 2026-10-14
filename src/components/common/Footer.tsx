import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Mail, MapPin, Clock } from 'lucide-react';
import { dbService } from '../../services/db';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentGiven, setConsentGiven] = useState(true);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) {
      setStatusMessage('Please accept the POPIA consent to join our newsletter.');
      setIsSuccess(false);
      return;
    }
    setIsSubmitting(true);
    const res = await dbService.subscribeNewsletter(email);
    setIsSubmitting(false);
    setStatusMessage(res.message);
    setIsSuccess(res.success);
    if (res.success) setEmail('');
  };

  return (
    <footer className="bg-[#050505] text-[#b3b3b3] border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Manifesto Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-mono block">
              THE CONNOISSEURS DISPATCH
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wider">
              BE FIRST IN LINE FOR THE NEXT ARCHIVAL DROP
            </h3>
            <p className="text-xs sm:text-sm text-[#777777] leading-relaxed max-w-lg">
              Receive private drop notifications, secret capsule access, vinyl playlist curations, and exclusive streetwear releases directly to your inbox. No spam. Never compromised.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-[#141414] border border-white/15 px-4 py-3 text-xs text-white placeholder-white/30 rounded-xs focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-white text-black font-display tracking-widest text-sm font-bold uppercase hover:bg-neutral-200 transition-colors flex items-center justify-center space-x-2 rounded-xs disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'JOINING...' : 'SUBSCRIBE'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-start space-x-2 text-[11px] text-white/40 pt-1">
                <input
                  type="checkbox"
                  id="popia-consent"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-[#141414] text-white focus:ring-0"
                />
                <label htmlFor="popia-consent" className="cursor-pointer">
                  I consent to receiving merchandise drops and news in accordance with the Protection of Personal Information Act (POPIA).
                </label>
              </div>

              {statusMessage && (
                <div
                  className={`flex items-center space-x-2 text-xs font-mono mt-2 ${
                    isSuccess ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isSuccess && <CheckCircle2 className="w-4 h-4" />}
                  <span>{statusMessage}</span>
                </div>
              )}
            </form>
          </div>

          {/* Secondary Brand Badge & Visual Heritage */}
          <div className="lg:col-span-6 flex flex-col justify-center items-start lg:items-end">
            <div className="bg-[#121212] border border-white/10 p-6 rounded-sm max-w-md w-full">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <img
                  src="/brand/vintage_connoisseurs_light.png"
                  alt="Vintage Connoisseurs Brand"
                  className="h-8 w-auto object-contain"
                />
                <span className="text-[10px] font-mono uppercase text-white/40 tracking-widest">
                  ORIGINAL HERITAGE
                </span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed font-sans mb-4">
                &ldquo;Where vintage vinyl nostalgia, crate digging, and raw South African streetwear culture meet heavyweight bespoke craftsmanship.&rdquo;
              </p>
              <div className="flex items-center space-x-4 text-[11px] text-white/40 font-mono">
                <span>// CAPE TOWN</span>
                <span>// JOHANNESBURG</span>
                <span>// DURBAN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Links Navigation Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-12 border-b border-white/10 text-xs">
          {/* Col 1: Brand Info */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/brand/connoisseurs_show_light.png"
                alt="The Connoisseurs Show"
                className="h-10 w-auto"
              />
              <div>
                <span className="font-display tracking-widest text-base font-bold text-white block uppercase">
                  THE CONNOISSEURS SHOW
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#777777] uppercase">
                  VINTAGE CONNOISSEURS APPAREL
                </span>
              </div>
            </div>
            <p className="text-xs text-white/50 leading-relaxed max-w-sm">
              Official merchandise representing the movement. High-density textiles, archival screen-prints, and heavyweight garments produced for true cultural connoisseurs.
            </p>
            <div className="space-y-1.5 text-xs text-white/50">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-white/70" />
                <span>support@theconnoisseurs.co.za</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-white/70" />
                <span>Mon – Fri: 09:00 – 17:00 (SAST)</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-white/70" />
                <span>Republic of South Africa</span>
              </div>
            </div>
          </div>

          {/* Col 2: Shop */}
          <div className="space-y-3">
            <h4 className="font-display tracking-widest text-sm text-white uppercase font-bold">
              SHOP MERCHANDISE
            </h4>
            <ul className="space-y-2 text-white/60">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  Shop All Drops
                </Link>
              </li>
              <li>
                <Link to="/collections/hoodies-sweatshirts" className="hover:text-white transition-colors">
                  Hoodies &amp; Sweatshirts
                </Link>
              </li>
              <li>
                <Link to="/collections/t-shirts" className="hover:text-white transition-colors">
                  T-Shirts &amp; Tops
                </Link>
              </li>
              <li>
                <Link to="/collections/caps-headwear" className="hover:text-white transition-colors">
                  Caps &amp; Headwear
                </Link>
              </li>
              <li>
                <Link to="/collections/limited-edition" className="hover:text-white transition-colors">
                  Limited Drops
                </Link>
              </li>
              <li>
                <Link to="/collections/accessories" className="hover:text-white transition-colors">
                  Archival Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="font-display tracking-widest text-sm text-white uppercase font-bold">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2 text-white/60">
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="hover:text-white transition-colors">
                  Shipping &amp; Delivery Rates
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns#returns" className="hover:text-white transition-colors">
                  14-Day Exchanges &amp; Returns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Customer Support
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Our Story &amp; Movement
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="font-display tracking-widest text-sm text-white uppercase font-bold">
              LEGAL &amp; COMPLIANCE
            </h4>
            <ul className="space-y-2 text-white/60">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy (POPIA)
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns#consumer-rights" className="hover:text-white transition-colors">
                  Consumer Protection (CPA)
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors text-white/30 hover:text-white/80">
                  Store Management Admin &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Payment Badges & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <div className="flex items-center space-x-2 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              Secure South African Payments: PayFast • Yoco • Instant EFT • Visa • Mastercard
            </span>
          </div>

          <div className="text-center md:text-right font-mono text-[11px]">
            &copy; {new Date().getFullYear()} The Connoisseurs Show &amp; Vintage Connoisseurs. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
