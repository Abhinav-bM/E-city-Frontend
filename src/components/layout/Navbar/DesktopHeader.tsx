"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  ChevronDown,
  Menu,
} from "lucide-react";
import { IconButton } from "@/components/ui";

const DesktopHeader: React.FC = () => {
  const cartCount = 0; // Replace with Redux state later
  const wishlistCount = 0; // Replace with Redux state later

  return (
    <header className="hidden md:block w-full sticky top-0 z-[var(--z-fixed)] bg-navy-800 text-white shadow-navbar">
      {/* Top Bar (Very thin, for contact/offers) */}
      <div className="bg-navy-900 py-1.5 px-6">
        <div className="max-w-[var(--container-max-width)] mx-auto flex justify-between items-center text-[11px] font-medium text-navy-300">
          <div className="flex items-center gap-4">
            <span>Welcome to E-City Mobiles</span>
            <Link
              href="/contact"
              className="hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/track-order"
              className="hover:text-white transition-colors"
            >
              Track Your Order
            </Link>
            <span className="text-blue-400 font-bold">
              SALE: Up to 50% Off Refurbished Phones
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-6 h-[var(--navbar-height-desktop)] border-b border-navy-700/50">
        <div className="max-w-[var(--container-max-width)] mx-auto h-full flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative h-10 w-32">
              <Image
                src="/logo.png"
                alt="E-City Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-2xl relative">
            <div className="flex">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400">
                  <Search size={20} />
                </span>
                <input
                  type="text"
                  placeholder="Search for smartphones, laptops, accessories..."
                  className="w-full h-11 pl-11 pr-4 bg-navy-900 border border-navy-700 text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-l-md transition-all"
                />
              </div>
              <button className="h-11 px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-r-md transition-colors border border-blue-500 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200">
                Search
              </button>
            </div>
          </div>

          {/* Actions - Right */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/profile">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="w-9 h-9 rounded-full bg-navy-700 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <User size={18} />
                </div>
                <div className="hidden lg:block text-left text-sm">
                  <p className="text-navy-300 text-[11px] leading-tight font-medium">
                    Hello, Sign In
                  </p>
                  <p className="font-semibold leading-tight">My Account</p>
                </div>
              </div>
            </Link>

            <Link href="/wishlist">
              <IconButton
                label="Wishlist"
                variant="ghost"
                className="text-white hover:bg-white/10"
                badge={wishlistCount}
              >
                <Heart size={22} />
              </IconButton>
            </Link>

            <Link href="/cart">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group ml-1">
                <div className="relative">
                  <div className="text-white group-hover:text-blue-400 transition-colors">
                    <ShoppingCart size={24} />
                  </div>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold px-1 ring-2 ring-navy-800">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block text-left text-sm">
                  <p className="text-navy-300 text-[11px] leading-tight font-medium">
                    Shopping
                  </p>
                  <p className="font-semibold leading-tight">Cart</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Nav Bar */}
      <div className="bg-surface-card border-b border-border-default text-text-primary hidden md:block">
        <div className="max-w-[var(--container-max-width)] mx-auto px-6 h-12 flex items-center gap-8">
          {/* All Categories Dropdown Trigger */}
          <div className="flex items-center gap-2 h-full px-4 bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 cursor-pointer transition-colors border-x border-blue-100">
            <Menu size={20} />
            <span className="text-sm">All Categories</span>
            <ChevronDown size={16} className="ml-2" />
          </div>

          {/* Top Links */}
          <nav className="flex items-center gap-6 h-full text-sm font-medium">
            <Link
              href="/shop"
              className="hover:text-blue-600 transition-colors flex items-center h-full border-b-2 border-transparent hover:border-blue-500"
            >
              New Arrivals
            </Link>
            <Link
              href="/shop?condition=refurbished"
              className="hover:text-blue-600 transition-colors flex items-center h-full border-b-2 border-transparent hover:border-blue-500"
            >
              Refurbished Store
            </Link>
            <Link
              href="/shop?category=smartphones"
              className="hover:text-blue-600 transition-colors flex items-center h-full border-b-2 border-transparent hover:border-blue-500"
            >
              Smartphones
            </Link>
            <Link
              href="/shop?category=laptops"
              className="hover:text-blue-600 transition-colors flex items-center h-full border-b-2 border-transparent hover:border-blue-500"
            >
              Laptops
            </Link>
            <Link
              href="/shop?category=accessories"
              className="hover:text-blue-600 transition-colors flex items-center h-full border-b-2 border-transparent hover:border-blue-500"
            >
              Accessories
            </Link>
          </nav>

          <div className="ml-auto text-sm font-bold text-red hover:text-red/80 transition-colors cursor-pointer flex items-center gap-1">
            Flash Sale Today!
          </div>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
