"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { IconButton, Input, Drawer } from "@/components/ui";
import Image from "next/image";

const MobileHeader: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = 0; // Replace with Redux state later

  return (
    <>
      <header className="md:hidden sticky top-0 z-[var(--z-fixed)] bg-navy-800 text-white shadow-navbar transition-all duration-300">
        <div className="flex items-center justify-between px-4 h-[var(--navbar-height-mobile)]">
          {/* Menu Toggle */}
          <IconButton
            label="Open Menu"
            variant="ghost"
            className="text-white hover:bg-white/10 active:bg-white/20 -ml-2"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={24} />
          </IconButton>

          {/* Logo */}
          <Link href="/" className="flex-1 flex justify-center py-2">
            <div className="relative h-7 w-24">
              <Image
                src="/logo.png"
                alt="E-City Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-1 -mr-2">
            <IconButton
              label="Search"
              variant="ghost"
              className="text-white hover:bg-white/10 active:bg-white/20"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={22} />
            </IconButton>
            <Link href="/cart">
              <IconButton
                label="Cart"
                variant="ghost"
                className="text-white hover:bg-white/10 active:bg-white/20"
                badge={cartCount}
              >
                <ShoppingCart size={22} />
              </IconButton>
            </Link>
          </div>
        </div>

        {/* Expandable Search Area */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out bg-navy-900 border-t border-white/10 ${
            isSearchOpen
              ? "max-h-20 opacity-100"
              : "max-h-0 opacity-0 border-transparent"
          }`}
        >
          <div className="p-3">
            <Input
              type="text"
              placeholder="Search mobiles, laptops..."
              inputSize="md"
              leftIcon={<Search size={18} />}
              clearable
              className="bg-navy-800 border-navy-700 text-white placeholder:text-navy-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <Drawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        side="left"
        className="bg-surface-page"
      >
        <div className="flex flex-col h-full">
          <div className="bg-navy-800 text-white p-6 flex items-start justify-between rounded-br-3xl shadow-lg">
            <div>
              <h2 className="text-xl font-bold mb-1">Welcome to E-City</h2>
              <p className="text-blue-200 text-sm">
                Login to manage your orders
              </p>
              <Link
                href="/login"
                className="inline-block mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login / Register
              </Link>
            </div>
            <IconButton
              label="Close Menu"
              variant="ghost"
              className="text-white hover:bg-white/10 -mt-2 -mr-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={24} />
            </IconButton>
          </div>

          <div className="flex-1 overflow-y-auto p-4 py-6 space-y-6">
            <div className="space-y-1">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 ml-4">
                Categories
              </p>
              <Link
                href="/shop?category=smartphones"
                className="flex items-center px-4 py-3 rounded-xl hover:bg-surface-card text-text-primary font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Smartphones
              </Link>
              <Link
                href="/shop?category=tablets"
                className="flex items-center px-4 py-3 rounded-xl hover:bg-surface-card text-text-primary font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Tablets
              </Link>
              <Link
                href="/shop?category=laptops"
                className="flex items-center px-4 py-3 rounded-xl hover:bg-surface-card text-text-primary font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Laptops & MacBooks
              </Link>
              <Link
                href="/shop?category=accessories"
                className="flex items-center px-4 py-3 rounded-xl hover:bg-surface-card text-text-primary font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Accessories
              </Link>
            </div>

            <div className="h-px bg-border-default mx-4" />

            <div className="space-y-1">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 ml-4">
                Support
              </p>
              <Link
                href="/profile/orders"
                className="flex items-center px-4 py-3 rounded-xl hover:bg-surface-card text-text-primary font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Track Order
              </Link>
              <Link
                href="/contact"
                className="flex items-center px-4 py-3 rounded-xl hover:bg-surface-card text-text-primary font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
              <Link
                href="/faq"
                className="flex items-center px-4 py-3 rounded-xl hover:bg-surface-card text-text-primary font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default MobileHeader;
