import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col h-full w-full bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      {/* IMAGE AREA */}
      <div className="relative w-full aspect-square bg-gradient-to-b from-slate-50 to-slate-100/80">
        {/* Badge placeholder */}
        <div className="absolute top-3 left-3 w-14 h-5 bg-slate-200/60 rounded-full" />
        {/* Wishlist placeholder */}
        <div className="absolute top-3 right-3 w-9 h-9 bg-white/60 rounded-full" />
      </div>

      {/* CONTENT AREA */}
      <div className="flex flex-col flex-1 px-4 pb-4 pt-3">
        {/* Brand placeholder */}
        <div className="h-2.5 w-14 bg-slate-100 rounded mb-1.5" />

        {/* Title placeholder (2 lines) */}
        <div className="mb-1.5">
          <div className="h-3.5 bg-slate-100 rounded w-full mb-1.5" />
          <div className="h-3.5 bg-slate-100 rounded w-2/3" />
        </div>

        {/* Variant placeholder */}
        <div className="h-2.5 bg-slate-50 rounded w-1/3 mb-3" />

        {/* Price placeholder */}
        <div className="flex items-baseline gap-2 mb-3">
          <div className="h-5 w-20 bg-slate-200 rounded" />
          <div className="h-3 w-12 bg-slate-100 rounded" />
        </div>

        {/* Button placeholder — full width */}
        <div className="mt-auto">
          <div className="h-11 w-full bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
