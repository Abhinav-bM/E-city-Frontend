"use client";

import React from "react";

const ProductVariantSelector = ({
  variants = [],
  selectedVariant,
  onSelectVariant,
}) => {
  if (!variants || variants.length === 0) return null;

  // Determine if we are dealing with "New" (Attribute-based) or "Used" (Unique Items)
  // We can check the inventoryType of the selected variant (or the first one)
  const isUnique = selectedVariant?.inventoryType === "Unique";

  // --- LOGIC FOR NEW PRODUCTS (Attribute Selection) ---
  if (!isUnique) {
    // 1. Identify all available attributes (e.g., Color, Storage)
    // We look at all variants to gather all possible keys and values
    const attributeKeys = new Set();
    variants.forEach((v) => {
      if (v.attributes) {
        Object.keys(v.attributes).forEach((k) => attributeKeys.add(k));
      }
    });
    const attributes = Array.from(attributeKeys);

    if (attributes.length === 0) return null; // No attributes to select

    return (
      <div className="space-y-6">
        {attributes.map((attrKey) => {
          // Get all unique values for this attribute
          const values = Array.from(
            new Set(
              variants.map((v) => v.attributes?.[attrKey]).filter(Boolean),
            ),
          );

          return (
            <div key={attrKey}>
              <h4 className="text-sm font-medium text-slate-900 mb-3 capitalize">
                {attrKey}:{" "}
                <span className="text-slate-500 font-normal">
                  {selectedVariant?.attributes?.[attrKey]}
                </span>
              </h4>
              <div className="flex flex-wrap gap-3">
                {values.map((value) => {
                  // Check availability of this specific value
                  // We want to know if selecting this value is possible given current selections of OTHER attributes?
                  // For simplicity, we just check if ANY variant exists with this value.
                  // A more complex solver would check valid combinations.
                  // For now: Is there a variant with this {attrKey: value} that is in stock?

                  // Simple check: Just find the specific variant that matches this value
                  // AND matches the *other* currently selected attributes.
                  // If we change Color, we try to keep Storage the same.

                  const otherAttributes = { ...selectedVariant.attributes };
                  delete otherAttributes[attrKey]; // Remove current attribute being changed

                  // Find best match
                  const match =
                    variants.find((v) => {
                      // Match the value we are clicking
                      if (v.attributes?.[attrKey] !== value) return false;

                      // Match other existing selections
                      return Object.entries(otherAttributes).every(
                        ([key, val]) => v.attributes?.[key] === val,
                      );
                    }) ||
                    variants.find((v) => v.attributes?.[attrKey] === value); // Fallback to any variant with this value

                  const isSelected =
                    selectedVariant?.attributes?.[attrKey] === value;
                  const isAvailable = match?.stock > 0;

                  return (
                    <button
                      key={value}
                      onClick={() => match && onSelectVariant(match)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      } ${!isAvailable ? "opacity-50 cursor-not-allowed decoration-slate-400" : ""}`}
                      disabled={!match} // Or !isAvailable if we want to strict block OOS
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // --- LOGIC FOR USED PRODUCTS (Unique Unit Selection) ---
  // If it's unique, we might have multiple units of the same stats?
  // Or just different variants.
  // For used items, often users want to see specific condition descriptions.

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-slate-900">Select Unit:</h4>
      <div className="grid gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.variantId === variant.variantId;
          return (
            <button
              key={variant.variantId}
              onClick={() => onSelectVariant(variant)}
              className={`flex items-start justify-between p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div>
                <div className="font-medium text-slate-900">
                  {variant.condition}
                  {variant.attributes?.Storage &&
                    ` - ${variant.attributes.Storage}`}
                  {variant.attributes?.Color &&
                    ` - ${variant.attributes.Color}`}
                </div>
                {variant.conditionDescription && (
                  <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {variant.conditionDescription}
                  </div>
                )}
                {variant.conditionGrade && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                    Grade {variant.conditionGrade}
                  </span>
                )}
              </div>
              <div className="font-bold text-slate-900">
                ₹{variant.price?.toLocaleString()}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductVariantSelector;
