"use client";

import Link from "next/link";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ShopHeader from "@/components/shop/ShopHeader";
import ProductCard from "@/components/product-card";
import ProductRowCard from "@/components/product-card/RowCard";
import React, { useEffect, useState } from "react";
import { fetchProducts, selectProduct } from "@/store/productSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import { addToCart } from "@/api/cart";
import toast from "react-hot-toast";

import MobileFilterDrawer from "@/components/shop/MobileFilterDrawer";
import InfiniteScrollTrigger from "@/components/ui/InfiniteScrollTrigger";
import ProductCardSkeleton from "@/components/product-card/Skeleton";
import FilterSidebarSkeleton from "@/components/shop/FilterSidebarSkeleton";

const ShopPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProduct);

  const searchParams = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const router = useRouter();

  const [page, setPage] = useState(1);
  const isLoading = products.status === "loading";
  const hasMore = products.data.length < (products.filter?.total || 0);

  // Initial Load & Filter Change
  useEffect(() => {
    // Reset page to 1 when filters change
    const newPage = 1;
    setPage(newPage);

    const type = searchParams.get("type");

    const filterPayload = {
      ...Object.fromEntries(searchParams),
      page: newPage,
      limit: 12,
      isActive: "true",
    };

    // Remove 'type' from payload to prevent backend from treating it as an attribute filter
    delete filterPayload.type;

    // Apply strict condition based on type, unless condition is explicitly passed in URL
    // If URL has 'condition', we respect it (allows filtering within 'Used').
    // If URL has NO 'condition', we force defaults based on type.
    if (!searchParams.get("condition")) {
      if (type === "new") {
        filterPayload.condition = "New";
      } else if (type === "used") {
        filterPayload.condition = "Refurbished,Open Box,Used";
      }
    } else if (type === "new" && searchParams.get("condition") !== "New") {
      // Edge case: User is in "New" mode but URL has "Refurbished"?
      // We should probably force "New" or let the Condition filter be hidden so this doesn't happen easily.
      // For safety, if type is new, we might want to enforcement.
      filterPayload.condition = "New";
    }

    dispatch(fetchProducts(filterPayload));
  }, [dispatch, searchParams]);

  const loadMore = () => {
    if (!hasMore || isLoading) return;

    const nextPage = page + 1;
    setPage(nextPage);

    const params = new URLSearchParams(searchParams.toString());
    const type = params.get("type");

    const filterPayload = {
      ...Object.fromEntries(searchParams),
      page: nextPage,
      limit: 12,
      isActive: "true",
    };

    // Remove 'type' from payload to prevent backend from treating it as an attribute filter
    delete filterPayload.type;

    if (!searchParams.get("condition")) {
      if (type === "new") {
        filterPayload.condition = "New";
      } else if (type === "used") {
        filterPayload.condition = "Refurbished,Open Box,Used";
      }
    } else if (type === "new") {
      filterPayload.condition = "New";
    }

    dispatch(fetchProducts(filterPayload));
  };

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
    <section className="min-h-screen bg-gray-50">
      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      />

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 custom-padding py-6 md:py-8">
        {/* Desktop Sidebar - Sticky */}
        <aside className="hidden lg:block w-full lg:w-64 flex-shrink-0">
          {products.status === "loading" && products.data.length === 0 ? (
            <FilterSidebarSkeleton />
          ) : (
            <FilterSidebar />
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Shop Header */}
          <div className="mb-6">
            <ShopHeader
              totalProducts={products.filter?.total || 0}
              onFilterClick={() => setIsMobileFilterOpen(true)}
            />
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.status === "loading" && products.data.length === 0
              ? // Skeletons for initial load
                Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-full">
                    <ProductCardSkeleton />
                  </div>
                ))
              : products.data?.map((prod, i) => {
                  return (
                    <div key={`${prod.variantId}-${i}`} className="w-full">
                      <ProductCard
                        product={prod}
                        onAddToCart={_handleAddToCart}
                      />
                    </div>
                  );
                })}
          </div>

          {/* Empty State */}
          {!isLoading && products.data?.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <div className="space-y-4">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.15 13.15z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">
                  No products found
                </h3>
                <p className="text-sm text-gray-500">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            </div>
          )}

          {/* Infinite Scroll Trigger */}
          <div className="mt-12">
            <InfiniteScrollTrigger
              onIntersect={loadMore}
              hasMore={hasMore}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </section>
  );
};

export default ShopPage;
