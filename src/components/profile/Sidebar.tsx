"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";

const ProfileSidebar = () => {
  const pathname = usePathname();
  const navItems = [
    { label: "Profile", href: "/profile", icon: <User size={18} /> },
    {
      label: "Addresses",
      href: "/profile/addresses",
      icon: <MapPin size={18} />,
    },
    {
      label: "My Orders",
      href: "/profile/orders",
      icon: <ShoppingBag size={18} />,
    },
    {
      label: "Returns",
      href: "/profile/returns",
      icon: <RotateCcw size={18} />,
    },
    { label: "Wishlist", href: "/wishlist", icon: <Heart size={18} /> },
  ];

  return (
    <aside className="w-full md:w-60 shrink-0">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">My Account</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage your details</p>
        </div>
        <nav className="p-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.icon}
                {item.label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
