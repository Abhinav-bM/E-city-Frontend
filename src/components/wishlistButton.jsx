"use client";
import React, { useState } from "react";
import HeartIcon from "./icons/heartIcon";
import { addToWishlist, removeFromWishlist } from "@/api/wishlist";
import clsx from "clsx";
import toast from "react-hot-toast";

const WishlistButton = (product) => {
  const [isProductWishlisted, setIsProductWislisted] = useState(
    product.is_wishlisted
  );
  const _handleAddToWishlist = async () => {
    try {
      let response;
      if (isProductWishlisted) {
        console.log("Product id ", product._id);
        response = await addToWishlist(product._id);
      } else {
        response = await removeFromWishlist(product._id);
      }

      if (response.data.data) {
        toast.success(
          isProductWishlisted
            ? "Product removed from wishlist"
            : "Product added to wishlist"
        );
        setIsProductWislisted((prev) => !prev);
      }
    } catch (error) {
      toast.error("Error while adding a product to wishlist");
      console.error("Error while adding product to wishlist : ", error);
    }
  };
  return (
    <button onClick={_handleAddToWishlist} className="cursor-pointer">
      <HeartIcon
        className={clsx(isProductWishlisted ? "text-red-500 fill-red-500" : "")}
      />
    </button>
  );
};

export default WishlistButton;
