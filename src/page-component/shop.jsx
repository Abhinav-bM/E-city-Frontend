"use client";

import FilterSidebar from "@/components/shop/FilterSidebar";
import ShopHeader from "@/components/shop/ShopHeader";
import ProductCard from "@/components/product-card";
import React, { useEffect, useState } from "react";
import { fetchProducts, selectProduct } from "@/store/productSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import { addToCart } from "@/api/cart";
import { getCategories } from "@/api/category";
import toast from "react-hot-toast";
import MobileFilterDrawer from "@/components/shop/MobileFilterDrawer";
import InfiniteScrollTrigger from "@/components/ui/InfiniteScrollTrigger";
import ProductCardSkeleton from "@/components/product-card/Skeleton";
import FilterSidebarSkeleton from "@/components/shop/FilterSidebarSkeleton";
import { SearchX } from "lucide-react";

const PAGE_SIZE = 12;

const ShopPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProduct);

  const searchParams = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const isLoading = products.status === "loading";
  const hasMore = products.data.length < (products.filter?.total || 0);

  // Resolve category name from URL param
  const categoryId = searchParams.get("category");
  const categoryName =
    categories.find((c) => c._id === categoryId)?.name || null;

  // Fetch categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCats();
  }, []);

  // Load products based on filters
  useEffect(() => {
    const newPage = 1;
    setPage(newPage);

    const filterPayload = {
      ...Object.fromEntries(searchParams),
      page: newPage,
      limit: PAGE_SIZE,
      isActive: "true",
    };

    dispatch(fetchProducts(filterPayload));
  }, [dispatch, searchParams.toString()]); // Using .toString() for stable dependency

  const loadMore = () => {
    if (!hasMore || isLoading) return;

    const nextPage = page + 1;
    setPage(nextPage);

    const filterPayload = {
      ...Object.fromEntries(searchParams),
      page: nextPage,
      limit: PAGE_SIZE,
      isActive: "true",
    };

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

  const isInitialLoad = isLoading && products.data.length === 0;

  return (
    <section className="min-h-screen bg-slate-50/80 pb-20 lg:pb-8">
      {/* Mobile Filter Bottom Sheet */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        categories={categories}
      />

      {/* Sidebar + Content side-by-side, tops aligned */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-5 lg:gap-6 custom-padding py-5 md:py-6">
        {/* Desktop Sidebar — Sticky, starts at same level as header */}
        <aside className="hidden lg:block w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide">
          {isInitialLoad ? (
            <FilterSidebarSkeleton />
          ) : (
            <FilterSidebar categories={categories} />
          )}
        </aside>

        {/* Main Content Area — header + grid stacked vertically */}
        <main className="flex-1 min-w-0">
          {/* Shop Header (breadcrumbs + count + chips + sort) */}
          <ShopHeader
            totalProducts={products.filter?.total || 0}
            loadedCount={products.data?.length || 0}
            categoryName={categoryName}
            onFilterClick={() => setIsMobileFilterOpen(true)}
          />

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mt-5">
            {isInitialLoad
              ? /* Skeleton grid for initial load */
                Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full animate-in fade-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <ProductCardSkeleton />
                  </div>
                ))
              : products.data?.map((prod, i) => (
                  <div key={`${prod.variantId}-${i}`} className="w-full">
                    <ProductCard
                      product={prod}
                      onAddToCart={_handleAddToCart}
                    />
                  </div>
                ))}
          </div>

          {/* Loading more — appended skeletons */}
          {isLoading && products.data.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mt-3 sm:mt-4 md:mt-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`more-${i}`} className="w-full">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && products.data?.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <SearchX
                  size={28}
                  className="text-slate-300"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                No products found
              </h3>
              <p className="text-sm text-slate-400 mb-5 max-w-[280px]">
                Try adjusting your filters or search criteria to find what
                you&apos;re looking for
              </p>
              <button
                onClick={() => router.push("/shop")}
                className="text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg px-5 py-2.5 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Infinite Scroll Trigger */}
          <div className="mt-8">
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
