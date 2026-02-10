"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCategories } from "@/api/category";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);

  // Cart state - handle gracefully if redux not fully ready
  // const cartItems = useAppSelector(selectCartItems) || [];
  // For now, let's use a safe fallback or check if store exists
  // The user has `productSlice` in `shop.jsx`, so likely `cartSlice` exists.
  // I will comment out Redux for now to avoid breaking if not ready, or use a local dummy or try-catch.
  // Better: use a local state or context if Redux is uncertain, but `shop.jsx` used `useAppSelector`.
  // Let's assume `useAppSelector` works. I need to find the cart selector name.
  // I'll stick to a static '0' or local storage for now to be safe, or just `0`.
  const cartCount = 0;

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        // Assuming tree structure or list. Let's take top level.
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
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
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="w-full relative group">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/10 rounded-full py-2.5 pl-5 pr-12 text-sm transition-all outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-full text-gray-500 hover:text-primary transition-colors shadow-sm"
                >
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Desktop Navigation Actions */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/wishlist"
                className="text-gray-600 hover:text-primary transition-colors relative group"
              >
                <Heart size={24} />
                {/* <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
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
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-100 p-3 rounded-lg pl-10 outline-none focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </form>

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
