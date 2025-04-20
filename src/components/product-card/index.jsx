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
  return (
    <div className={clsx(styles.productCard, "relative group")}>
      <Link href={`/shop/${product._id}`}>
        <div className="overflow-hidden h-48 md:h-72 rounded-sm bg-gray-100">
          <img
            src={product.defaultVariant.images[0]?.url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
          />
        </div>
        <div className="mt-2 w-full">
          <h1 className="text-base text-textPrimary">{product.name}</h1>
          <span className="font-semibold">
            ₹ {product.defaultVariant.price}
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
