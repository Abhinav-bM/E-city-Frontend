"use client";
import clsx from "clsx";
import React from "react";

const CheckoutContainer = ({ product }) => {
  const _handleAddToCart = (prod_id, variant_id) => {};

  const _handleAddToWishlist = (prod_id, variant_id) => {};
  return (
    <div className={clsx("mt-10")}>
      <div className={clsx("flex gap-2")}>
        <button
          onClick={() => _handleAddToCart}
          className=" w-full border rounded-sm h-12 font-semibold text-primary hover:bg-primary hover:text-textSecondary"
        >
          Add to cart
        </button>

        <button
          onClick={() => _handleAddToWishlist}
          className=" w-full border rounded-sm font-semibold h-12 bg-primary text-textSecondary"
        >
          Add to wishlist
        </button>
      </div>
    </div>
  );
};

export default CheckoutContainer;
