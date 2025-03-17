"use client";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";

const ProductVariantSelector = ({ product }) => {
  const { basePrice, variantAttributes, variants } = product;

  // Find the variant with the lowest price
  const lowestPriceVariant = useMemo(() => {
    return variants.reduce((minVariant, currentVariant) => {
      return currentVariant.price < minVariant.price
        ? currentVariant
        : minVariant;
    }, variants[0]); // Start with the first variant
  }, [variants]);

  // Initial selection based on the lowest price variant
  const initialSelection = useMemo(() => {
    return lowestPriceVariant
      ? { ...lowestPriceVariant.attributes }
      : variantAttributes.reduce((acc, attr) => {
          acc[attr.name] = attr.values[0];
          return acc;
        }, {});
  }, [lowestPriceVariant, variantAttributes]);

  const [selectedAttributes, setSelectedAttributes] =
    useState(initialSelection);

  // Find the matching variant when attributes change
  const selectedVariant = useMemo(() => {
    return variants.find((variant) =>
      Object.entries(selectedAttributes).every(
        ([key, value]) => variant.attributes[key] === value
      )
    );
  }, [selectedAttributes, variants]);

  // This function returns all the possible valid combinations for a specific attribute
  // considering the current selection for other attributes
  const getAvailableValues = (attributeName) => {
    // Get a set of all available values for this attribute across all variants
    return [
      ...new Set(variants.map((variant) => variant.attributes[attributeName])),
    ];
  };

  // Check if a specific attribute value would lead to a valid variant
  // when combined with the current selections of other attributes
  const isValidCombination = (attributeName, value) => {
    // Create a new potential selection with this attribute value
    const potentialSelection = {
      ...selectedAttributes,
      [attributeName]: value,
    };

    // For each attribute in our selection
    for (const attrName of Object.keys(potentialSelection)) {
      // Skip the current attribute we're checking
      if (attrName === attributeName) continue;

      // Check if there exists a variant with the current attribute value
      // and the potential selection for the attribute we're checking
      const validVariantExists = variants.some(
        (variant) =>
          variant.attributes[attributeName] === value &&
          variant.attributes[attrName] === potentialSelection[attrName]
      );

      if (!validVariantExists) return false;
    }

    return true;
  };

  // Handle attribute selection
  const _handleSelection = (name, value) => {
    // Update the selection for this attribute
    setSelectedAttributes((prev) => {
      const newSelection = { ...prev, [name]: value };

      // Check if the new selection forms a valid variant
      const validVariant = variants.find((variant) =>
        Object.entries(newSelection).every(
          ([key, val]) => variant.attributes[key] === val
        )
      );

      // If no valid variant, update only the current attribute
      // and reset other attributes to find valid combinations
      if (!validVariant) {
        const resetSelection = { ...initialSelection };
        resetSelection[name] = value;

        // Try to find a valid variant with this selection
        const firstValidVariant = variants.find(
          (variant) => variant.attributes[name] === value
        );

        // If we found a valid variant, use its attributes
        if (firstValidVariant) {
          return { ...firstValidVariant.attributes };
        }

        return resetSelection;
      }

      return newSelection;
    });
  };

  return (
    <div className={clsx("my-4")}>
      <span className="font-semibold text-2xl">
        ₹ {selectedVariant?.price || basePrice}
      </span>
      {/* Attribute Selection */}
      <div className="mt-5">
        {variantAttributes.map((attr, id) => {
          const availableValues = getAvailableValues(attr.name);

          return (
            <div key={id} className="mb-4">
              <h4 className="font-semibold">{attr.name}</h4>
              <div className="flex gap-2 mt-1">
                {attr.values.map((value, id) => {
                  // Option is available if it exists in any variant for this attribute
                  const isAvailable = availableValues.includes(value);

                  return (
                    <button
                      key={id}
                      onClick={() =>
                        isAvailable && _handleSelection(attr.name, value)
                      }
                      disabled={!isAvailable}
                      className={clsx(
                        "px-4 py-1 rounded-sm border transition relative",
                        selectedAttributes[attr.name] === value
                          ? "border-primary bg-primary text-textSecondary"
                          : "border-primary",
                        !isAvailable
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-primary hover:text-textSecondary"
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
    </div>
  );
};

export default ProductVariantSelector;
