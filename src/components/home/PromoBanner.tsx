import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Timer } from 'lucide-react';
import { getAssetPath } from '../../utils/assets';

interface PromoBannerProps {
  headline?: string;
  subheading?: string;
  buttonText?: string;
  buttonLink?: string;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  headline = 'THE NEXT DROP STARTS HERE.',
  subheading = 'Archival heavy fleece capsules and limited edition soundwave garments are produced in restricted batches. Once sold out, they return to the archives.',
  buttonText = 'EXPLORE THE COLLECTION',
  buttonLink = '/collections/limited-edition'
}) => {
  return (
    <section className="py-20 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-sm overflow-hidden border border-white/15 bg-gradient-to-r from-[#141414] via-[#1a1a1a] to-[#0f0f0f] p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Subtle Soundwave Background Graphic */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none flex items-center justify-end">
            <img
              src={getAssetPath('brand/connoisseurs_show_light.png')}
              alt=""
              className="h-full w-auto object-contain translate-x-12"
            />
          </div>

          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-white/10 border border-white/20 text-[10px] font-mono uppercase tracking-[0.2em] text-white">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>LIMITED RELEASE NOTICE</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white uppercase tracking-wider font-extrabold leading-none">
              {headline}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
              {subheading}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to={buttonLink}
                className="px-8 py-4 bg-white text-black font-display text-base uppercase tracking-widest font-bold hover:bg-neutral-200 transition-all hover-lift rounded-xs flex items-center space-x-2 group"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <div className="flex items-center space-x-2 text-xs font-mono text-neutral-400">
                <Timer className="w-4 h-4 text-white/70" />
                <span>Next drop countdown active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
