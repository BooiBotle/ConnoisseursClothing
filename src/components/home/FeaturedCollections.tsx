import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '../../types';
import { dbService } from '../../services/db';

export const FeaturedCollections: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    dbService.getCategories().then((data) => setCategories(data));
  }, []);

  return (
    <section className="py-20 bg-[#080808] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-mono block mb-2">
              CURATED ARCHIVES
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-white uppercase tracking-wider font-bold">
              FEATURED COLLECTIONS
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-white/50 max-w-md font-sans mt-3 md:mt-0">
            Explore curated apparel drops designed around analog soundscapes, turntable heritage, and contemporary streetwear aesthetics.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/collections/${cat.slug}`}
              className={`group relative overflow-hidden rounded-xs border border-white/10 hover:border-white/30 transition-all duration-500 bg-[#141414] ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-2 aspect-[16/9] sm:aspect-[2/1]' : 'aspect-[4/5]'
              }`}
            >
              {/* Image */}
              <img
                src={cat.image_url}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-75 group-hover:brightness-90 contrast-110"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

              {/* Content Box */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-10">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-xs">
                    ARCHIVE 0{idx + 1}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all group-hover:bg-white group-hover:text-black group-hover:scale-110">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-2xl sm:text-4xl text-white uppercase tracking-wider font-bold mb-2 group-hover:translate-x-1 transition-transform">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/70 line-clamp-2 max-w-sm font-sans">
                    {cat.description}
                  </p>
                  <div className="mt-4 flex items-center space-x-1 text-xs uppercase tracking-widest font-bold text-white group-hover:underline underline-offset-4">
                    <span>EXPLORE DROP</span>
                    <span>&rarr;</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
