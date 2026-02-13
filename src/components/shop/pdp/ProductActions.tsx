"use client";

import React, { useState } from "react";
import { ShoppingCart, Zap } from "lucide-react";
import { Variant, BaseProduct } from "./types";
import { addToCart } from "@/api/cart";
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

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    setIsLoading(true);
    try {
      const response = await addToCart(
        baseProduct.baseProductId,
        selectedVariant.variantId,
        1, // Default to 1 for now, or add quantity selector here if needed
      );
      if (response.data.data) {
        toast.success("Added to Cart");
      }
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    // Implement Buy Now logic (usually Add to Cart + Redirect to Checkout)
    if (isOutOfStock) return;
    setIsLoading(true);
    try {
      await addToCart(baseProduct.baseProductId, selectedVariant.variantId, 1);
      window.location.href = "/checkout"; // Or use router.push
    } catch (error) {
      toast.error("Failed to process Buy Now");
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

        {!isOutOfStock && (
          <button
            onClick={handleBuyNow}
            disabled={isLoading}
            className="flex-1 py-4 px-6 rounded-lg font-bold text-sm uppercase tracking-widest border border-slate-200 text-slate-900 hover:bg-slate-50 transition-all"
          >
            Buy Now
          </button>
        )}
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
