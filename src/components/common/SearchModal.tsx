import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { dbService } from '../../services/db';
import { formatZAR } from '../../utils/formatters';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        const data = await dbService.getProducts({ searchQuery: query.trim() });
        setResults(data);
        setIsLoading(false);
      } else {
        setResults([]);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#121212] border border-white/15 rounded-lg shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-white/10 px-4 py-3 sm:py-4">
          <Search className="w-5 h-5 text-white/50 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search merchandise, hoodies, tees, caps, collections..."
            className="w-full bg-transparent text-white placeholder-white/40 text-base sm:text-lg focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-white/40 hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs uppercase tracking-wider text-white/50 hover:text-white px-2 py-1 rounded bg-white/5 ml-2"
          >
            ESC
          </button>
        </form>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {isLoading && (
            <div className="py-8 text-center text-white/40 text-sm">Searching the collection...</div>
          )}

          {!isLoading && query.trim().length >= 2 && results.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-white/60 text-sm mb-2">No merchandise found matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-white/40">Try searching for &quot;hoodie&quot;, &quot;vintage&quot;, &quot;tee&quot;, or &quot;cap&quot;.</p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="space-y-3">
              <div className="text-[11px] uppercase tracking-wider font-mono text-white/40 mb-2">
                Products ({results.length})
              </div>
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center space-x-4 p-2.5 rounded hover:bg-white/5 transition-colors group"
                >
                  <img
                    src={product.images[0]?.image_url || '/products/hoodie_vintage_black_front.jpg'}
                    alt={product.name}
                    className="w-14 h-16 object-cover rounded bg-[#1e1e1e] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-widest text-[#777777] block font-mono">
                      {product.brand_collection}
                    </span>
                    <h4 className="text-sm font-semibold text-white group-hover:text-neutral-300 truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-xs font-bold text-white">
                        {formatZAR(product.sale_price ?? product.base_price)}
                      </span>
                      {product.sale_price && (
                        <span className="text-[11px] text-white/40 line-through">
                          {formatZAR(product.base_price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          )}

          {/* Quick Recommendations when search is empty */}
          {!isLoading && query.trim().length < 2 && (
            <div className="py-4">
              <span className="text-[11px] uppercase tracking-widest font-mono text-white/40 block mb-3">
                Suggested Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {['Heavyweight Hoodie', 'Vintage Connoisseurs', 'Archival Tee', 'Dad Cap', 'Limited Drops'].map(
                  (term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/80 hover:text-white hover:border-white/30 hover:bg-white/5 transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="p-3 bg-white/5 border-t border-white/10 text-center">
            <button
              onClick={handleSearchSubmit}
              className="text-xs uppercase tracking-widest font-bold text-white hover:underline"
            >
              View all results for &ldquo;{query}&rdquo; &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
