import { MapPin, Edit2 } from "lucide-react";

export interface AddressCardProps {
  id: string;
  name: string;
  street: string;
  cityStateZip: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function AddressCard({
  id,
  name,
  street,
  cityStateZip,
  isSelected,
  onSelect,
  onEdit,
}: AddressCardProps) {
  return (
    <div
      className={`relative flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all active:scale-[0.99] ${
        isSelected
          ? "border-blue-600 bg-blue-50/50 shadow-[0px_2px_4px_rgba(15,23,42,0.04)]"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
      onClick={() => onSelect?.(id)}
      role="radio"
      aria-checked={isSelected}
    >
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}
      >
        {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <span className="text-sm font-semibold text-slate-900">{name}</span>
        <span className="text-sm text-slate-600">{street}</span>
        <span className="text-sm text-slate-600">{cityStateZip}</span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(id);
        }}
        className="flex h-[48px] w-[48px] -mr-2 -mt-2 shrink-0 items-center justify-center rounded-full text-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        aria-label="Edit address"
      >
        <Edit2 size={18} />
      </button>
    </div>
  );
}
