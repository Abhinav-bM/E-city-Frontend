"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";

export function BottomNavigation() {
  const pathname = usePathname();

  const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Cart", href: "/cart", icon: ShoppingBag, badge: 2 }, // badge is mocked here
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      <div
        className="h-[calc(64px+env(safe-area-inset-bottom))]"
        aria-hidden="true"
      />
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white/95 pb-safe backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-screen-md items-center justify-around px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`relative flex h-full min-w-[64px] flex-col items-center justify-center gap-1 transition-colors active:scale-95 ${
                  isActive
                    ? "text-slate-900"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <div className="relative">
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {tab.badge && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}
                >
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
