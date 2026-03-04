import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Badge, PriceDisplay, ConditionBadge, Button } from "@/components/ui";

interface ProductCardProps {
  id: string | number;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  condition?: "new" | "grade-a" | "grade-b" | "grade-c" | "refurbished";
  isNewArrival?: boolean;
  isInStock?: boolean;
  rating?: number;
  reviews?: number;
  layout?: "grid" | "list";
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  image,
  price,
  originalPrice,
  condition = "new",
  isNewArrival = false,
  isInStock = true,
  rating,
  reviews,
  layout = "grid",
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  const isList = layout === "list";

  return (
    <div
      className={`
        group relative bg-surface-card rounded-lg border border-border-default hover:border-blue-300
        transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)]
        hover:shadow-card-hover
        overflow-hidden flex flex-col h-full
        ${isList ? "flex-row sm:h-40" : ""}
      `}
    >
      {/* Badges Container */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 items-start">
        {isNewArrival && <Badge variant="new">New</Badge>}
        {condition !== "new" && (
          <ConditionBadge condition={condition} showLabel={!isList} />
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleWishlist?.();
        }}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full backdrop-blur-md transition-all touch-target ${
          isWishlisted
            ? "bg-red-50 text-red"
            : "bg-white/70 text-navy-400 hover:text-red hover:bg-red-50"
        }`}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      {/* Image Area */}
      <Link
        href={`/product/${id}`}
        className={`relative block ${isList ? "w-1/3 sm:w-40 flex-shrink-0" : "w-full aspect-square"} bg-surface-page p-4`}
      >
        <div className="relative w-full h-full mix-blend-multiply">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500"
            sizes={
              isList
                ? "160px"
                : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            }
          />
        </div>
        {!isInStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
            <Badge variant="error" className="shadow-lg">
              Out of Stock
            </Badge>
          </div>
        )}
      </Link>

      {/* Content Area */}
      <div
        className={`p-3 md:p-4 flex flex-col flex-1 ${isList ? "justify-between" : ""}`}
      >
        <Link
          href={`/product/${id}`}
          className="block mb-1 group-hover:text-blue-600 transition-colors"
        >
          <h3 className="text-sm md:text-base font-semibold text-text-heading line-clamp-2 md:line-clamp-1">
            {title}
          </h3>
        </Link>

        {rating && (
          <div className="flex items-center gap-1 mb-2 mt-auto">
            <span className="text-amber-500 text-xs">★</span>
            <span className="text-xs font-medium text-navy-700">
              {rating.toFixed(1)}
            </span>
            {reviews && (
              <span className="text-[10px] text-text-muted">({reviews})</span>
            )}
          </div>
        )}

        {/* Spacer for grid layout if no rating */}
        {!rating && !isList && <div className="mt-auto" />}

        <div
          className={`flex ${isList ? "flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2" : "flex-col gap-3"}`}
        >
          <PriceDisplay
            price={price}
            originalPrice={originalPrice}
            size={isList ? "md" : "sm"}
            className="mt-1"
          />

          {isInStock ? (
            <Button
              variant="outline"
              size="sm"
              className={`w-full ${isList ? "sm:w-auto" : ""} group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-700`}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                onAddToCart?.();
              }}
              leftIcon={<ShoppingCart size={16} />}
            >
              Add
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-text-muted"
              disabled
            >
              Unavailable
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
export type { ProductCardProps };
