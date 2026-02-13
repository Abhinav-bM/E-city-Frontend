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
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
            Condition
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            {variant.condition === "New"
              ? "Brand New"
              : variant.condition === "Open Box"
                ? "Open Box"
                : variant.condition === "Refurbished"
                  ? "Certified Refurbished"
                  : "Pre-Owned"}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight tracking-tight">
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

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-slate-900 tracking-tight">
            ₹{price?.toLocaleString()}
          </span>
          {compareAtPrice > price && (
            <span className="text-xl text-slate-300 line-through font-medium">
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
      <div className="flex items-center gap-2 mt-2">
        {stock === 0 ? (
          <>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
              Out of Stock
            </span>
          </>
        ) : isLowStock ? (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Limited: {stock} units left
            </span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Available in Stock
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
