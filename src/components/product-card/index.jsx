"use client";
import urls from "@/utils/routes";
import Link from "next/link";
import styles from "./styles.module.scss";
import React, { useState } from "react";
import clsx from "clsx";
import HeartIcon from "../icons/heartIcon";
import CartIcon from "../icons/cartIcon";
import WishlistButton from "../wishlistButton";

const ProductCard = ({ product, onAddToCart }) => {
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
      <Link href={`/shop/${product.variantId}`}>
        <div className="overflow-hidden h-48 md:h-72 rounded-sm bg-gray-100">
          {hasImage ? (
            <img
              src={imageUrl}
              alt={product.name || "Product image"}
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
          <h1 className="text-base text-textPrimary">{product.name || "Product"}</h1>
          <span className="font-semibold">
            ₹ {product?.price || "N/A"}
          </span>
        </div>
      </Link>

      <div className="opacity-0  group-hover:opacity-100 ransition-opacity duration-500 ease-out absolute bottom-1/4 left-1/2 -translate-x-1/2  bg-gray-100 w-min flex justify-center px-4 py-2 rounded-sm shadow-md">
        <WishlistButton product={product} />
        <div className="border-l mx-4 border-gray-400"></div>
        <button
          onClick={() => onAddToCart(product._id, product.defaultVariant._id)}
          className="cursor-pointer"
        >
          <CartIcon />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
