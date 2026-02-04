"use client";

import Link from "next/link";
import styles from "./styles.module.scss";
import React, { useState } from "react";
import clsx from "clsx";
import CartIcon from "../icons/cartIcon";
import WishlistButton from "../wishlistButton";
import { ProductList } from "@/models/shop";

interface ProductCardProps {
  product: ProductList;
  onAddToCart: () => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  console.log("PRODUCT DETAILS : ", product);

  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Get image URL or use placeholder
  const imageUrl = product?.images?.[0]?.url;
  const hasImage = imageUrl && !imageError;

  // Placeholder SVG component
  const PlaceholderImage = () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-200">
      <svg
        className="w-24 h-24 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );

  return (
    <div className={clsx(styles.productCard, "relative group")}>
      <Link href={`/shop/${product?.slug}`}>
        <div className="overflow-hidden h-48 md:h-72 rounded-sm bg-gray-100">
          {hasImage ? (
            <img
              src={imageUrl}
              alt={product.title || "Ecity"}
              className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              onLoad={() => setImageLoading(false)}
              style={{ display: imageLoading ? "none" : "block" }}
            />
          ) : (
            <PlaceholderImage />
          )}
          {imageLoading && hasImage && (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 animate-pulse">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <div className="mt-2 w-full">
          <div className="flex flex-col">
            <h1 className="text-base text-textPrimary truncate">
              {product?.title}
            </h1>
            <div className="flex items-baseline gap-2">
               <span className="font-semibold">₹ {product?.sellingPrice}</span>
               {/* Logic to find min used price */}
               {(() => {
                  const variants = product?.availableVariants || product?.variants || [];
                  const usedVariants = variants.filter(v => v.condition && v.condition !== 'New');
                  if (usedVariants.length > 0) {
                     const minUsedPrice = Math.min(...usedVariants.map(v => v.price));
                     return (
                       <span className="text-xs text-orange-600 font-medium">
                         (Used from ₹{minUsedPrice})
                       </span>
                     );
                  }
                  return null;
               })()}
            </div>
            {/* Condition Badges */}
             <div className="flex gap-1 mt-1">
                {(() => {
                   const variants = product?.availableVariants || product?.variants || [];
                   const hasRefurb = variants.some(v => v.condition === 'Refurbished');
                   const hasOpenBox = variants.some(v => v.condition === 'Open Box');
                   
                   return (
                     <>
                        {hasRefurb && <span className="text-[10px] px-1 py-0.5 bg-green-100 text-green-700 rounded-sm">Refurbished</span>}
                        {hasOpenBox && <span className="text-[10px] px-1 py-0.5 bg-blue-100 text-blue-700 rounded-sm">Open Box</span>}
                     </>
                   )
                })()}
             </div>
          </div>
      </Link>

      <div className="opacity-0  group-hover:opacity-100 ransition-opacity duration-500 ease-out absolute bottom-1/4 left-1/2 -translate-x-1/2  bg-gray-100 w-min flex justify-center px-4 py-2 rounded-sm shadow-md">
        <WishlistButton product={product} />
        <div className="border-l mx-4 border-gray-400"></div>
        <button onClick={() => onAddToCart()} className="cursor-pointer">
          <CartIcon />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
