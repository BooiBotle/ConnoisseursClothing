import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const { totalItemsCount, openDrawer } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
    setCollectionsDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    {
      name: 'Collections',
      path: '/collections',
      hasDropdown: true,
      children: [
        { name: 'Hoodies & Sweatshirts', path: '/collections/hoodies-sweatshirts' },
        { name: 'T-Shirts & Tops', path: '/collections/t-shirts' },
        { name: 'Caps & Headwear', path: '/collections/caps-headwear' },
        { name: 'Limited Drops', path: '/collections/limited-edition' },
        { name: 'Accessories', path: '/collections/accessories' }
      ]
    },
    { name: 'New Arrivals', path: '/shop?filter=new' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050505]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-3'
            : 'bg-[#050505] border-b border-white/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Hamburger button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-white/80 hover:text-white focus:outline-none"
                aria-label="Open mobile navigation"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2 ml-1 text-white/80 hover:text-white"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo (Center on mobile, Left on desktop) */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3 group">
                <img
                  src="/brand/connoisseurs_show_light.png"
                  alt="The Connoisseurs Show Logo"
                  className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-display tracking-widest text-lg sm:text-xl font-bold uppercase text-white leading-none">
                    THE CONNOISSEURS SHOW
                  </span>
                  <span className="text-[10px] tracking-[0.25em] text-[#777777] font-sans uppercase mt-0.5">
                    VINTAGE MERCHANDISE
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.name}
                      className="relative"
                      onMouseEnter={() => setCollectionsDropdownOpen(true)}
                      onMouseLeave={() => setCollectionsDropdownOpen(false)}
                    >
                      <button
                        type="button"
                        className={`flex items-center space-x-1 text-xs uppercase tracking-widest font-semibold transition-colors py-2 ${
                          location.pathname.startsWith('/collections')
                            ? 'text-white border-b-2 border-white'
                            : 'text-[#b3b3b3] hover:text-white'
                        }`}
                      >
                        <span>{link.name}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                      </button>

                      {/* Dropdown Menu */}
                      {collectionsDropdownOpen && (
                        <div className="absolute left-0 top-full pt-2 w-56 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="bg-[#141414] border border-white/10 rounded-sm shadow-2xl p-2 backdrop-blur-lg">
                            {link.children?.map((child) => (
                              <Link
                                key={child.name}
                                to={child.path}
                                className="block px-3 py-2 text-xs uppercase tracking-wider text-[#b3b3b3] hover:text-white hover:bg-white/5 transition-colors rounded-xs"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-xs uppercase tracking-widest font-semibold transition-all py-1 relative ${
                      isActive ? 'text-white' : 'text-[#b3b3b3] hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons: Search, Account, Bag */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              <button
                type="button"
                onClick={onOpenSearch}
                aria-label="Search Catalog"
                className="hidden lg:flex items-center space-x-2 text-white/70 hover:text-white transition-colors p-1"
              >
                <Search className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider text-white/50">Search</span>
              </button>

              <Link
                to="/account"
                aria-label="Account / Track Orders"
                className="text-white/70 hover:text-white transition-colors p-1"
                title="Account / Track Orders"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Shopping Bag Button */}
              <button
                type="button"
                onClick={openDrawer}
                aria-label={`Shopping bag with ${totalItemsCount} items`}
                className="relative text-white/90 hover:text-white transition-transform active:scale-95 p-1 flex items-center"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-white text-black font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg font-mono animate-in zoom-in">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#0d0d0d] border-r border-white/10 h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header inside mobile drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2">
                  <img src="/brand/connoisseurs_show_light.png" alt="Logo" className="h-10 w-auto" />
                  <span className="font-display text-lg tracking-wider font-bold text-white uppercase">
                    THE CONNOISSEURS SHOW
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-white/60 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="mt-6 flex flex-col space-y-4">
                <Link
                  to="/"
                  className="text-base uppercase tracking-widest font-semibold text-white hover:text-neutral-400 py-1"
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  className="text-base uppercase tracking-widest font-semibold text-white hover:text-neutral-400 py-1"
                >
                  Shop All Merchandise
                </Link>

                <div className="pt-2 pb-2">
                  <span className="text-[11px] uppercase tracking-widest text-[#777777] font-mono block mb-2">
                    Collections
                  </span>
                  <div className="pl-3 border-l border-white/10 flex flex-col space-y-2.5">
                    <Link
                      to="/collections/hoodies-sweatshirts"
                      className="text-sm uppercase tracking-wider text-neutral-300 hover:text-white"
                    >
                      Hoodies &amp; Sweatshirts
                    </Link>
                    <Link
                      to="/collections/t-shirts"
                      className="text-sm uppercase tracking-wider text-neutral-300 hover:text-white"
                    >
                      T-Shirts &amp; Tops
                    </Link>
                    <Link
                      to="/collections/caps-headwear"
                      className="text-sm uppercase tracking-wider text-neutral-300 hover:text-white"
                    >
                      Caps &amp; Headwear
                    </Link>
                    <Link
                      to="/collections/limited-edition"
                      className="text-sm uppercase tracking-wider text-neutral-300 hover:text-white flex items-center space-x-1"
                    >
                      <span>Limited Drops</span>
                      <Sparkles className="w-3 h-3 text-amber-400 inline" />
                    </Link>
                    <Link
                      to="/collections/accessories"
                      className="text-sm uppercase tracking-wider text-neutral-300 hover:text-white"
                    >
                      Accessories
                    </Link>
                  </div>
                </div>

                <Link
                  to="/shop?filter=new"
                  className="text-base uppercase tracking-widest font-semibold text-white hover:text-neutral-400 py-1"
                >
                  New Arrivals
                </Link>
                <Link
                  to="/about"
                  className="text-base uppercase tracking-widest font-semibold text-white hover:text-neutral-400 py-1"
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="text-base uppercase tracking-widest font-semibold text-white hover:text-neutral-400 py-1"
                >
                  Contact
                </Link>
                <Link
                  to="/account"
                  className="text-base uppercase tracking-widest font-semibold text-white hover:text-neutral-400 py-1"
                >
                  Track Order / Account
                </Link>
              </div>
            </div>

            {/* Mobile Footer Area */}
            <div className="pt-6 border-t border-white/10">
              <img
                src="/brand/vintage_connoisseurs_light.png"
                alt="Vintage Connoisseurs"
                className="h-8 w-auto opacity-75 mb-3"
              />
              <p className="text-xs text-[#777777] font-sans">
                Official Streetwear &amp; Vintage Music Culture Merchandise. Nationwide Delivery Across South Africa.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
