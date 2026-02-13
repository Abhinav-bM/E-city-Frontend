import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col h-full w-full bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      {/* IMAGE AREA SKELETON */}
      <div className="relative w-full aspect-square bg-gray-100 p-4">
        {/* Badge Placeholder */}
        <div className="absolute top-3 left-3 w-12 h-4 bg-gray-200 rounded-full" />
        {/* Wishlist Placeholder */}
        <div className="absolute top-3 right-3 w-6 h-6 bg-gray-200 rounded-full" />
      </div>

      {/* CONTENT AREA SKELETON */}
      <div className="flex flex-col flex-1 px-4 pb-4 pt-2">
        {/* Title Placeholder (2 lines to match min-h) */}
        <div className="mb-2">
          <div className="h-4 bg-gray-100 rounded w-full mb-1.5" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
        </div>

        {/* Variant Placeholder */}
        <div className="mt-1 h-3 bg-gray-50 rounded w-1/3 mb-2" />

        {/* Footer Placeholder (Push to bottom) */}
        <div className="mt-auto flex items-end justify-between gap-2">
          {/* Price */}
          <div className="flex flex-col gap-1">
            <div className="h-2 w-8 bg-gray-100 rounded" />
            <div className="h-5 w-16 bg-gray-200 rounded" />
          </div>

          {/* Button Placeholder (Pill shape) */}
          <div className="h-9 w-20 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
