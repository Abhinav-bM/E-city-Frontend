"use client";

export interface PillOption {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface PillSelectorProps {
  options: PillOption[];
  selectedValue?: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
}

export function PillSelector({
  options,
  selectedValue,
  onChange,
  ariaLabel,
}: PillSelectorProps) {
  return (
    <div
      className="flex flex-wrap gap-3"
      role="radiogroup"
      aria-label={ariaLabel || "Select an option"}
    >
      {options.map((option) => {
        const isSelected = selectedValue === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={option.disabled}
            onClick={() => onChange(option.id)}
            className={`flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
              isSelected
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
