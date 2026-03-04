"use client";

import React from "react";
import { useAppSelector } from "@/store";
import ProductCard from "@/components/product-card";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MainWrapper from "@/wrapper/main";

const WishlistPage = () => {
  const router = useRouter();
  const { items, loading } = useAppSelector((state) => state.wishlist);
  const { isAuthenticated, authCheckComplete } = useAppSelector(
    (state) => state.user,
  );

  const handleAddToCart = (productId?: string, variantId?: string) => {
    if (productId && variantId) {
      router.push(`/shop/${productId}`); // For now redirect to PDP
    }
  };

  // Show loading while auth is being checked
  if (!authCheckComplete) {
    return (
      <MainWrapper>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
            <div className="h-4 w-32 bg-slate-200 rounded"></div>
          </div>
        </div>
      </MainWrapper>
    );
  }

  if (!isAuthenticated) {
    return (
      <MainWrapper>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Heart size={32} className="text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 text-center">
            Login to view your Wishlist
          </h1>
          <p className="text-slate-500 mt-2 text-center max-w-sm mb-8">
            Please log in or sign up to save products and access your wishlist
            across devices.
          </p>
          <Link
            href="/login?referer=/wishlist"
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            Login / Sign Up
          </Link>
        </div>
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={28} className="fill-red-50 text-red-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            My Wishlist
          </h1>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-bold">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-slate-100 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-8">
            <Heart size={48} className="text-slate-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-900">
              Your wishlist is empty
            </h2>
            <p className="text-slate-500 mt-2 text-center max-w-md">
              Save your favorite items here while you shop to easily find them
              later.
            </p>
            <Link
              href="/shop"
              className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((item) => {
              // Reconstruct the nested product shape expected by ProductCard
              const product = item.productId || item;
              // Provide some mock variants structure since wishlist returns base product
              const mockProductData = {
                ...product,
                baseProductId: product._id,
                sellingPrice: product.price,
                compareAtPrice: product.actualPrice,
                images: product.images,
                isNewArrival: product.isNewArrival,
                isOnSale: product.isOnSale,
                discount: product.discount,
                variantAttributes: product.attributes,
              };

              return (
                <ProductCard
                  key={product._id}
                  product={mockProductData}
                  onAddToCart={handleAddToCart}
                />
              );
            })}
          </div>
        )}
      </div>
    </MainWrapper>
  );
};

export default WishlistPage;
