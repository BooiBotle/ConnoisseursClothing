import React from 'react';
import { Link } from 'react-router-dom';
import { Disc, Sparkles, Music2, ShieldCheck, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F2EC] py-16 sm:py-24 vintage-grain">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Editorial Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-mono block">
            CULTURE • MUSIC • BESPOKE APPAREL
          </span>
          <h1 className="font-display text-5xl sm:text-7xl uppercase tracking-wider text-white font-extrabold leading-none">
            THE CONNOISSEURS STORY
          </h1>
          <div className="font-script text-3xl text-white/80">
            Preserving auditory heritage through tactile streetwear
          </div>
          <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed pt-2">
            The Connoisseurs Show and Vintage Connoisseurs were founded to honour the deep, resonant heritage of analog music culture and translate its timeless spirit into premium merchandise and everyday lifestyle wear.
          </p>
        </div>

        {/* Both Logos Heritage Plaque */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-white/10">
          <div className="bg-[#121212] border border-white/10 p-8 rounded-xs flex flex-col items-center text-center space-y-4">
            <img
              src="/brand/connoisseurs_show_light.png"
              alt="The Connoisseurs Show Badge"
              className="h-28 w-auto object-contain"
            />
            <h3 className="font-display text-2xl uppercase tracking-wider text-white">
              THE CONNOISSEURS SHOW
            </h3>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              The flagship cultural banner celebrating music connoisseurs, vinyl broadcast sessions, sound architecture, and contemporary South African urban expression.
            </p>
          </div>

          <div className="bg-[#121212] border border-white/10 p-8 rounded-xs flex flex-col items-center text-center space-y-4">
            <img
              src="/brand/vintage_connoisseurs_light.png"
              alt="Vintage Connoisseurs Label"
              className="h-20 w-auto object-contain my-auto"
            />
            <h3 className="font-display text-2xl uppercase tracking-wider text-white">
              VINTAGE CONNOISSEURS
            </h3>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              Our archival apparel line, dedicated to distressed typography, woodcut turntable insignia, heavyweight textiles, and limited run collectible streetwear capsules.
            </p>
          </div>
        </div>

        {/* Editorial Photo & Manifesto Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="aspect-[4/5] rounded-xs overflow-hidden border border-white/10 bg-[#181818] shadow-2xl">
              <img
                src="/hero/hero_streetwear_editorial.jpg"
                alt="Connoisseurs editorial models"
                className="w-full h-full object-cover filter contrast-110"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] uppercase font-mono tracking-widest text-white/50 block">
              OUR CRAFT &amp; PROCESS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-white font-bold leading-tight">
              WE DO NOT MAKE GENERIC MERCHANDISE.
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
              <p>
                Every hoodie, tee, and cap that carries our name begins with meticulous textile development right here in South Africa. We source dense 450gsm French Terry cotton that retains its boxy structure year after year, and comb our t-shirt cotton to a rich 280gsm standard.
              </p>
              <p>
                Our prints use breathable water-based inks that penetrate the garment fibres rather than resting like cheap plastic on top. The result is clothing that softens and matures with age, mirroring the authentic warmth of vinyl grooves.
              </p>
              <p>
                When you wear The Connoisseurs Show merchandise, you represent a vibrant community that values nuance, heritage, and genuine creative intention.
              </p>
            </div>

            <div className="pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-white text-black font-display text-sm uppercase tracking-widest font-bold hover:bg-neutral-200 transition-colors rounded-xs"
              >
                <span>EXPLORE AVAILABLE DROPS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
