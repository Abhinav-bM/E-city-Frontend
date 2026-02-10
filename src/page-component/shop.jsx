"use client";

import FilterSidebar from "@/components/shop/FilterSidebar";
import ShopHeader from "@/components/shop/ShopHeader";
import ProductCard from "@/components/product-card";
import React, { useEffect } from "react";
import { fetchProducts, selectProduct } from "@/store/productSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import { addToCart } from "@/api/cart";
import toast from "react-hot-toast";

import MobileFilterDrawer from "@/components/shop/MobileFilterDrawer";

const ShopPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProduct);

  const searchParams = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);
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
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const brand = searchParams.get("brand") || "";
    const condition = searchParams.get("condition") || "";
    const sort = searchParams.get("sort") || "";

    dispatch(
      fetchProducts({
        page,
        size,
        search,
        category,
        minPrice,
        maxPrice,
        brand,
        condition,
        sort,
        isActive: "true",
      }),
    );
  }, [dispatch, searchParams]);

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
    <section className="my-5 md:my-10 flex flex-col md:flex-row gap-8 custom-padding">
      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
        <FilterSidebar />
      </div>

      <div className="flex-1">
        <ShopHeader
          totalProducts={products.data?.length || 0}
          onFilterClick={() => setIsMobileFilterOpen(true)}
        />

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {products &&
            products.data?.map((prod, i) => (
              <ProductCard
                key={i}
                product={prod}
                onAddToCart={_handleAddToCart}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default ShopPage;
