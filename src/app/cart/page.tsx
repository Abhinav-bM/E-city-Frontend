"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchCartHook,
  updateItemQuantityHook,
  removeItemHook,
} from "@/store/cartSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react";
import MainWrapper from "@/wrapper/main";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, totalAmount, totalItems, loading } = useAppSelector(
    (state) => state.cart,
  );
  const { isAuthenticated, status: userStatus } = useAppSelector(
    (state) => state.user,
  );

  // Initial Fetch & Auth Check
  useEffect(() => {
    /*
    if (userStatus === "idle") return; // Wait for auth check
    if (!isAuthenticated) {
      router.push("/login?redirect=/cart");
      return;
    }
    */

    dispatch(fetchCartHook());
  }, [dispatch, isAuthenticated, userStatus, router]);

  const handleUpdateQty = (
    variantId: string,
    currentQty: number,
    change: number,
  ) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    dispatch(updateItemQuantityHook({ variantId, quantity: newQty }));
  };

  const handleRemove = (variantId: string) => {
    dispatch(removeItemHook(variantId));
  };

  const hasItems = items && items.length > 0;

  if (loading && !hasItems) {
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

  // Empty State
  if (!loading && !hasItems) {
    return (
      <MainWrapper>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
            <ShoppingBag size={40} />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Your bag is empty
            </h2>
            <p className="text-slate-500 max-w-md">
              Looks like you haven&apos;t added any gadgets yet. Explore our
              collection of premium tech.
            </p>
          </div>
          <Link
            href="/shop"
            className="px-8 py-3 bg-slate-900 text-white rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all"
          >
            Start Shopping
          </Link>
        </div>
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      <div className="bg-white min-h-screen pb-20 pt-8 lg:pt-12">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">
            Shopping Bag ({totalItems})
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {items.map((item) => {
                const variant = item.productVariantId;
                const baseProduct = variant.baseProductId;
                const isUnique = variant.inventoryType === "Unique";

                return (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-slate-100 last:border-0"
                  >
                    {/* Image */}
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                      <Image
                        src={
                          variant.images?.[0]?.url ||
                          variant.images?.[0] ||
                          baseProduct.images?.[0]?.url ||
                          baseProduct.images?.[0] ||
                          "/placeholder.png"
                        }
                        alt={baseProduct.title}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-bold text-slate-900 text-lg leading-tight">
                            <Link
                              href={`/shop/${baseProduct.slug}`}
                              className="hover:underline"
                            >
                              {baseProduct.title}
                            </Link>
                          </h3>
                          <span className="font-bold text-slate-900">
                            ₹{variant.sellingPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                          {Object.entries(variant.attributes || {}).map(
                            ([key, value]) => (
                              <span
                                key={key}
                                className="px-2 py-0.5 bg-slate-50 rounded text-xs font-medium"
                              >
                                {value}
                              </span>
                            ),
                          )}
                          <span className="px-2 py-0.5 bg-slate-50 rounded text-xs font-medium text-emerald-700 capitalize">
                            {variant.condition}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-4 sm:mt-0">
                        {/* Quantity Control */}
                        {isUnique ? (
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Using 1 Unit (Unique)
                          </span>
                        ) : (
                          <div className="flex items-center gap-3 border border-slate-200 rounded-lg p-1">
                            <button
                              onClick={() =>
                                handleUpdateQty(variant._id, item.quantity, -1)
                              }
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded disabled:opacity-50"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-4 text-center text-sm font-bold text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQty(variant._id, item.quantity, 1)
                              }
                              disabled={item.quantity >= variant.stock}
                              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded disabled:opacity-50"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        )}

                        <button
                          onClick={() => handleRemove(variant._id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-2"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-slate-50 rounded-2xl p-6 lg:p-8 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-slate-600 text-sm">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-sm">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-bold uppercase text-xs tracking-wider">
                      Free
                    </span>
                  </div>
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-slate-900">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                >
                  Checkout <ArrowRight size={18} />
                </button>

                <div className="mt-6 flex flex-col gap-2 text-[11px] text-slate-400 text-center">
                  <p>Secure Checkout by Razorpay</p>
                  <p>Free Returns within 7 Days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainWrapper>
  );
};

export default CartPage;
