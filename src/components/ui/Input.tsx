import React, { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg";
  clearable?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      leftIcon,
      rightIcon,
      inputSize = "md",
      clearable,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: "h-8 px-2 text-sm",
      md: "h-10 px-3",
      lg: "h-12 px-4 text-lg",
    };

    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full rounded-md border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${sizeClasses[inputSize]} ${leftIcon ? "pl-10" : ""} ${rightIcon || clearable ? "pr-10" : ""} ${className}`}
          {...props}
        />
        {rightIcon && !clearable && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
