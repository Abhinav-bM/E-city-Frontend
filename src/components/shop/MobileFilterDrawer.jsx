"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";
import { useRouter, useSearchParams } from "next/navigation";

const MobileFilterDrawer = ({ isOpen, onClose }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClear = () => {
    const type = searchParams.get("type");
    if (type) router.push(`/shop?type=${type}`);
    else router.push("/shop");
    // We don't necessarily close the drawer here, they might want to apply new filters after clearing
  };
  // Prevent scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.width = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.width = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div
        className={`relative w-[85vw] max-w-[320px] h-full bg-white shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white sticky top-0 z-10 shrink-0">
          <h2 className="font-bold text-lg text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pt-2 px-1">
          <FilterSidebar className="border-none shadow-none bg-transparent rounded-none max-h-none static" />
        </div>

        {/* Footer CTA */}
        <div className="p-5 border-t border-gray-100 bg-white sticky bottom-0 z-10 shrink-0 flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-900 text-white font-semibold py-3 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-black transition-all duration-200 active:scale-[0.98]"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterDrawer;
