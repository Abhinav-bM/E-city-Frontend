"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Minus, Plus, Share2 } from "lucide-react";
import ProductImageViewer from "./ProductImageViewer";
import ProductVariantSelector from "./ProductVariantSelector";
import { addToCart } from "@/api/cart";
import toast from "react-hot-toast";

const ProductDetails = ({ productData }) => {
  const router = useRouter();
  const { currentVariant, baseProduct, availableVariants, variantMetadata } =
    productData;
  const [quantity, setQuantity] = useState(1);

  // Stock Logic
  const stock = currentVariant?.stock || 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  // New vs Used Logic
  const isUsed = currentVariant?.condition !== "New";

  const handleVariantChange = (variant) => {
    if (variant?.slug && variant.slug !== currentVariant.slug) {
      router.push(`/shop/${variant.slug}`);
    }
  };

  const handleQuantityChange = (val) => {
    if (val < 1) return;
    if (val > stock) {
      toast.error(`Only ${stock} items available`);
      return;
    }
    setQuantity(val);
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    try {
      const response = await addToCart(
        baseProduct.baseProductId,
        currentVariant.variantId,
        quantity,
      );
      if (response.data.data) {
        toast.success("Added to Cart");
      }
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    }
  };

  // Discount Calculation
  const discount =
    currentVariant?.compareAtPrice &&
    currentVariant.compareAtPrice > currentVariant.price
      ? Math.round(
          ((currentVariant.compareAtPrice - currentVariant.price) /
            currentVariant.compareAtPrice) *
            100,
        )
      : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
      {/* --- Left Column: Images --- */}
      <div className="w-full lg:w-1/2">
        <ProductImageViewer images={currentVariant.images} />
      </div>

      {/* --- Right Column: Details --- */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-medium text-slate-900 leading-tight mb-4">
            {currentVariant.title}
          </h1>

          {/* Price Row */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-bold text-slate-900">
              Price: ₹{currentVariant.price?.toLocaleString()}
            </span>
            {currentVariant.compareAtPrice > currentVariant.price && (
              <>
                <span className="text-sm text-slate-500 font-medium">
                  M.R.P:{" "}
                  <span className="line-through">
                    ₹{currentVariant.compareAtPrice?.toLocaleString()}
                  </span>
                </span>
                <span className="text-sm font-medium text-red-600">
                  ({discount}% off)
                </span>
              </>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium mb-4">
            Inclusive of all taxes
          </div>

          {/* Stock Warning */}
          {isLowStock && (
            <p className="text-sm font-medium text-amber-600 mb-4 animate-pulse">
              Hurry, only {stock} left!
            </p>
          )}

          {/* Badges */}
          <div className="flex gap-3 mb-6">
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-700 border border-slate-200">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                ✔
              </span>
              <span>Assured</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-700 border border-slate-200">
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">
                $
              </span>
              <span>Super Value</span>
            </div>
          </div>
        </div>

        {/* Condition Details (If Used) */}
        {isUsed && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 mb-2">
              Condition Details
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 block">Condition</span>
                <span className="font-medium text-slate-900">
                  {currentVariant.condition}
                </span>
              </div>
              {currentVariant.conditionGrade && (
                <div>
                  <span className="text-slate-500 block">Grade</span>
                  <span className="font-medium text-slate-900">
                    {currentVariant.conditionGrade}
                  </span>
                </div>
              )}
            </div>
            {currentVariant.conditionDescription && (
              <div className="mt-3 text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100">
                {currentVariant.conditionDescription}
              </div>
            )}
          </div>
        )}

        {/* Variants Selector */}
        <ProductVariantSelector
          variants={availableVariants}
          selectedVariant={currentVariant}
          onSelectVariant={handleVariantChange}
        />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          {/* Quantity */}
          <div className="flex items-center bg-slate-100 rounded-xl px-2 w-max">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isOutOfStock}
              className="p-3 text-slate-500 hover:text-slate-900 disabled:opacity-50"
            >
              <Minus size={18} />
            </button>
            <span className="font-semibold text-slate-900 w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= stock || isOutOfStock}
              className="p-3 text-slate-500 hover:text-slate-900 disabled:opacity-50"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
              isOutOfStock
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-slate-900 text-white hover:bg-blue-600 hover:shadow-blue-200"
            }`}
          >
            <ShoppingCart size={22} />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>

        {/* Highlights Section */}
        {(() => {
          // 1. Get Variant Attributes (e.g., RAM, Storage)
          const attributes =
            baseProduct.variantAttributes
              ?.map((attr) => ({
                key: attr.name,
                value: currentVariant.attributes?.[attr.name],
              }))
              .filter((a) => a.value) || [];

          // 2. Get Key Specs from Specifications
          // Whitelist of common high-level specs to look for
          const keySpecKeys = [
            "processor",
            "cpu",
            "display",
            "screen",
            "camera",
            "main camera",
            "front camera",
            "rear camera",
            "battery",
            "os",
            "operating system",
            "warranty",
            "sim",
            "network",
          ];

          let specHighlights = [];
          if (baseProduct.specifications) {
            baseProduct.specifications.forEach((group) => {
              group.items.forEach((item) => {
                if (
                  keySpecKeys.some((k) => item.key.toLowerCase().includes(k))
                ) {
                  specHighlights.push({ key: item.key, value: item.value });
                }
              });
            });
          }

          // If no specific keys found, maybe just take the first group (often "General" or "Highlights")
          if (
            specHighlights.length === 0 &&
            baseProduct.specifications?.length > 0
          ) {
            specHighlights = baseProduct.specifications[0].items.slice(0, 4);
          }

          // Merge and Deduplicate (prefer variant attributes if same key)
          const allHighlights = [...attributes, ...specHighlights].filter(
            (item, index, self) =>
              index ===
              self.findIndex(
                (t) => t.key.toLowerCase() === item.key.toLowerCase(),
              ),
          );

          if (allHighlights.length === 0) return null;

          return (
            <div className="mt-6">
              <h3 className="font-bold text-lg text-slate-900 mb-3">
                Highlights
              </h3>
              <div className="flex flex-wrap gap-2">
                {allHighlights.map((item, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white"
                  >
                    <span className="text-slate-500 mr-1">{item.key} -</span>
                    <span className="font-medium text-slate-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Description */}
        <div className="mt-6 border-t border-slate-100 pt-6">
          <h3 className="font-bold text-lg text-slate-900 mb-3">Description</h3>
          <div
            className="prose prose-slate prose-sm max-w-none text-slate-600"
            dangerouslySetInnerHTML={{
              __html: baseProduct.description?.replace(/\n/g, "<br/>"),
            }}
          />
        </div>

        {/* Detailed Specifications */}
        {baseProduct.specifications &&
          baseProduct.specifications.length > 0 && (
            <div className="mt-6 border-t border-slate-100 pt-6">
              <h3 className="font-bold text-lg text-slate-900 mb-4">
                Specifications
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                {baseProduct.specifications.map((group, groupIndex) => (
                  <div key={groupIndex}>
                    <div className="bg-slate-50 px-4 py-2 font-semibold text-slate-900 border-b border-slate-200">
                      {group.group}
                    </div>
                    <div className="divide-y divide-slate-100">
                      {group.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="grid grid-cols-3 px-4 py-3"
                        >
                          <div className="col-span-1 text-slate-500 text-sm">
                            {item.key}
                          </div>
                          <div className="col-span-2 text-slate-900 font-medium text-sm">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ProductDetails;
