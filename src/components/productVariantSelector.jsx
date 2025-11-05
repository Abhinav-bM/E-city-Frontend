"use client";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const ProductVariantSelector = ({ product }) => {
  const router = useRouter();
  const { price } = product.currrentVariant || {};
  const { variantAttributes = [] } = product.baseProduct;
  const variants = product.availableVariants || [];

  // Track selected attributes: { Color: "Blue", Ram: "8GB", Rom: "128GB" }
  const [selectedAttributes, setSelectedAttributes] = useState({});

  // Initialize with default variant if available
  useEffect(() => {
    if (variants.length > 0) {
      const defaultVariant = variants.find((v) => v.isDefault) || variants[0];
      if (defaultVariant?.attributes) {
        setSelectedAttributes(defaultVariant.attributes);
      }
    }
  }, [variants]);

  // Find matching variant based on selected attributes
  const matchingVariant = useMemo(() => {
    if (!variants.length || !variantAttributes.length) return null;

    // Check if all attributes are selected
    const allSelected = variantAttributes.every(
      (attr) => selectedAttributes[attr.name]
    );

    if (!allSelected) return null;

    // Find variant that matches all selected attributes
    return variants.find((variant) => {
      if (!variant.attributes) return false;

      return variantAttributes.every((attr) => {
        return variant.attributes[attr.name] === selectedAttributes[attr.name];
      });
    });
  }, [selectedAttributes, variants, variantAttributes]);

  // Get available values for an attribute based on current selections
  const getAvailableValues = useMemo(() => {
    return (attributeName) => {
      // If no other attributes are selected, show all values
      const otherSelections = { ...selectedAttributes };
      delete otherSelections[attributeName];

      const hasOtherSelections = Object.keys(otherSelections).length > 0;

      if (!hasOtherSelections) {
        // Return all unique values for this attribute from variants
        const values = new Set();
        variants.forEach((variant) => {
          if (variant.attributes?.[attributeName]) {
            values.add(variant.attributes[attributeName]);
          }
        });
        return Array.from(values);
      }

      // Filter variants that match other selected attributes
      const matchingVariants = variants.filter((variant) => {
        if (!variant.attributes) return false;
        return Object.keys(otherSelections).every(
          (key) => variant.attributes[key] === otherSelections[key]
        );
      });

      // Extract unique values for this attribute from matching variants
      const values = new Set();
      matchingVariants.forEach((variant) => {
        if (variant.attributes?.[attributeName]) {
          values.add(variant.attributes[attributeName]);
        }
      });
      return Array.from(values);
    };
  }, [selectedAttributes, variants]);

  // Handle attribute selection
  const handleAttributeSelect = (attributeName, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  // Handle variant selection and routing
  const handleVariantSelect = () => {
    console.log("matching variant : ", matchingVariant)
    if (matchingVariant?.variantId) {
      router.replace(`/shop/${matchingVariant.variantId}`);
    }
  };

  // Check if a value is available for selection
  const isValueAvailable = (attributeName, value) => {
    const availableValues = getAvailableValues(attributeName);
    return availableValues.includes(value);
  };

  // Check if a value is out of stock
  const isOutOfStock = (attributeName, value) => {
    if (
      !matchingVariant &&
      variantAttributes.every((attr) =>
        attr.name === attributeName
          ? selectedAttributes[attr.name] === value
          : selectedAttributes[attr.name]
      )
    ) {
      // Check if all attributes would match (except current one)
      const testAttributes = { ...selectedAttributes, [attributeName]: value };
      const testVariant = variants.find((variant) => {
        if (!variant.attributes) return false;
        return variantAttributes.every(
          (attr) => variant.attributes[attr.name] === testAttributes[attr.name]
        );
      });
      return testVariant ? testVariant.stock === 0 : false;
    }
    return matchingVariant?.stock === 0;
  };

  // Get current display price
  const displayPrice = matchingVariant?.price || product?.price || price || 0;
  const displayStock = matchingVariant?.stock ?? null;

  if (!variantAttributes.length || !variants.length) {
    return (
      <div className="my-4">
        <span className="font-semibold text-2xl">₹ {displayPrice}</span>
        <p className="text-gray-500 text-sm mt-2">No variants available</p>
      </div>
    );
  }

  return (
    <div className="my-4">
      {/* Price Display */}
      <div className="mb-4">
        <span className="font-semibold text-2xl">₹ {displayPrice}</span>
        {displayStock !== null && (
          <span
            className={clsx(
              "ml-4 text-sm font-medium",
              displayStock > 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {displayStock > 0 ? `In Stock (${displayStock})` : "Out of Stock"}
          </span>
        )}
      </div>

      {/* Attribute Selection */}
      <div className="mt-5 space-y-4">
        {variantAttributes.map((attr) => {
          const availableValues = getAvailableValues(attr.name);
          const isSelected = selectedAttributes[attr.name];

          return (
            <div key={attr._id || attr.name} className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                {attr.name}
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
                          : "cursor-pointer"
                      )}
                      title={
                        isDisabled ? "This combination is not available" : value
                      }
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

      {/* Variant Selection Button */}
      {matchingVariant && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handleVariantSelect}
            // disabled={matchingVariant.stock === 0}
            className={clsx(
              "w-full py-3 px-6 rounded-sm font-semibold text-white transition-all duration-200",
              matchingVariant.stock > 0
                ? "bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg"
                : "bg-gray-400 cursor-not-allowed"
            )}
          >
            {matchingVariant.stock > 0
              ? `Select Variant - ₹${matchingVariant.price}`
              : "Out of Stock"}
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {matchingVariant.title || "Selected variant"}
          </p>
        </div>
      )}

      {/* Selection Status */}
      {!matchingVariant &&
        variantAttributes.some((attr) => selectedAttributes[attr.name]) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-sm">
            <p className="text-sm text-blue-700">
              Please select all options to view variant details
            </p>
          </div>
        )}
    </div>
  );
};

export default ProductVariantSelector;
