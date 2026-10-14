import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Truck, ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ANNOUNCEMENTS = [
  {
    icon: Truck,
    text: 'Nationwide Courier Delivery Across South Africa — Free for orders over R1,200',
    link: '/shop'
  },
  {
    icon: Sparkles,
    text: 'The Archival Frequency Collection Just Dropped — Limited to 100 units',
    link: '/collections/limited-edition'
  },
  {
    icon: ShieldCheck,
    text: 'Secure Checkout with PayFast, Yoco & Instant EFT',
    link: '/shipping-returns'
  }
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const current = ANNOUNCEMENTS[currentIndex];
  const Icon = current.icon;

  return (
    <div className="relative bg-[#0d0d0d] text-[#b3b3b3] border-b border-white/10 text-xs py-2 px-4 select-none z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-2 text-white/50 text-[11px] uppercase tracking-widest font-mono">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>EST. 2026 // CAPE TOWN &amp; JHB</span>
        </div>

        <div className="flex-1 flex items-center justify-center space-x-2 text-center overflow-hidden transition-all duration-300">
          <Icon className="w-3.5 h-3.5 text-[#F5F2EC] flex-shrink-0" />
          <Link
            to={current.link}
            className="text-white hover:text-[#F5F2EC] transition-colors font-medium tracking-wide flex items-center space-x-1"
          >
            <span>{current.text}</span>
            <ArrowRight className="w-3 h-3 inline-block ml-1 opacity-70" />
          </Link>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span className="hidden lg:inline text-white/40">ZAR (R)</span>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Close Announcement"
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
