"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";
import { useRouter, useSearchParams } from "next/navigation";

const MobileFilterDrawer = ({ isOpen, onClose }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClear = () => {
    router.push("/shop");
  };

  // Animate in/out
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end lg:hidden">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`relative w-full max-h-[85vh] bg-white rounded-t-2xl shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ease-out ${
          isAnimating ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0">
          <h2 className="font-bold text-base text-slate-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors duration-200"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pt-2 px-1">
          <FilterSidebar
            hideHeader
            className="border-none shadow-none bg-transparent rounded-none max-h-none static"
          />
        </div>

        {/* Footer CTA */}
        <div className="p-4 border-t border-slate-100 bg-white shrink-0 flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 bg-white border border-slate-200 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors duration-200 active:scale-[0.98]"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-900 text-white font-semibold py-3 rounded-xl shadow-sm hover:bg-slate-800 transition-all duration-200 active:scale-[0.98]"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterDrawer;
