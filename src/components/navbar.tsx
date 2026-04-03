"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCategories } from "@/api/category";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchWishlist } from "@/store/wishlistSlice";
import { fetchCartHook } from "@/store/cartSlice";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  Package,
} from "lucide-react";
import { Category, BaseProduct } from "@/types";

// For the instant search API call
import { getProducts } from "@/api/product";

// Module-level flags — survive component re-mounts during SPA navigation
let _wishlistFetched = false;
let _cartFetched = false;
let _categoriesFetched = false;

const Navbar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Refs for click-outside detection
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const { isAuthenticated } = useAppSelector((state: any) => state.user);
  const { items: wishlistItems } = useAppSelector(
    (state: any) => state.wishlist,
  );
  const { totalItems: cartCount } = useAppSelector((state: any) => state.cart);

  // Global Initializers — fetch wishlist/cart once when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (!_wishlistFetched) {
        _wishlistFetched = true;
        dispatch(fetchWishlist());
      }
      if (!_cartFetched) {
        _cartFetched = true;
        dispatch(fetchCartHook());
      }
    }
  }, [isAuthenticated, dispatch]);

  // Fetch Categories — only once per SPA session
  useEffect(() => {
    if (_categoriesFetched) return;
    _categoriesFetched = true;
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCats();
  }, []);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Instant Search Logic ---
  // 1. Debounce the input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. Fetch results when debounced query changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearchLoading(true);
      setShowDropdown(true);

      try {
        // limit=5 to only show top results in dropdown
        const res = await getProducts({ search: debouncedQuery, limit: 5 });
        if (res.data?.success) {
          setSearchResults(res.data.data.products || []);
        }
      } catch (error) {
        console.error("Search fetch error:", error);
      } finally {
        setIsSearchLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery]);

  // 3. Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
  };

  const handleResultClick = (slug: string) => {
    setShowDropdown(false);
    setSearchQuery("");
    setMobileMenuOpen(false);
    router.push(`/shop/${slug}`);
  };

  // Shared dropdown UI renderer
  const renderSearchDropdown = (isMobile = false) => {
    if (!showDropdown || !searchQuery.trim()) return null;

    return (
      <div
        className={`absolute z-50 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden ${
          isMobile
            ? "top-full left-0 right-0 mt-2"
            : "top-full left-0 right-0 mt-2"
        }`}
      >
        {isSearchLoading ? (
          <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center space-x-2">
            <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span>Searching...</span>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="max-h-[360px] overflow-y-auto">
            <ul className="divide-y divide-gray-50">
              {searchResults.map((product) => (
                <li key={product._id}>
                  <button
                    onClick={() => handleResultClick(product.slug)}
                    className="w-full text-left p-3 hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-md bg-gray-100 shrink-0 overflow-hidden relative border border-gray-100">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package size={16} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {product.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-gray-900">
                          ₹{product.sellingPrice?.toLocaleString("en-IN")}
                        </span>
                        {product.condition && product.condition !== "New" && (
                          <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium border border-amber-100">
                            {product.condition}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <div className="p-2 border-t border-gray-50 bg-gray-50/50">
              <button
                onClick={handleSearchSubmit}
                className="w-full py-2 text-xs font-bold text-primary hover:text-primary-dark transition-colors text-center"
              >
                View all results for "{searchQuery}"
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-sm text-gray-500">
            No products found for "{searchQuery}"
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-white border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold text-gray-900 tracking-tight"
              >
                E-City<span className="text-primary">.</span>
              </Link>
            </div>

            {/* Desktop Search */}
            <div
              className="hidden md:flex flex-1 max-w-lg mx-8 relative"
              ref={desktopSearchRef}
            >
              <form
                onSubmit={handleSearchSubmit}
                className="w-full relative group"
              >
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/10 rounded-full py-2.5 pl-5 pr-12 text-sm transition-all outline-none"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim()) setShowDropdown(true);
                  }}
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-full text-gray-500 hover:text-primary transition-colors shadow-sm"
                >
                  <Search size={18} />
                </button>
              </form>

              {/* Desktop Dropdown */}
              {renderSearchDropdown(false)}
            </div>

            {/* Desktop Navigation Actions */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/wishlist"
                className="text-gray-600 hover:text-red-500 transition-colors relative group"
              >
                <Heart size={24} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="text-gray-600 hover:text-primary transition-colors relative group"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-2 text-gray-700 hover:text-primary font-medium transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                  <User size={18} />
                </div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-4">
              <Link href="/cart" className="text-gray-600 relative">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 p-2 -mr-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Spacer for Fixed Header */}
      <div className="h-16"></div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-sm md:hidden pt-20 px-6">
          <div className="mb-8 relative" ref={mobileSearchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-gray-100 p-3 rounded-lg pl-10 outline-none focus:ring-2 focus:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim()) setShowDropdown(true);
                  }}
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </form>

            {/* Mobile Dropdown */}
            {renderSearchDropdown(true)}
          </div>

          <nav className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Menu
              </h3>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-medium text-gray-900"
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-medium text-gray-900"
              >
                Shop All
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-medium text-gray-900"
              >
                Wishlist
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-medium text-gray-900"
              >
                My Account
              </Link>
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Categories
              </h3>
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/shop?category=${cat._id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base text-gray-600 py-1"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
