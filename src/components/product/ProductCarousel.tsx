import React from "react";
import type { ProductCardProduct } from "@/components/product-card/types";

interface ProductCarouselProps {
  title?: string;
  subtitle?: string;
  products?: ProductCardProduct[];
  className?: string;
  actionLabel?: string;
  actionHref?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="py-8 text-center bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-xl font-bold">{title || "Products"}</h3>
      <p className="text-gray-500">{subtitle}</p>
      <p className="text-gray-500 mt-4">Product carousel coming soon...</p>
    </div>
  );
};

export default ProductCarousel;
