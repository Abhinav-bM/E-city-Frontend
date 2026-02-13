"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useMemo } from "react";
import { ShoppingCart, Image as ImageIcon } from "lucide-react";
import WishlistButton from "../wishlistButton";

interface ProductCardProps {
  product: any;
  onAddToCart: (id?: string, variantId?: string) => void;
}

const ProductCard = React.memo(({ product, onAddToCart }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);

  // --- Data Processing ---
  const imageUrl = product?.images?.[0]?.url || product?.images?.[0];
  const hasImage = imageUrl && !imageError;

  const sellingPrice = product?.sellingPrice || 0;
  const compareAtPrice = product?.compareAtPrice || 0;
  const hasDiscount = compareAtPrice > sellingPrice;
  const discount = hasDiscount
    ? Math.round(((compareAtPrice - sellingPrice) / compareAtPrice) * 100)
    : 0;

  const stock = product?.stock || 0;
  const isOutOfStock = stock === 0;
  const isNew = product?.condition === "New";
  const condition = product?.conditionGrade || product?.condition;

  // --- THEME LOGIC (New vs Used) ---
  const theme = isNew
    ? {
        // NEW: Blue Accents
        hoverBorder: "hover:border-blue-200",
        hoverShadow: "hover:shadow-[0_4px_20px_-10px_rgba(37,99,235,0.15)]",
        badgeNew: "bg-blue-600 text-white",
        button:
          "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-blue-200",
      }
    : {
        // USED: Amber/Gold Accents
        hoverBorder: "hover:border-amber-200",
        hoverShadow: "hover:shadow-[0_4px_20px_-10px_rgba(245,158,11,0.15)]",
        badgeCondition: "bg-amber-50 text-amber-700 border-amber-100",
        button:
          "bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white hover:shadow-amber-200",
      };

  // Format Variant: "Color / Storage"
  const variantText = useMemo(() => {
    const attributes = product?.variantAttributes || [];
    const color = attributes.find((a: any) => a.name.toLowerCase() === "color")
      ?.values?.[0];
    const storage = attributes.find(
      (a: any) => a.name.toLowerCase() === "storage",
    )?.values?.[0];
    return [color, storage].filter(Boolean).join(" / ");
  }, [product]);

  return (
    <div
      className={`group flex flex-col h-full w-full bg-white rounded-2xl border border-gray-100 transition-all duration-300 overflow-hidden relative ${theme.hoverBorder} ${theme.hoverShadow}`}
    >
      {/* --- IMAGE AREA --- */}
      <div className="relative w-full aspect-square bg-gray-50/50 p-4">
        {/* Wishlist */}
        <div className="absolute top-3 right-3 z-20">
          <div className="text-gray-400 hover:text-red-500 transition-colors transform active:scale-90">
            <WishlistButton productId={product?.baseProductId} />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-1.5">
          {product?.isNewArrival && (
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm ${theme.badgeNew || "bg-gray-900 text-white"}`}
            >
              New
            </span>
          )}

          {/* Condition Badge (Only for Used) */}
          {!isNew && condition && (
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm border ${theme.badgeCondition}`}
            >
              {condition}
            </span>
          )}

          {hasDiscount && (
            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Product Image */}
        <Link
          href={`/shop/${product?.slug}`}
          className="block w-full h-full relative flex items-center justify-center"
        >
          {hasImage ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className={`object-contain transition-transform duration-300 group-hover:scale-[1.02] ${
                isOutOfStock ? "opacity-50 grayscale" : "opacity-100"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImageError(true)}
              priority={false}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-300 gap-2">
              <ImageIcon size={24} strokeWidth={1.5} />
              <span className="text-[10px] font-medium uppercase tracking-widest">
                No Image
              </span>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="bg-gray-900 text-white text-[10px] font-bold uppercase px-3 py-1.5 tracking-widest rounded-full shadow-lg">
                Sold Out
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex flex-col flex-1 px-4 pb-4 pt-2">
        {/* Title & Variant */}
        <div className="mb-2">
          <Link
            href={`/shop/${product?.slug}`}
            className="block transition-colors duration-200 hover:opacity-80"
          >
            <h3
              className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[2.5em]"
              title={product?.title}
            >
              {product?.title}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 font-medium mt-1 truncate min-h-[1.5em]">
            {variantText || <span className="opacity-0">-</span>}
          </p>
        </div>

        {/* Footer: Price & Action */}
        <div className="mt-auto flex items-end justify-between gap-2">
          {/* Price Block */}
          <div className="flex flex-col leading-none pb-0.5">
            {hasDiscount && (
              <span className="text-[11px] text-gray-400 line-through mb-1 font-medium">
                ₹{compareAtPrice.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-base md:text-lg font-bold text-gray-900 tracking-tight">
              ₹{sellingPrice.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Action Button - Theme based color */}
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!isOutOfStock)
                onAddToCart(product.baseProductId, product.variantId);
            }}
            disabled={isOutOfStock}
            className={`
              relative h-9 px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-200
              ${
                isOutOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : `${theme.button} hover:shadow-md`
              }
            `}
            aria-label="Add to cart"
          >
            {isOutOfStock ? (
              <span className="text-[10px] font-bold uppercase tracking-wide">
                N/A
              </span>
            ) : (
              <>
                <span className="text-xs font-bold tracking-wide">Add</span>
                <ShoppingCart size={15} strokeWidth={2.5} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
