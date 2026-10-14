import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Disc, Music2, Radio, Sparkles } from 'lucide-react';

export const BrandStorySection: React.FC = () => {
  return (
    <section className="py-24 bg-[#0a0a0a] border-y border-white/5 relative overflow-hidden">
      {/* Decorative Soundwave & Circular Watermark */}
      <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-96 h-96 opacity-10 pointer-events-none">
        <img
          src="/brand/connoisseurs_show_light.png"
          alt=""
          className="w-full h-full object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Editorial Image Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] rounded-xs overflow-hidden border border-white/10 shadow-2xl bg-[#141414]">
              <img
                src="/products/tee_connoisseurs_black_model.jpg"
                alt="Connoisseurs Streetwear and Music Culture"
                className="w-full h-full object-cover filter contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Floating Badge on Image */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    ARCHIVAL IDENTITY
                  </span>
                  <span className="font-display text-lg tracking-wider text-white uppercase font-bold">
                    ANALOG SOUNDS // DIGITAL GENERATION
                  </span>
                </div>
                <Disc className="w-6 h-6 text-white/80 animate-spin" style={{ animationDuration: '12s' }} />
              </div>
            </div>

            {/* Accent Distressed Logo Plaque */}
            <div className="absolute -bottom-6 -right-6 hidden sm:block p-4 bg-[#141414] border border-white/15 rounded-xs shadow-2xl max-w-xs">
              <img
                src="/brand/vintage_connoisseurs_light.png"
                alt="Vintage Connoisseurs Insignia"
                className="h-10 w-auto"
              />
            </div>
          </div>

          {/* Editorial Story Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-[11px] font-mono uppercase tracking-[0.25em] text-[#777777]">
              <Radio className="w-3.5 h-3.5 text-white/70" />
              <span>THE MANIFESTO</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white uppercase tracking-wider font-extrabold leading-none">
              MORE THAN MERCHANDISE. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5F2EC] to-[#777777]">
                IT&apos;S A CULTURE.
              </span>
            </h2>

            <div className="font-script text-2xl text-white/80 -mt-2">
              Where sound and style converge
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
              <p>
                <strong>The Connoisseurs Show</strong> was born out of a relentless passion for authentic music culture, vinyl crate digging, and timeless nostalgia. When you wear our garments, you represent more than a clothing label; you champion a collective appreciation for auditory craftsmanship and creative expression.
              </p>
              <p>
                Under our <strong>Vintage Connoisseurs</strong> banner, every garment is thoughtfully art-directed: from custom-milled 450gsm French Terry heavyweight hoodies and 280gsm dense cotton tees to distressed screenprints and hand-embroidery.
              </p>
              <p>
                We do not produce generic fast fashion or mass catalogue merchandise. Every release is produced in limited capsule drops tailored right here in South Africa for individuals who know the difference.
              </p>
            </div>

            {/* Three Pillar Icons */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/10">
              <div className="space-y-1">
                <Music2 className="w-5 h-5 text-white/80" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  ANALOG ROOTS
                </h4>
                <p className="text-[11px] text-neutral-500">
                  Inspired by classic vinyl sessions and turntable heritage.
                </p>
              </div>

              <div className="space-y-1">
                <Sparkles className="w-5 h-5 text-white/80" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  HEAVYWEIGHT
                </h4>
                <p className="text-[11px] text-neutral-500">
                  Custom-milled textiles built to outlast trends.
                </p>
              </div>

              <div className="space-y-1">
                <Disc className="w-5 h-5 text-white/80" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  LIMITED RUNS
                </h4>
                <p className="text-[11px] text-neutral-500">
                  Exclusive capsules that retain true collector value.
                </p>
              </div>
            </div>

            {/* Link to About Us */}
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center space-x-3 px-6 py-3.5 bg-white text-black font-display text-sm uppercase tracking-widest font-bold hover:bg-neutral-200 transition-colors rounded-xs group"
              >
                <span>EXPLORE OUR HERITAGE &amp; STORY</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
