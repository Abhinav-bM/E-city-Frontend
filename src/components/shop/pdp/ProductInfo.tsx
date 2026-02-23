"use client";

import React from "react";
import { Variant } from "./types";

interface ProductInfoProps {
  title: string;
  variant: Variant;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ title, variant }) => {
  const { price, compareAtPrice, stock } = variant;

  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  const isLowStock = stock > 0 && stock <= 5;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {/* Subtle Condition Tag */}
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-white shadow-sm text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
            {variant.condition === "New"
              ? "Brand New"
              : variant.condition === "Open Box"
                ? "Open Box"
                : variant.condition === "Refurbished"
                  ? "Certified Refurbished"
                  : "Pre-Owned"}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-extrabold text-slate-900 leading-[1.15] tracking-tight">
          {title}
        </h1>

        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
          {variant.attributes?.Color && <span>{variant.attributes.Color}</span>}
          {variant.attributes?.Storage && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span>{variant.attributes.Storage}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mt-2">
        <div className="flex items-end gap-3">
          <span className="text-[2.5rem] font-extrabold text-slate-900 tracking-[-0.04em] leading-none decoration-slate-900">
            ₹{price?.toLocaleString()}
          </span>
          {compareAtPrice > price && (
            <span className="text-xl text-slate-400 line-through font-semibold mb-1">
              ₹{compareAtPrice?.toLocaleString()}
            </span>
          )}
        </div>

        {compareAtPrice > price && (
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Save {discount}% today
          </span>
        )}
      </div>

      {/* Stock Status - Minimalist */}
      <div className="flex items-center gap-2 mt-4">
        {stock === 0 ? (
          <div className="inline-flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-[10px] font-bold text-red-700 uppercase tracking-widest">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <div className="inline-flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">
              Limited: {stock} units left
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
              Available in Stock
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
