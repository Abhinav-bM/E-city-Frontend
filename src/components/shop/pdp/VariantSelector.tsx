"use client";

import React from "react";
import { BaseProduct, Variant } from "./types";

interface VariantSelectorProps {
  baseProduct: BaseProduct;
  selectedVariant: Variant;
  availableVariants: Variant[];
  onSelectVariant: (variant: Variant) => void;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  baseProduct,
  selectedVariant,
  availableVariants,
  onSelectVariant,
}) => {
  // STRICT SEPARATION: Only consider variants that match the current condition (New or Used)
  const relevantVariants = availableVariants.filter(
    (v) => v.condition === selectedVariant.condition,
  );

  // Helper to find a variant with specific attributes within the relevant set
  const findVariant = (attributes: Record<string, string>) => {
    return relevantVariants.find((v) => {
      const attrMatch = Object.entries(attributes).every(
        ([key, val]) => v.attributes[key] === val,
      );
      return attrMatch;
    });
  };

  const handleAttributeChange = (key: string, value: string) => {
    const newAttributes = { ...selectedVariant.attributes, [key]: value };
    // Try to find exact match with current condition
    let nextVariant = findVariant(newAttributes);

    // If not found, we might want to find ANY variant in this condition that has the new attribute value?
    // E.g. Switching Color, but current Storage isn't available in that Color.
    if (!nextVariant) {
      nextVariant = relevantVariants.find((v) => v.attributes[key] === value);
    }

    if (nextVariant) {
      onSelectVariant(nextVariant);
    }
  };

  // Map of common tech/product color names to hex codes
  const colorMap: Record<string, string> = {
    // Standard Colors
    black: "#000000",
    white: "#FFFFFF",
    red: "#EF4444",
    blue: "#3B82F6",
    green: "#22C55E",
    yellow: "#EAB308",
    purple: "#A855F7",
    pink: "#EC4899",
    orange: "#F97316",
    gray: "#6B7280",
    grey: "#6B7280",
    silver: "#E5E7EB",
    gold: "#FFD700",

    // Tech Specific
    midnight: "#191970",
    starlight: "#F8F9EC",
    "space gray": "#4B4B4B",
    "space grey": "#4B4B4B",
    "rose gold": "#B76E79",
    graphite: "#41424C",
    sierra: "#698F9F",
    alpine: "#4E5851",
    porcelain: "#F0EFEF",
    obsidian: "#1A1A1A",
    hazel: "#8E8D80",
    snow: "#FFFAFA",
    charcoal: "#36454F",
    cream: "#FFFDD0",
    titanium: "#878681",
    natural: "#D4C5B3",
  };

  const getColor = (name: string): string | null => {
    const key = name.toLowerCase().trim();
    if (colorMap[key]) return colorMap[key];

    // Check if it's a valid hex code
    if (name.startsWith("#") && (name.length === 4 || name.length === 7)) {
      return name;
    }

    // New/Fallback: If it is a simple one-word name, it might be a standard CSS color.
    // However, to avoid invisible "Porcelain", we strictly trust our map or hex.
    // If it's not in map and not hex, we return null to force Text Mode.
    return null;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Dynamic Attributes */}
      {baseProduct.variantAttributes?.map((attr) => (
        <div key={attr.name} className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
              Select {attr.name}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {attr.values?.map((option) => {
              const isSelected =
                selectedVariant.attributes?.[attr.name] === option;

              const isAvailable = relevantVariants.some(
                (v) => v.attributes[attr.name] === option,
              );

              if (!isAvailable) return null;

              if (attr.name.toLowerCase() === "color") {
                return (
                  <button
                    key={option}
                    onClick={() => handleAttributeChange(attr.name, option)}
                    className={`px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all border ${
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-200"
                        : "border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {option}
                  </button>
                );
              }

              // Default Text Option (Size, Storage, or Unknown Color)
              return (
                <button
                  key={option}
                  onClick={() => handleAttributeChange(attr.name, option)}
                  className={`px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all border ${
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-200"
                      : "border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:text-slate-900"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VariantSelector;
