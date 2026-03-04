"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "icon" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 min-h-[48px] px-4";

    const variants = {
      primary: "bg-slate-900 text-white hover:bg-slate-800",
      secondary:
        "bg-transparent text-slate-900 border border-slate-200 hover:bg-slate-50",
      outline:
        "bg-transparent text-slate-900 border border-slate-200 hover:bg-slate-50",
      ghost: "bg-transparent text-slate-900 hover:bg-slate-100",
      danger: "bg-red-600 text-white hover:bg-red-700",
      icon: "p-0 w-[48px] h-[48px]", // overrides px-4
    };

    const sizeClasses = {
      sm: "min-h-[36px] px-3 text-sm",
      md: "min-h-[48px] px-4",
      lg: "min-h-[56px] px-6 text-lg",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizeClasses[size] || ""} ${widthClass} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {!isLoading && children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
