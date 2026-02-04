"use client";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const ProductVariantSelector = ({ product }) => {
  const router = useRouter();
  const { price } = product.currrentVariant || {};
  const { variantAttributes = [] } = product.baseProduct;
  const allVariants = product.availableVariants || [];

  // --- CONDITION LOGIC ---
  // Check what conditions are available
  const hasNew = allVariants.some((v) => !v.condition || v.condition === "New");
  const hasUsed = allVariants.some((v) => v.condition && v.condition !== "New");

  // Default to New if available, else Used
  const [selectedCondition, setSelectedCondition] = useState(
    hasNew ? "New" : "Used",
  );

  // Filter variants based on the selected condition
  const variants = useMemo(() => {
    if (selectedCondition === "New") {
      return allVariants.filter((v) => !v.condition || v.condition === "New");
    } else {
      return allVariants.filter((v) => v.condition && v.condition !== "New");
    }
  }, [allVariants, selectedCondition]);

  // --- EXISTING ATTRIBUTE LOGIC (Applied to filtered 'variants') ---
  const [selectedAttributes, setSelectedAttributes] = useState({});

  // Initialize with default variant if available (and reset when condition changes)
  useEffect(() => {
    if (variants.length > 0) {
      // Try to find a variant that matches current selectedAttributes first
      const currentMatch = variants.find((v) =>
        variantAttributes.every(
          (attr) => v.attributes?.[attr.name] === selectedAttributes[attr.name],
        ),
      );

      if (!currentMatch) {
        // If no match in this condition, pick the first available one as default
        const defaultVariant = variants[0];
        if (defaultVariant?.attributes) {
          setSelectedAttributes(defaultVariant.attributes);
        }
      }
    }
  }, [variants, selectedCondition]); // Depend on selectedCondition to reset

  const matchingVariant = useMemo(() => {
    if (!variants.length || !variantAttributes.length) return null;
    const allSelected = variantAttributes.every(
      (attr) => selectedAttributes[attr.name],
    );
    if (!allSelected) return null;

    // For "New", we expect distinct combinations.
    // For "Used", there might be multiple items with same attributes (unique units).
    // We'll return the FIRST match here for price display,
    // but handle the specific list separately for 'Used'.
    return variants.find((variant) => {
      if (!variant.attributes) return false;
      return variantAttributes.every((attr) => {
        return variant.attributes[attr.name] === selectedAttributes[attr.name];
      });
    });
  }, [selectedAttributes, variants, variantAttributes]);

  const getAvailableValues = useMemo(() => {
    return (attributeName) => {
      const otherSelections = { ...selectedAttributes };
      delete otherSelections[attributeName];
      const hasOtherSelections = Object.keys(otherSelections).length > 0;

      let validVariants = variants;
      if (hasOtherSelections) {
        validVariants = variants.filter((variant) => {
          if (!variant.attributes) return false;
          return Object.keys(otherSelections).every(
            (key) => variant.attributes[key] === otherSelections[key],
          );
        });
      }

      const values = new Set();
      validVariants.forEach((variant) => {
        if (variant.attributes?.[attributeName]) {
          values.add(variant.attributes[attributeName]);
        }
      });
      return Array.from(values);
    };
  }, [selectedAttributes, variants]);

  const handleAttributeSelect = (attributeName, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  const handleVariantSelect = (variantId) => {
    if (variantId) {
      router.replace(`/shop/${variantId}`);
    }
  };

  const isValueAvailable = (attributeName, value) => {
    return getAvailableValues(attributeName).includes(value);
  };

  const displayPrice = matchingVariant?.price || product?.price || price || 0;
  // For used items, we might show a range or "From X"
  const minPrice =
    variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : 0;

  // Find ALL matching unique units for the selected attributes in "Used" mode
  const matchingUniqueUnits = useMemo(() => {
    if (selectedCondition === "New") return [];
    if (!variants.length) return [];

    return variants.filter((variant) => {
      return variantAttributes.every(
        (attr) =>
          variant.attributes?.[attr.name] === selectedAttributes[attr.name],
      );
    });
  }, [variants, selectedCondition, selectedAttributes]);

  if (!variantAttributes.length || !allVariants.length) {
    return (
      <div className="my-4">
        <span className="font-semibold text-2xl">₹ {displayPrice}</span>
        <p className="text-gray-500 text-sm mt-2">No variants available</p>
      </div>
    );
  }

  return (
    <div className="my-4">
      {/* CONDITION TABS */}
      {hasUsed && (
        <div className="flex border-b border-gray-200 mb-6">
          {hasNew && (
            <button
              onClick={() => setSelectedCondition("New")}
              className={clsx(
                "px-6 py-2 font-medium text-sm focus:outline-none transition-colors duration-200 border-b-2",
                selectedCondition === "New"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700",
              )}
            >
              Buy New
            </button>
          )}
          <button
            onClick={() => setSelectedCondition("Used")}
            className={clsx(
              "px-6 py-2 font-medium text-sm focus:outline-none transition-colors duration-200 border-b-2",
              selectedCondition === "Used"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700",
            )}
          >
            Buy Used / Refurbished
          </button>
        </div>
      )}

      {/* Price Display */}
      <div className="mb-4">
        <span className="font-semibold text-2xl">
          {selectedCondition === "Used" && matchingUniqueUnits.length > 1
            ? `From ₹ ${Math.min(...matchingUniqueUnits.map((u) => u.price))}`
            : `₹ ${displayPrice}`}
        </span>
      </div>

      {/* Standard Attribute Selection */}
      <div className="mt-5 space-y-4">
        {variantAttributes.map((attr) => {
          const isSelected = selectedAttributes[attr.name];
          return (
            <div key={attr._id || attr.name} className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                {attr.name}{" "}
                {isSelected && (
                  <span className="ml-2 text-sm text-gray-500 font-normal">
                    ({isSelected})
                  </span>
                )}
              </h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {attr.values?.map((value, idx) => {
                  const isAvailable = isValueAvailable(attr.name, value);
                  const isCurrentlySelected =
                    selectedAttributes[attr.name] === value;
                  const isDisabled = !isAvailable;

                  return (
                    <button
                      key={idx}
                      onClick={() =>
                        !isDisabled && handleAttributeSelect(attr.name, value)
                      }
                      disabled={isDisabled}
                      className={clsx(
                        "px-4 py-2 rounded-sm border transition-all duration-200 text-sm font-medium",
                        isCurrentlySelected
                          ? "border-primary bg-primary text-white shadow-md"
                          : "border-gray-300 bg-white text-gray-700 hover:border-primary hover:bg-gray-50",
                        isDisabled
                          ? "opacity-40 cursor-not-allowed line-through"
                          : "cursor-pointer",
                      )}
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

      {/* NEW: Unique Unit Selection List (Only for Used) */}
      {selectedCondition === "Used" && matchingUniqueUnits.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="font-semibold text-gray-800">Available Units</h3>
          {matchingUniqueUnits.map((unit) => (
            <div
              key={unit.sku || unit.variantId}
              className="border border-gray-200 rounded-md p-4 flex justify-between items-center bg-gray-50 hover:border-orange-300 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "text-xs px-2 py-0.5 rounded font-bold uppercase",
                      unit.condition === "Refurbished"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800",
                    )}
                  >
                    {unit.condition}
                  </span>
                  <span className="font-bold text-gray-900">
                    ₹ {unit.price}
                  </span>
                </div>
                {unit.conditionDescription && (
                  <p className="text-sm text-gray-600 mt-1 max-w-md">
                    {unit.conditionDescription}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">SKU: {unit.sku}</p>
              </div>
              <button
                onClick={() => handleVariantSelect(unit.variantId)}
                className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded hover:bg-orange-700 transition"
              >
                Select Unit
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Standard "Buy" Button (Only for New) */}
      {selectedCondition === "New" && matchingVariant && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleVariantSelect(matchingVariant.variantId)}
            className={clsx(
              "w-full py-3 px-6 rounded-sm font-semibold text-white transition-all duration-200",
              matchingVariant.stock > 0
                ? "bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg"
                : "bg-gray-400 cursor-not-allowed",
            )}
          >
            {matchingVariant.stock > 0
              ? `Buy New - ₹${matchingVariant.price}`
              : "Out of Stock"}
          </button>
        </div>
      )}

      {/* Selection Warning */}
      {!matchingVariant &&
        selectedCondition !== "Used" &&
        variantAttributes.some((attr) => selectedAttributes[attr.name]) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-sm">
            <p className="text-sm text-blue-700">Please select all options</p>
          </div>
        )}
    </div>
  );
};

export default ProductVariantSelector;
