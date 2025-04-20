"use client";

import Filter from "@/components/filter";
import ProductCard from "@/components/product-card";
import React, { useEffect, useState } from "react";
import { fetchProducts, selectProduct } from "@/store/productSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import { addToCart } from "@/api/cart";
import toast from "react-hot-toast";
import { addToWishlist } from "@/api/wishlist";

const ShopPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProduct);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // GET DEFALUT VALUE
    if (!params.get("page")) params.set("page", 1);
    if (!params.get("size")) params.set("size", 20);

    // UPDATE THE URL IF ANY DEFAULT WAS ADDED
    if (params.toString() !== searchParams.toString()) {
      router.replace(`/shop?${params.toString()}`);
    }
  }, [searchParams, router]);

  useEffect(() => {
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "20";

    dispatch(fetchProducts({ page, size }));
  }, [dispatch, router]);

  const _handleAddToCart = async (id, variantId, quantity = 1) => {
    try {
      const response = await addToCart(id, variantId, quantity);
      if (response.data.data) {
        toast.success("Product added to Cart");
      }
    } catch (error) {
      toast.error("Error while adding product to cart");
      console.error("Error while adding product to cart : ", error);
    }
  };

  return (
    <section className=" my-5 md:my-10 flex gap-5 custom-padding">
      <Filter />

      <div className=" grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-6  md:gap-x-4 md:gap-y-8 lg:gap-x-5 lg:gap-y-10 ">
        {products &&
          products.data?.map((prod, i) => (
            <ProductCard
              key={i}
              product={prod}
              onAddToCart={_handleAddToCart}
            />
          ))}
      </div>
    </section>
  );
};

export default ShopPage;
