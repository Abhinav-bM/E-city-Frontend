"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";

const MobileFilterDrawer = ({ isOpen, onClose }) => {
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
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop - Animated */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 ease-out"
        onClick={onClose}
        style={{ animation: "fadeIn 0.3s ease-out" }}
      />

      {/* Drawer Content - Animated Slide In */}
      <div
        className="relative w-[80vw] max-w-xs h-full bg-card border-r border-border/40 shadow-2xl flex flex-col overflow-hidden"
        style={{ animation: "slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/30 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <h2 className="font-bold text-xl text-foreground">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-muted/60 rounded-lg transition-all duration-200 active:scale-95"
            aria-label="Close filters"
          >
            <X size={22} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-0">
          <FilterSidebar className="border-none p-6 shadow-none bg-transparent rounded-none" />
        </div>

        {/* Footer CTA */}
        <div className="p-5 border-t border-border/30 bg-card/50 backdrop-blur-sm sticky bottom-0 z-10 space-y-2">
          <button
            onClick={onClose}
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-primary/40"
          >
            View Results
          </button>
          <button
            onClick={onClose}
            className="w-full bg-muted text-foreground font-semibold py-2.5 rounded-lg hover:bg-muted/80 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterDrawer;
