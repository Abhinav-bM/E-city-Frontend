"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductData, Variant } from "./types";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import VariantSelector from "./VariantSelector";
import UniqueUnitPicker from "./UniqueUnitPicker";
import ProductActions from "./ProductActions";
import TechSpecs from "./TechSpecs";
import ProductHighlights from "./ProductHighlights";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ProductMainProps {
  productData: ProductData;
}

const ProductMain: React.FC<ProductMainProps> = ({ productData }) => {
  const router = useRouter();
  const { baseProduct, availableVariants } = productData;

  // We initialize state from props, but updating it will trigger navigation
  // or local updates depending on if we have all data.
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    productData.currentVariant,
  );

  // Sync state if props change (e.g. after navigation)
  useEffect(() => {
    setSelectedVariant(productData.currentVariant);
  }, [productData.currentVariant]);

  const handleVariantChange = (variant: Variant) => {
    if (variant.slug && variant.slug !== selectedVariant.slug) {
      // Optimistic update for immediate visual feedback
      setSelectedVariant(variant);
      router.push(`/shop/${variant.slug}`);
    } else if (variant.variantId !== selectedVariant.variantId) {
      // Same slug but different internal ID? (Unlikely but possible for specific units if they share slug)
      // If they share slug, we must update state locally.
      setSelectedVariant(variant);
    }
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: productData.baseProduct.title, href: "#" },
  ];

  return (
    <div className="bg-white min-h-screen pb-20 pt-16 lg:pt-20">
      {/* Breadcrumbs - Ultra Minimal */}
      <div className="border-b border-slate-50 sticky top-16 z-20 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight size={10} className="text-slate-300" />
          <Link href="/shop" className="hover:text-slate-900 transition-colors">
            Shop
          </Link>
          <ChevronRight size={10} className="text-slate-300" />
          <span className="text-slate-900 truncate max-w-[200px]">
            {productData.baseProduct.title}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6">
            <div className="sticky top-32">
              <ProductGallery
                images={selectedVariant.images}
                isRefurbished={selectedVariant.condition !== "New"}
              />

              {/* Highlights */}
              <div className="mt-8">
                <ProductHighlights
                  specifications={baseProduct.specifications}
                />
              </div>

              <div className="hidden lg:block mt-12">
                <div className="flex flex-col gap-2 mb-6">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">
                    Overview
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Product Stories
                  </h3>
                </div>
                <div
                  className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm"
                  dangerouslySetInnerHTML={{ __html: baseProduct.description }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-6">
            <div className="flex flex-col gap-8">
              <ProductInfo
                title={baseProduct.title}
                variant={selectedVariant}
              />

              <VariantSelector
                baseProduct={baseProduct}
                selectedVariant={selectedVariant}
                availableVariants={availableVariants}
                onSelectVariant={handleVariantChange}
              />

              <UniqueUnitPicker
                currentVariant={selectedVariant}
                availableVariants={availableVariants}
                onSelectVariant={handleVariantChange}
              />

              <ProductActions
                baseProduct={baseProduct}
                selectedVariant={selectedVariant}
              />

              {/* Mobile Description */}
              <div className="lg:hidden mt-8 pt-8 border-t border-slate-100">
                <div className="flex flex-col gap-2 mb-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">
                    Overview
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Product Overview
                  </h3>
                </div>
                <div
                  className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm"
                  dangerouslySetInnerHTML={{ __html: baseProduct.description }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Section */}
        <div className="mt-16 pt-12 border-t border-slate-100">
          <TechSpecs baseProduct={baseProduct} />
        </div>
      </div>
    </div>
  );
};

export default ProductMain;
