import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Disc3, ShieldCheck, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#050505] vintage-grain">
      {/* Background Hero Image with Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero/hero_streetwear_editorial.jpg"
          alt="The Connoisseurs Show Streetwear Campaign"
          className="w-full h-full object-cover object-center filter grayscale contrast-125 brightness-[0.45] scale-100 animate-in fade-in zoom-in-105 duration-1000"
        />
        {/* Editorial Vignette and Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/80" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#050505]/40 to-[#050505]" />
      </div>

      {/* Floating Accent Watermark / Badge */}
      <div className="absolute top-10 right-6 sm:right-12 z-10 hidden md:block opacity-30 pointer-events-none">
        <img
          src="/brand/connoisseurs_show_light.png"
          alt="Connoisseurs Watermark"
          className="w-44 h-auto animate-spin"
          style={{ animationDuration: '60s' }}
        />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        {/* Curated Sub-badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[11px] font-mono uppercase tracking-[0.2em] text-[#F5F2EC] mb-6 animate-in slide-in-from-bottom-2 duration-500">
          <Disc3 className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: '10s' }} />
          <span>VINTAGE CONNOISSEURS // OFFICIAL MERCHANDISE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span>AUTUMN / WINTER &apos;26</span>
        </div>

        {/* Major Condensed Headline */}
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-wider uppercase leading-none font-extrabold max-w-5xl drop-shadow-2xl">
          CULTURE. STYLE. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5F2EC] to-[#777777]">
            IDENTITY.
          </span>
        </h1>

        {/* Vintage Script Accent Underline */}
        <div className="font-script text-2xl sm:text-3xl text-white/80 -mt-1 sm:-mt-2 mb-4 tracking-normal transform -rotate-1">
          Made for the true connoisseurs
        </div>

        {/* Editorial Supporting Paragraph */}
        <p className="text-sm sm:text-base md:text-lg text-[#F5F2EC]/80 max-w-2xl font-sans font-light leading-relaxed mb-10 px-4">
          Wear the culture. Represent the movement. Discover heavyweight apparel, archival typography, and limited drops built at the intersection of vintage music heritage and modern streetwear.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4">
          <Link
            to="/shop"
            className="w-full sm:w-auto px-8 py-4 bg-[#FFFFFF] text-[#050505] font-display text-lg tracking-widest uppercase font-bold hover:bg-[#F5F2EC] transition-all hover-lift rounded-xs flex items-center justify-center space-x-3 group"
          >
            <span>SHOP THE COLLECTION</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/about"
            className="w-full sm:w-auto px-8 py-4 bg-[#141414]/90 text-white font-display text-lg tracking-widest uppercase font-bold border border-white/20 hover:border-white/50 hover:bg-[#1f1f1f] transition-all rounded-xs flex items-center justify-center space-x-2"
          >
            <span>DISCOVER OUR STORY</span>
          </Link>
        </div>

        {/* Quick Highlights Ticker at Hero Base */}
        <div className="mt-16 pt-8 border-t border-white/10 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-bold text-white font-mono block">450 GSM</span>
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-sans">HEAVYWEIGHT FLEECE</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-bold text-white font-mono block">DOOR-TO-DOOR</span>
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-sans">NATIONWIDE SA COURIER</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-bold text-white font-mono block">LIMITED DROPS</span>
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-sans">NUMBERED RUNS</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-bold text-white font-mono block">AUTHENTIC INK</span>
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-sans">WATERBASED SCREENPRINT</span>
          </div>
        </div>
      </div>
    </section>
  );
};
