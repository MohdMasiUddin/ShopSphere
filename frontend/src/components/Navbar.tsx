
import { useState } from 'react';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartDrawer from './CartDrawer';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);

    window.dispatchEvent(
      new CustomEvent('shopsphere:search', {
        detail: value,
      })
    );

    if (value.trim()) {
      document.getElementById('product-grid')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e9e6df] bg-[#f8f7f3]/95 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button className="lg:hidden" aria-label="Open menu">
            <Menu size={21} strokeWidth={1.5} />
          </button>

          <div className="hidden items-center gap-8 text-xs tracking-[0.12em] text-[#55534d] lg:flex">
            <a href="#shop" className="transition-colors hover:text-[#b18b4d]">
              SHOP
            </a>
            <a href="#collections" className="transition-colors hover:text-[#b18b4d]">
              COLLECTIONS
            </a>
            <a href="#about" className="transition-colors hover:text-[#b18b4d]">
              OUR STORY
            </a>
          </div>

          <a
            href="/"
            className="display-font absolute left-1/2 -translate-x-1/2 text-2xl font-semibold tracking-[0.12em]"
          >
            SHOPSPHERE<span className="text-[#b18b4d]">.</span>
          </a>

          <div className="flex items-center gap-5">
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isSearchOpen) handleSearch('');
              }}
              aria-label={isSearchOpen ? 'Close search' : 'Open search'}
              className="transition-transform hover:scale-110"
            >
              {isSearchOpen ? (
                <X size={20} strokeWidth={1.5} />
              ) : (
                <Search size={20} strokeWidth={1.5} />
              )}
            </button>

            <button
              onClick={() => {
                if (user) {
                  logout();
                } else {
                  setIsAuthOpen(true);
                }
              }}
              aria-label={user ? 'Sign out' : 'Account'}
              title={user ? `Signed in as ${user.name} — click to sign out` : 'Sign in or register'}
              className="hidden items-center gap-2 transition-transform hover:scale-105 sm:flex"
            >
              <User size={20} strokeWidth={1.5} />
              {user && (
                <span className="max-w-24 truncate text-xs text-[#55534d]">
                  {user.name}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping bag with ${cartCount} items`}
              className="relative transition-transform hover:scale-110"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b18b4d] px-1 text-[9px] text-white">
                {cartCount}
              </span>
            </button>
          </div>
        </nav>

        {isSearchOpen && (
          <div className="border-t border-[#e9e6df] px-6 py-4">
            <div className="mx-auto flex max-w-7xl items-center gap-3">
              <Search size={18} className="text-[#a58a5c]" />
              <input
                type="search"
                autoFocus
                value={searchQuery}
                onChange={(event) => handleSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    handleSearch('');
                    setIsSearchOpen(false);
                  }
                }}
                placeholder="Search products, collections..."
                className="w-full bg-transparent text-sm text-[#24231f] outline-none placeholder:text-[#99948a]"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="text-xs tracking-wider text-[#a58a5c] hover:text-[#24231f]"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {isAuthOpen && (
        <AuthModal onClose={() => setIsAuthOpen(false)} />
      )}
    </>
  );
}
