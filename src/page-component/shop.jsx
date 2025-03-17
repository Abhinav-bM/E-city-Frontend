"use client";

import Filter from "@/components/filter";
import ProductCard from "@/components/product-card";
import React, { useEffect, useState } from "react";
import { fetchProducts, selectProduct } from "@/store/productSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";

const ShopPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProduct);

  console.log("products : ", products);
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

  return (
    <section className=" my-5 md:my-10 flex gap-5 custom-padding">
      <Filter />

      <div className=" grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-6  md:gap-x-4 md:gap-y-8 lg:gap-x-5 lg:gap-y-10 ">
        {products &&
          products.data?.map((prod, i) => (
            <ProductCard product={prod} key={i} />
          ))}
      </div>
    </section>
  );
};

export default ShopPage;
