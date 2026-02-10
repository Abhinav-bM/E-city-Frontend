"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Heart, Plus } from "lucide-react";
import WishlistButton from "../wishlistButton";

// Assuming types are handled or import is correct
// If ProductList is not available, we can use any
interface ProductCardProps {
  product: any;
  onAddToCart: (id?: string, variantId?: string) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Get image URL or use placeholder
  const imageUrl = product?.images?.[0]?.url || product?.images?.[0]; // Handle object or string
  const hasImage = imageUrl && !imageError;

  // Calculate discount percentage
  const discount =
    product?.compareAtPrice && product.compareAtPrice > product.sellingPrice
      ? Math.round(
          ((product.compareAtPrice - product.sellingPrice) /
            product.compareAtPrice) *
            100,
        )
      : 0;

  // Determine Condition/Badges
  const getBadges = () => {
    const variants = product?.availableVariants || product?.variants || [];
    const isRefurbished = variants.some(
      (v: any) => v.condition === "Refurbished",
    );
    const isOpenBox = variants.some((v: any) => v.condition === "Open Box");
    // const isNew = !isRefurbished && !isOpenBox; // Default assumption for now

    // Check if explicitly marked as New Arrival (prop or logic)
    // For now using a hardcoded 'New' if not used.
    // Ideally pass `isNewArrival` flag.

    const badges = [];
    if (product?.isNewArrival)
      badges.push({ text: "NEW", color: "bg-blue-600 text-white" });
    if (isRefurbished)
      badges.push({ text: "Refurbished", color: "bg-green-600 text-white" });
    if (isOpenBox)
      badges.push({ text: "Open Box", color: "bg-amber-500 text-white" });

    return badges;
  };

  const badges = getBadges();

  // Stock Logic
  const stock = product?.stock || 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <div
      className={`group relative bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-100 h-full flex flex-col ${isOutOfStock ? "opacity-75" : ""}`}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {badges.map((badge, index) => (
          <span
            key={index}
            className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${badge.color}`}
          >
            {badge.text}
          </span>
        ))}
        {discount > 0 && (
          <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider bg-red-500 text-white">
            -{discount}%
          </span>
        )}
        {isLowStock && (
          <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider bg-orange-500 text-white">
            Only {stock} Left
          </span>
        )}
        {isOutOfStock && (
          <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider bg-slate-500 text-white">
            Out of Stock
          </span>
        )}
      </div>

      {/* Wishlist Button - Top Right */}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-white p-2 rounded-full shadow-md hover:bg-slate-50 cursor-pointer text-slate-400 hover:text-red-500 transition-colors">
          <Heart size={18} />
        </div>
      </div>

      <Link
        href={`/shop/${product?.slug}`}
        className="block flex-1 flex flex-col"
      >
        {/* Image Container */}
        <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
          {hasImage ? (
            <img
              src={imageUrl}
              alt={product.title}
              className={`w-full h-full object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? "grayscale" : ""}`}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              onLoad={() => setImageLoading(false)}
            />
          ) : (
            <div className="text-slate-300">
              <svg
                className="w-12 h-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Brand */}
          <p className="text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">
            {product?.brand || "E-City"}
          </p>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
            {product?.title}
          </h3>

          {/* Price & Action Row */}
          <div className="mt-auto flex items-end justify-between">
            <div>
              <div className="text-lg font-extrabold text-blue-600">
                ₹{product?.sellingPrice?.toLocaleString()}
              </div>
              {product?.compareAtPrice > product?.sellingPrice && (
                <div className="text-xs text-slate-400 line-through">
                  ₹{product?.compareAtPrice?.toLocaleString()}
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                if (!isOutOfStock) {
                  onAddToCart(product.baseProductId, product.variantId);
                }
              }}
              disabled={isOutOfStock}
              className={`p-2.5 rounded-xl transition-colors shadow-lg ${
                isOutOfStock
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200 hover:shadow-blue-200"
              }`}
            >
              <Plus size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
