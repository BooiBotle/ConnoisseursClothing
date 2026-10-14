import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle2, ArrowRight, User, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { dbService } from '../services/db';
import { formatZAR, formatDate } from '../utils/formatters';

export const AccountPage: React.FC = () => {
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOrderNumber.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    const order = await dbService.getOrderByNumber(searchOrderNumber.trim());
    setFoundOrder(order);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F2EC] py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-mono block">
            CONNOISSEURS CLIENT PORTAL
          </span>
          <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-wider text-white font-extrabold">
            TRACK YOUR ORDERS
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans max-w-md mx-auto">
            Check the live fulfillment and courier delivery status of your merchandise without requiring an account login.
          </p>
        </div>

        {/* Order Search Box */}
        <div className="bg-[#121212] border border-white/10 rounded-xs p-8 max-w-xl mx-auto shadow-2xl">
          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-mono text-white/70 mb-2">
                Enter Your Order Reference Number:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={searchOrderNumber}
                  onChange={(e) => setSearchOrderNumber(e.target.value)}
                  placeholder="e.g. TCS-2026-1042"
                  className="w-full bg-[#181818] border border-white/15 px-4 py-3 text-sm font-mono text-white uppercase placeholder-white/30 rounded-xs focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-white text-black font-display tracking-widest text-base font-bold uppercase hover:bg-neutral-200 transition-colors rounded-xs flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? 'RETRIEVING ORDER...' : 'LOOKUP ORDER DETAILS'}</span>
            </button>
          </form>
        </div>

        {/* Lookup Results */}
        {hasSearched && (
          <div className="max-w-2xl mx-auto">
            {foundOrder ? (
              <div className="bg-[#121212] border border-white/10 rounded-xs p-6 space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-white/40 block">
                      Order Number
                    </span>
                    <span className="font-mono text-lg font-bold text-white">
                      {foundOrder.order_number}
                    </span>
                    <span className="text-[11px] font-mono text-white/50 block">
                      Placed: {formatDate(foundOrder.created_at)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-white/40 block">
                      Status
                    </span>
                    <span className="inline-block px-2.5 py-1 text-xs font-mono font-bold uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {foundOrder.order_status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="text-white/60">
                    Recipient: <strong className="text-white">{foundOrder.customer.full_name}</strong>
                  </div>
                  <div className="text-white/60">
                    Destination:{' '}
                    <strong className="text-white">
                      {foundOrder.shipping_address.city}, {foundOrder.shipping_address.province}
                    </strong>
                  </div>
                  <div className="text-white/60">
                    Total Amount: <strong className="text-white">{formatZAR(foundOrder.final_total)}</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/order-confirmation/${foundOrder.order_number}`}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xs flex items-center justify-center space-x-2 transition-colors"
                  >
                    <span>View Full Receipt &amp; Tracking Stepper</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-[#121212] border border-rose-500/30 rounded-xs p-6 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
                <h3 className="font-display text-lg uppercase tracking-wider text-white">
                  NO ORDER MATCHING REFERENCE
                </h3>
                <p className="text-xs text-white/60">
                  Please verify the exact order number sent in your confirmation email (e.g. TCS-2026-XXXX).
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
