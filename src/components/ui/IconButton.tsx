import React, { ButtonHTMLAttributes, forwardRef } from "react";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  badge?: number;
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className = "",
      variant = "ghost",
      size = "md",
      badge,
      label,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 relative";

    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
      danger: "bg-red-100 text-red-600 hover:bg-red-200",
    };

    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
    };

    return (
      <button
        ref={ref}
        aria-label={label}
        className={`${baseStyles} ${variants[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
        {typeof badge === "number" && badge > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-[3px] text-[10px] font-bold text-white ring-2 ring-white">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
