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

      toast.custom(
        (t) => (
          <div
            style={{
              animation: t.visible
                ? "cart-toast-enter 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards"
                : "cart-toast-leave 0.4s forwards ease-in",
            }}
            className="max-w-[400px] w-full pointer-events-auto"
          >
            <style>{`
              @keyframes cart-toast-enter {
                0% { transform: translate3d(0, 80px, 0) scale(0.6); opacity: 0; }
                100% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
              }
              @keyframes cart-toast-leave {
                0% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
                100% { transform: translate3d(0, 80px, 0) scale(0.6); opacity: 0; }
              }
            `}</style>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
              {/* Header */}
              <div className="flex items-center gap-2 px-4 pt-3.5 pb-1">
                <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">
                  Added to Bag
                </span>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="ml-auto text-slate-300 hover:text-slate-500 transition-colors p-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              {(() => {
                // Images may be strings or {url} objects depending on source
                const extractUrl = (img: unknown): string | null => {
                  if (typeof img === "string" && img) return img;
                  if (img && typeof img === "object" && "url" in img)
                    return (img as { url: string }).url;
                  return null;
                };
                const imageUrl =
                  extractUrl(selectedVariant.images?.[0]) ||
                  extractUrl(baseProduct.images?.[0]);

                return (
                  <div className="flex items-center gap-3.5 px-4 pb-3.5">
                    {imageUrl && (
                      <div className="w-14 h-14 rounded-lg bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="w-full h-full object-contain p-1.5"
                          src={imageUrl}
                          alt=""
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {baseProduct.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {selectedVariant.attributes &&
                          Object.values(selectedVariant.attributes)
                            .slice(0, 2)
                            .map((val, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                              >
                                {val}
                              </span>
                            ))}
                        <span className="text-xs font-bold text-slate-900">
                          ₹{selectedVariant.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Actions */}
              <div className="flex border-t border-slate-100">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="flex-1 py-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Continue
                </button>
                <div className="w-px bg-slate-100" />
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    router.push("/cart");
                  }}
                  className="flex-1 py-2.5 text-[11px] font-bold text-slate-900 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5"
                >
                  View Bag
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ),
        { duration: 4000 },
      );
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
