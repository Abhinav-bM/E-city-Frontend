"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useMemo, useCallback } from "react";
import { ShoppingCart, Check, Bell, Image as ImageIcon } from "lucide-react";
import WishlistButton from "../wishlistButton";
import type { ProductCardProduct } from "./types";

interface ProductCardProps {
  product: ProductCardProduct;
  onAddToCart: (id?: string, variantId?: string) => Promise<boolean>;
}

const ProductCard = React.memo(({ product, onAddToCart }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  /* ── Image Resolution ── */
  const toUrl = (img: string | { url: string } | undefined) =>
    typeof img === "string" ? img : img?.url;
  const imageUrl =
    toUrl(product?.images?.[0]) ||
    toUrl(product?.baseImages?.[0]) ||
    toUrl(product?.variants?.[0]?.images?.[0]);
  const hasImage = imageUrl && !imageError;

  /* ── Pricing ── */
  const sellingPrice = product?.sellingPrice || 0;
  const actualPrice = product?.actualPrice || 0;
  const hasDiscount = actualPrice > 0 && actualPrice > sellingPrice;
  const discount = hasDiscount
    ? Math.round(((actualPrice - sellingPrice) / actualPrice) * 100)
    : 0;
  const savings = hasDiscount ? actualPrice - sellingPrice : 0;

  /* ── Stock & Condition ── */
  const stock = product?.stock || 0;
  const isOutOfStock = stock === 0;

  // Detect "New" via condition OR inventoryType (API often omits condition for new items)
  const isNew =
    product?.condition === "New" ||
    product?.inventoryType === "Quantity" ||
    (!product?.condition && product?.inventoryType !== "Unique");

  const condition = product?.conditionGrade || product?.condition;

  /* ── Theme (New → blue, Used → amber) — outlined CTA ── */
  const theme = isNew
    ? {
        imageBg: "bg-slate-50",
        badgeNew: "bg-blue-600 text-white",
        ctaBase: "border border-blue-200 bg-blue-50/50 text-blue-600",
        ctaHover: "hover:bg-blue-50 hover:border-blue-300",
        ctaAdded: "bg-emerald-50 border-emerald-300 text-emerald-600",
        ringHover: "group-hover:ring-blue-100",
      }
    : {
        imageBg: "bg-amber-50/50",
        badgeCondition: "bg-amber-500 text-white",
        ctaBase: "border border-amber-200 bg-amber-50/50 text-amber-600",
        ctaHover: "hover:bg-amber-50 hover:border-amber-300",
        ctaAdded: "bg-emerald-50 border-emerald-300 text-emerald-600",
        ringHover: "group-hover:ring-amber-100",
      };

  /* ── Variant text: "Color / Storage" ── */
  const variantText = useMemo(() => {
    // Read the specific attributes for this exact variant, not the global lists
    const attributes = product?.attributes || {};

    // Find keys case-insensitively
    const colorKey = Object.keys(attributes).find(
      (k) => k.toLowerCase() === "color",
    );
    const storageKey = Object.keys(attributes).find(
      (k) => k.toLowerCase() === "storage",
    );

    const color = colorKey ? attributes[colorKey] : null;
    const storage = storageKey ? attributes[storageKey] : null;

    return [color, storage].filter(Boolean).join(" / ");
  }, [product?.attributes]);

  /* ── Add to cart with feedback ── */
  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOutOfStock || addingToCart) return;

      setAddingToCart(true);
      const success = await onAddToCart(
        product.baseProductId,
        product.variantId,
      );

      setAddingToCart(false);
      if (success) {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
      }
    },
    [
      isOutOfStock,
      addingToCart,
      onAddToCart,
      product.baseProductId,
      product.variantId,
    ],
  );

  return (
    <div
      className={`
        group flex flex-col h-full w-full bg-white rounded-2xl overflow-hidden
        shadow-[0_1px_3px_rgba(0,0,0,0.06)]
        ring-1 ring-black/[0.04] ${theme.ringHover}
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        hover:-translate-y-0.5
        transition-all duration-300 ease-out
      `}
    >
      {/* ═══ IMAGE AREA ═══ */}
      <div className={`relative w-full aspect-square ${theme.imageBg}`}>
        {/* Wishlist — frosted circle */}
        <div className="absolute top-2.5 right-2.5 z-20">
          <div
            className="
              w-9 h-9 flex items-center justify-center rounded-full
              bg-white/80 backdrop-blur-sm shadow-sm
              text-slate-400 hover:text-red-500
              transition-colors duration-200 active:scale-90
            "
          >
            <WishlistButton variantId={product?.variantId} />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col items-start gap-1.5">
          {product?.isNewArrival && (
            <span
              className={`
                text-[10px] font-bold uppercase tracking-wider
                px-2 py-0.5 rounded-full shadow-sm
                ${theme.badgeNew || ""}
              `}
            >
              New
            </span>
          )}

          {!isNew && condition && (
            <span
              className={`
                text-[10px] font-bold uppercase tracking-wider
                px-2 py-0.5 rounded-full shadow-sm
                ${theme.badgeCondition || ""}
              `}
            >
              {condition}
            </span>
          )}

          {hasDiscount && (
            <span className="text-[10px] font-bold text-white bg-rose-500 px-2 py-0.5 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Product Image — always navigable */}
        <Link
          href={`/shop/${product?.slug}`}
          className="block w-full h-full relative flex items-center justify-center p-5"
        >
          {hasImage ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className={`
                object-contain
                ${isOutOfStock ? "opacity-40 grayscale" : "opacity-100"}
              `}
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImageError(true)}
              priority={false}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300 gap-2">
              <ImageIcon size={28} strokeWidth={1.5} />
              <span className="text-[10px] font-semibold uppercase tracking-widest">
                No Image
              </span>
            </div>
          )}

          {/* Sold Out overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="bg-slate-900/80 text-white text-[10px] font-bold uppercase px-3 py-1.5 tracking-widest rounded-full shadow-lg">
                Sold Out
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* ═══ CONTENT AREA ═══ */}
      <div className="flex flex-col flex-1 px-3.5 pb-3.5 pt-2.5 sm:px-4 sm:pb-4 sm:pt-3">
        {/* Brand */}
        {product?.brand && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-0.5">
            {product.brand}
          </span>
        )}

        {/* Title */}
        <Link
          href={`/shop/${product?.slug}`}
          className="block mb-0.5 group/title"
        >
          <h3
            className="text-[13px] sm:text-sm font-bold text-slate-800 leading-snug line-clamp-2 min-h-[2.5em] group-hover/title:text-slate-600 transition-colors duration-200"
            title={product?.title}
          >
            {product?.title}
          </h3>
        </Link>

        {/* Variant info */}
        <p className="text-[11px] text-slate-400 font-medium truncate mb-1.5">
          {variantText || <span className="opacity-0">-</span>}
        </p>

        {/* Footer: Price + CTA */}
        <div className="mt-auto flex items-end justify-between gap-1.5 pt-1">
          {/* Price block */}
          <div className="flex flex-col leading-none min-w-0">
            {hasDiscount && (
              <span className="text-[10px] sm:text-[11px] text-slate-400 line-through mb-0.5 font-medium">
                ₹{actualPrice.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              ₹{sellingPrice.toLocaleString("en-IN")}
            </span>
            {savings > 0 && (
              <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 w-fit">
                Save ₹{savings.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* CTA Button — pill in bottom-right, revealed on hover (always visible on touch/mobile) */}
          <div className="shrink-0">
            {isOutOfStock ? (
              <button
                className="
                  h-9 sm:h-10 px-3 sm:px-4 rounded-full flex items-center justify-center gap-1.5
                  bg-slate-100 text-slate-500 text-[11px] sm:text-xs font-bold tracking-wide
                  cursor-pointer hover:bg-slate-200 transition-colors duration-200
                  active:scale-95
                "
                onClick={(e) => {
                  e.preventDefault();
                }}
                aria-label="Notify when available"
              >
                <Bell size={13} strokeWidth={2.5} />
                <span className="hidden xs:inline">Notify</span>
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className={`
                  h-9 sm:h-10 px-3.5 sm:px-5 rounded-full flex items-center justify-center gap-1.5
                  text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer
                  active:scale-95
                  ${
                    justAdded
                      ? theme.ctaAdded
                      : `${theme.ctaBase} ${theme.ctaHover}`
                  }
                  ${addingToCart ? "opacity-80 pointer-events-none" : ""}
                `}
                aria-label="Add to cart"
              >
                {justAdded ? (
                  <>
                    <Check size={14} strokeWidth={2.5} />
                    <span className="hidden sm:inline">Added</span>
                  </>
                ) : addingToCart ? (
                  <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingCart size={14} strokeWidth={2.5} />
                    <span className="hidden sm:inline">Add</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
