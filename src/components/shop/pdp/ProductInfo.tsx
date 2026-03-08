"use client";

import React from "react";
import { Variant } from "./types";

interface ProductInfoProps {
  title: string;
  brand?: string;
  variant: Variant;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ title, brand, variant }) => {
  const { price, compareAtPrice, stock } = variant;

  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : 0;

  const isLowStock = stock > 0 && stock <= 5;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        {brand && (
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.12em] font-semibold text-slate-400">
            {brand}
          </span>
        )}

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold text-slate-900 leading-[1.15] tracking-tight">
          {title}
        </h1>

        <div className="flex items-center gap-2 mt-1">
          {variant.condition === "New" ? (
            <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
              Brand New
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
              {variant.condition === "Open Box"
                ? "Open Box"
                : variant.condition === "Refurbished"
                  ? "Certified Refurbished"
                  : "Pre-Owned"}
            </span>
          )}

          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium ml-2">
            {variant.attributes?.Color && (
              <span>{variant.attributes.Color}</span>
            )}
            {variant.attributes?.Storage && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                <span>{variant.attributes.Storage}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mt-2">
        {compareAtPrice > price && (
          <span className="text-lg sm:text-xl text-slate-400 line-through font-medium mb-[-6px]">
            ₹{compareAtPrice?.toLocaleString("en-IN")}
          </span>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl sm:text-[2.5rem] font-extrabold text-slate-900 tracking-tight leading-none">
            ₹{price?.toLocaleString("en-IN")}
          </span>
          {compareAtPrice > price && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-white bg-rose-500 px-2.5 py-0.5 rounded-full shadow-sm">
                -{discount}%
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                Save ₹{(compareAtPrice - price).toLocaleString("en-IN")}
              </span>
            </div>
          )}
        </div>

        <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 mt-1">
          <span>Inclusive of all taxes</span>
          <span className="w-1 h-1 rounded-full bg-slate-200"></span>
          <span className="text-slate-600 font-semibold">
            {variant.inventoryType === "Unique"
              ? "Refurbished Unit"
              : "Standard Retail Unit"}
          </span>
        </div>
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
