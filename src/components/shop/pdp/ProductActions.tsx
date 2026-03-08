"use client";

import React, { useState } from "react";
import { Variant, BaseProduct } from "./types";
import { useAppDispatch, useAppSelector } from "@/store";
import { addItemToCartHook, setDirectItem } from "@/store/cartSlice";
import { toggleWishlistItem } from "@/store/wishlistSlice";
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

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    // Store full product details so checkout page can render it
    dispatch(
      setDirectItem({
        productVariantId: selectedVariant.variantId,
        quantity: 1,
        product: {
          ...baseProduct,
          variant: selectedVariant,
        },
      }),
    );
    router.push("/checkout");
  };

  const wishlistItems = useAppSelector((state) => state.wishlist.items) || [];
  const isWishlisted = wishlistItems.some(
    (item: any) =>
      item.productVariant?._id === selectedVariant.variantId ||
      item.productVariant === selectedVariant.variantId,
  );

  const handleToggleWishlist = async () => {
    try {
      const resultAction = await dispatch(
        toggleWishlistItem({
          variantId: selectedVariant.variantId,
          isWishlisted,
        }),
      ).unwrap();

      if (resultAction.action === "added") {
        toast.success("Added to Wishlist");
      } else {
        toast.success("Removed from Wishlist");
      }
    } catch {
      toast.error("Please login to manage wishlist");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Trust Badges - Minimalist Grid */}
      <div className="grid grid-cols-2 gap-y-5 gap-x-6 mb-4">
        {[
          { icon: "🛡️", label: "6 Month Warranty" },
          { icon: "🔄", label: "7 Day Replacement" },
          { icon: "🚚", label: "Free Shipping" },
          { icon: "✅", label: "Verified Check" },
        ].map((badge, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-base opacity-80">{badge.icon}</span>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest leading-tight">
              {badge.label}
            </span>
          </div>
        ))}
      </div>

      {/* Desktop Actions (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleToggleWishlist}
          className={`h-14 w-14 shrink-0 rounded-full flex items-center justify-center border-2 transition-all duration-300 active:scale-[0.95] ${
            isWishlisted
              ? "border-red-500 bg-red-50 text-red-500 hover:bg-red-100"
              : "border-slate-200/80 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <svg
            className={`w-6 h-6 transition-all ${isWishlisted ? "fill-current" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className={`flex-1 h-14 rounded-full font-extrabold text-[13px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center ${
            isOutOfStock
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-black hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-[0.98] ring-1 ring-slate-900"
          }`}
        >
          Buy Now
        </button>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
          className={`group flex-1 h-14 rounded-full font-extrabold text-[13px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 border-2 ${
            isOutOfStock
              ? "border-slate-100 text-slate-400 bg-slate-50 cursor-not-allowed"
              : "border-slate-200/80 text-slate-800 bg-white hover:border-slate-400 hover:bg-slate-50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-[0.98]"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
              Processing
            </span>
          ) : (
            <>
              Add to Bag
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </>
          )}
        </button>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-slate-200/60 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
        <div className="flex gap-3 max-w-md mx-auto">
          <button
            onClick={handleToggleWishlist}
            className={`h-12 w-12 shrink-0 rounded-full flex items-center justify-center border-2 transition-all active:scale-[0.95] ${
              isWishlisted
                ? "border-red-500 bg-red-50 text-red-500"
                : "border-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50"
            }`}
          >
            <svg
              className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {isOutOfStock ? (
            <button className="flex-1 h-12 bg-slate-100 text-slate-400 rounded-full font-bold text-xs uppercase tracking-widest">
              Out of Stock
            </button>
          ) : (
            <>
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="flex-1 h-12 rounded-full font-bold text-[11px] uppercase tracking-widest border-2 border-slate-900 text-slate-900 bg-white active:scale-[0.98] flex items-center justify-center"
              >
                {isLoading ? "Wait..." : "Add to Bag"}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 h-12 rounded-full font-bold text-[11px] uppercase tracking-widest bg-slate-900 text-white active:scale-[0.98] flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.08)] shadow-slate-900/10"
              >
                Buy Now
              </button>
            </>
          )}
        </div>
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
