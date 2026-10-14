import React from 'react';
import { Link } from 'react-router-dom';
import { Disc3, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] bg-[#050505] text-[#F5F2EC] flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative w-24 h-24 mx-auto">
          <Disc3 className="w-full h-full text-white/30 animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#777777]">
            ERROR 404 // TRACK NOT FOUND
          </span>
          <h1 className="font-display text-5xl sm:text-6xl uppercase tracking-wider text-white font-extrabold">
            OFF THE RECORD
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
            The groove has skipped. The page or merchandise archive you are looking for has been moved, renamed, or does not exist.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3.5 bg-white text-black font-display text-sm uppercase tracking-widest font-bold hover:bg-neutral-200 transition-colors rounded-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO HOME</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
