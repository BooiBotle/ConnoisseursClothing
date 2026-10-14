import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'hoodies' | 'tees' | 'caps'>('hoodies');
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#141414] border border-white/15 rounded-lg shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Ruler className="w-5 h-5 text-white/70" />
            <h3 className="font-display text-xl uppercase tracking-wider text-white">
              SIZE &amp; MEASUREMENT GUIDE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white rounded-full transition-colors"
            aria-label="Close Size Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Unit Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-5">
          <div className="flex space-x-2 bg-white/5 p-1 rounded border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('hoodies')}
              className={`px-3 py-1.5 rounded uppercase font-semibold transition-colors ${
                activeTab === 'hoodies' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              Hoodies &amp; Sweats
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tees')}
              className={`px-3 py-1.5 rounded uppercase font-semibold transition-colors ${
                activeTab === 'tees' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              Oversized Tees
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('caps')}
              className={`px-3 py-1.5 rounded uppercase font-semibold transition-colors ${
                activeTab === 'caps' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              Headwear
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-white/40">Unit:</span>
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-2 py-0.5 rounded ${unit === 'cm' ? 'bg-white/20 text-white font-bold' : 'text-white/40'}`}
            >
              CM
            </button>
            <span className="text-white/20">|</span>
            <button
              type="button"
              onClick={() => setUnit('inches')}
              className={`px-2 py-0.5 rounded ${unit === 'inches' ? 'bg-white/20 text-white font-bold' : 'text-white/40'}`}
            >
              INCHES
            </button>
          </div>
        </div>

        {/* Measurement Tables */}
        <div className="overflow-x-auto">
          {activeTab === 'hoodies' && (
            <table className="w-full text-left text-xs font-mono divide-y divide-white/10">
              <thead>
                <tr className="text-white/50 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest Width ({unit})</th>
                  <th className="py-2.5 px-3">Body Length ({unit})</th>
                  <th className="py-2.5 px-3">Sleeve Length ({unit})</th>
                  <th className="py-2.5 px-3">Recommended Fit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-white">S</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '60 cm' : '23.6 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '69 cm' : '27.1 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '62 cm' : '24.4 in'}</td>
                  <td className="py-2.5 px-3 text-white/50">Boxy Streetwear (55-68 kg)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-white">M</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '63 cm' : '24.8 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '71 cm' : '27.9 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '63.5 cm' : '25.0 in'}</td>
                  <td className="py-2.5 px-3 text-white/50">Boxy Streetwear (68-80 kg)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-white">L</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '66 cm' : '25.9 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '73 cm' : '28.7 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '65 cm' : '25.6 in'}</td>
                  <td className="py-2.5 px-3 text-white/50">Boxy Streetwear (80-92 kg)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-white">XL</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '69 cm' : '27.1 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '75 cm' : '29.5 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '66.5 cm' : '26.1 in'}</td>
                  <td className="py-2.5 px-3 text-white/50">Oversized Cut (92-105 kg)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-white">XXL</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '72 cm' : '28.3 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '77 cm' : '30.3 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '68 cm' : '26.7 in'}</td>
                  <td className="py-2.5 px-3 text-white/50">Ultra Relaxed (105+ kg)</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === 'tees' && (
            <table className="w-full text-left text-xs font-mono divide-y divide-white/10">
              <thead>
                <tr className="text-white/50 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest Width ({unit})</th>
                  <th className="py-2.5 px-3">Length ({unit})</th>
                  <th className="py-2.5 px-3">Shoulder Drop ({unit})</th>
                  <th className="py-2.5 px-3">Silhouette</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-white">S</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '54 cm' : '21.2 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '72 cm' : '28.3 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '51 cm' : '20.0 in'}</td>
                  <td className="py-2.5 px-3 text-white/50">Dropped Shoulder Relaxed</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-white">M</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '57 cm' : '22.4 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '74 cm' : '29.1 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '54 cm' : '21.2 in'}</td>
                  <td className="py-2.5 px-3 text-white/50">Dropped Shoulder Relaxed</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-white">L</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '60 cm' : '23.6 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '76 cm' : '29.9 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '57 cm' : '22.4 in'}</td>
                  <td className="py-2.5 px-3 text-white/50">Dropped Shoulder Relaxed</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-white">XL</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '63 cm' : '24.8 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '78 cm' : '30.7 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '60 cm' : '23.6 in'}</td>
                  <td className="py-2.5 px-3 text-white/50">Heavy Oversized Silhouette</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-white">XXL</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '66 cm' : '25.9 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '80 cm' : '31.4 in'}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? '63 cm' : '24.8 in'}</td>
                  <td className="py-2.5 px-3 text-white/50">Heavy Oversized Silhouette</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === 'caps' && (
            <div className="py-6 text-xs text-white/70 leading-relaxed font-sans space-y-4">
              <div className="bg-white/5 p-4 rounded border border-white/10">
                <h4 className="font-bold text-white text-sm mb-1 uppercase font-display tracking-wider">
                  One Size Fits All (Adjustable)
                </h4>
                <p className="text-white/60 mb-2">
                  Circumference: 54 cm – 61 cm (21.2 in – 24.0 in)
                </p>
                <p className="text-white/50 text-[11px]">
                  All Vintage Connoisseurs dad caps feature an adjustable genuine leather strapback equipped with an antique brass sliding buckle that custom-fits virtually any head shape.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Note on Fit */}
        <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-white/50 space-y-1">
          <p>
            <strong>Pro Tip:</strong> All our streetwear garments are intentionally tailored with a relaxed boxy drape. If you prefer a traditional slim fit, we recommend ordering one size down.
          </p>
        </div>
      </div>
    </div>
  );
};
