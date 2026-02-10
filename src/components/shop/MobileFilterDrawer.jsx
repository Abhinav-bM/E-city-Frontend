"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";

const MobileFilterDrawer = ({ isOpen, onClose }) => {
  // Prevent scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative w-4/5 max-w-xs h-full bg-white shadow-xl flex flex-col animate-in slide-in-from-left duration-300">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="font-bold text-lg text-slate-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-red-500 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <FilterSidebar className="border-none p-0 shadow-none" />
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full bg-slate-900 text-white font-semibold py-3 rounded-lg"
          >
            View Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterDrawer;
