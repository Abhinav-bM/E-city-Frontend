"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, Heart, User } from "lucide-react";

// Optional: import { useSelector } from "react-redux" later when hooking up state

const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  // We'll wire up the actual cart/wishlist count from Redux later
  // const cartItems = useSelector((state: any) => state.cart.items);
  const cartCount = 0; // Replace with actual state
  const wishlistCount = 0; // Replace with actual state

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/shop", icon: Search },
    { name: "Cart", href: "/cart", icon: ShoppingCart, badge: cartCount },
    { name: "Wishlist", href: "/wishlist", icon: Heart, badge: wishlistCount },
    { name: "Account", href: "/profile", icon: User },
  ];

  return (
    <>
      <div className="h-[var(--bottom-nav-height)] md:hidden w-full flex-shrink-0" />
      <nav
        className="
          fixed bottom-0 left-0 right-0 h-[var(--bottom-nav-height)]
          bg-surface-card border-t border-border-default
          flex items-center justify-around
          pb-safe z-[var(--z-bottom-nav)]
          shadow-bottom-nav
          md:hidden
        "
        aria-label="Bottom Navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                touch-target relative flex flex-col items-center justify-center w-full h-full
                transition-colors duration-200
                ${isActive ? "text-blue-500" : "text-text-muted hover:text-text-secondary"}
              `}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative mb-1">
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-transform duration-200 ${isActive ? "scale-110" : ""}`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold px-1 ring-2 ring-surface-card">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${isActive ? "font-semibold" : ""}`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default MobileBottomNav;
