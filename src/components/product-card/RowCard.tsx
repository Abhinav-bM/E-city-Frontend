"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import WishlistButton from "../wishlistButton";

interface ProductRowCardProps {
  product: any;
  onAddToCart: (id?: string, variantId?: string) => void;
}

const ProductRowCard = React.memo(
  ({ product, onAddToCart }: ProductRowCardProps) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const imageUrl = product?.images?.[0]?.url || product?.images?.[0];
    const hasImage = imageUrl && !imageError;

    const discount =
      product?.compareAtPrice && product.compareAtPrice > product.sellingPrice
        ? Math.round(
            ((product.compareAtPrice - product.sellingPrice) /
              product.compareAtPrice) *
              100,
          )
        : 0;

    const isNewProduct = product?.condition === "New";
    const isUsedProduct =
      product?.condition === "Refurbished" || product?.condition === "Open Box";

    const cardAccentClass = isNewProduct
      ? "border-blue-200 hover:border-blue-400 hover:shadow-blue-50"
      : isUsedProduct
        ? "border-emerald-200 hover:border-emerald-400 hover:shadow-emerald-50"
        : "border-slate-100 hover:border-slate-200";

    const stock = product?.stock || 0;
    const isOutOfStock = stock === 0;

    // Flatten specs for easier display
    const flatSpecs =
      product?.specifications
        ?.flatMap((group: any) =>
          group.items.map((item: any) => `${item.key}: ${item.value}`),
        )
        .slice(0, 5) || [];

    return (
      <div
        className={`group relative bg-white rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-xl border-2 ${cardAccentClass} flex flex-col md:flex-row gap-6 ${isOutOfStock ? "opacity-60 grayscale" : ""}`}
      >
        {/* Wishlist Button */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <WishlistButton productId={product?.baseProductId} />
        </div>

        {/* Image Section */}
        <Link
          href={`/shop/${product?.slug}`}
          className="w-full md:w-48 lg:w-64 aspect-square md:aspect-auto relative shrink-0 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-4"
          prefetch={false}
        >
          {hasImage ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className={`object-contain transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? "grayscale" : ""}`}
              onError={() => setImageError(true)}
              onLoad={() => setImageLoading(false)}
            />
          ) : (
            <div className="text-slate-300">
              <svg
                className="w-16 h-16"
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
        </Link>

        {/* Info Section */}
        <div className="flex-1 flex flex-col justify-between py-2">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {product?.brand}
              </span>
              {isOutOfStock && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-500 text-white uppercase">
                  Out of Stock
                </span>
              )}
              {product?.isNewArrival && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white uppercase">
                  New
                </span>
              )}
            </div>

            <Link href={`/shop/${product?.slug}`} prefetch={false}>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                {product?.title}
              </h3>
            </Link>

            {/* Specifications List */}
            {flatSpecs.length > 0 && (
              <ul className="space-y-1.5 mb-6">
                {flatSpecs.map((spec, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-slate-500"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    {spec}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            {isNewProduct ? (
              <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Brand New
              </span>
            ) : isUsedProduct ? (
              <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                {product.conditionGrade || product.condition}
              </span>
            ) : null}
          </div>
        </div>

        {/* Pricing & Actions Section */}
        <div className="w-full md:w-56 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
          <div className="text-right space-y-1">
            <div className="flex flex-col items-end">
              <div className="text-3xl font-black text-slate-900">
                ₹{product?.sellingPrice?.toLocaleString()}
              </div>
              {discount > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product?.compareAtPrice?.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {discount}% off
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product.baseProductId, product.variantId);
            }}
            disabled={isOutOfStock}
            className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200 hover:shadow-blue-200"
            }`}
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.product.variantId === next.product.variantId &&
    prev.product.stock === next.product.stock,
);

export default ProductRowCard;
