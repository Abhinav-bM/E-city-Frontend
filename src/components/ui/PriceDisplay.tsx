import React from "react";

export interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: { current: "text-sm", original: "text-[10px]", saveText: "text-[9px]" },
    md: {
      current: "text-base md:text-lg",
      original: "text-xs",
      saveText: "text-[10px]",
    },
    lg: {
      current: "text-xl md:text-2xl",
      original: "text-sm",
      saveText: "text-xs",
    },
  };

  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-end gap-2">
        <span
          className={`font-bold text-slate-900 ${sizeClasses[size].current}`}
        >
          ₹{price?.toLocaleString() || 0}
        </span>
        {discount > 0 && (
          <span
            className={`font-medium text-slate-400 line-through mb-0.5 ${sizeClasses[size].original}`}
          >
            ₹{originalPrice?.toLocaleString()}
          </span>
        )}
      </div>
      {discount > 0 && (
        <span
          className={`font-bold text-emerald-600 mt-0.5 ${sizeClasses[size].saveText}`}
        >
          Save {discount}%
        </span>
      )}
    </div>
  );
};
