"use client";

import React, { useState } from "react";
import { Variant, BaseProduct } from "./types";
import { useAppDispatch } from "@/store";
import { addItemToCartHook } from "@/store/cartSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ProductActionsProps {
  baseProduct: BaseProduct;
  selectedVariant: Variant;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  baseProduct,
  selectedVariant,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const stock = selectedVariant.stock || 0;
  const isOutOfStock = stock === 0;

  const dispatch = useAppDispatch();
  const router = useRouter();
  // const pathname = usePathname();
  // const { isAuthenticated } = useAppSelector((state) => state.user);

  const handleAddToCart = async () => {
    if (isOutOfStock) return;

    /*
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      router.push(`/login?redirect=${pathname}`);
      return;
    }
    */

    setIsLoading(true);
    try {
      await dispatch(
        addItemToCartHook({
          baseProductId: baseProduct.baseProductId,
          variantId: selectedVariant.variantId,
          quantity: 1, // Default to 1
        }),
      ).unwrap();

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={
                    baseProduct.images?.[0]?.url ||
                    baseProduct.images?.[0] ||
                    "/placeholder.png"
                  }
                  alt=""
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Added to Cart
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {baseProduct.title}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                router.push("/cart");
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              View Cart
            </button>
          </div>
        </div>
      ));
    } catch {
      // Error handled in thunk
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Trust Badges - Minimalist Grid */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-2">
        {[
          { icon: "🛡️", label: "6 Month Warranty" },
          { icon: "🔄", label: "7 Day Replacement" },
          { icon: "🚚", label: "Free Shipping" },
          { icon: "✅", label: "Verified Check" },
        ].map((badge, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="text-sm opacity-80">{badge.icon}</span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              {badge.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
          className={`flex-1 py-4 px-6 rounded-lg font-bold text-sm uppercase tracking-widest transition-all ${
            isOutOfStock
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          {isLoading ? "Processing..." : "Add to Bag"}
        </button>
      </div>

      {isOutOfStock && (
        <button className="w-full py-4 bg-slate-100 text-slate-900 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
          Notify Me When Available
        </button>
      )}
    </div>
  );
};

export default ProductActions;
