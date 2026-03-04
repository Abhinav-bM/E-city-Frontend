"use client";

import { InputHTMLAttributes } from "react";

export interface ToggleSwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  description?: string;
}

export function ToggleSwitch({
  label,
  description,
  className = "",
  ...props
}: ToggleSwitchProps) {
  return (
    <label
      className={`flex min-h-[48px] w-full cursor-pointer items-center justify-between gap-4 ${className}`}
    >
      <div className="flex flex-col">
        <span className="text-base font-medium text-slate-900">{label}</span>
        {description && (
          <span className="text-sm text-slate-500">{description}</span>
        )}
      </div>
      <div className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full bg-slate-200 transition-colors peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-600 peer-focus:ring-offset-2 [&:has(input:checked)]:bg-blue-600 [&:has(input:disabled)]:opacity-40">
        <input type="checkbox" className="peer sr-only" {...props} />
        <span className="inline-block h-5 w-5 translate-x-1 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-6" />
      </div>
    </label>
  );
}
