"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { QuantityStepper } from "../ui/QuantityStepper";

export interface CartItemBlockProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  variantText?: string;
  quantity: number;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemBlock({
  id,
  title,
  price,
  imageUrl,
  variantText,
  quantity,
  onUpdateQuantity,
  onRemove,
}: CartItemBlockProps) {
  return (
    <div className="flex w-full gap-4 border-b border-slate-100 py-4 last:border-0 bg-white">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-50">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-slate-900 line-clamp-2">
              {title}
            </h3>
            {variantText && (
              <span className="mt-1 text-xs text-slate-500">{variantText}</span>
            )}
          </div>
          <button
            onClick={() => onRemove(id)}
            className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 -mr-2 -mt-2"
            aria-label="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex items-end justify-between mt-2">
          <span className="text-base font-bold text-slate-900">
            ${price.toFixed(2)}
          </span>
          <QuantityStepper
            value={quantity}
            onChange={(val) => onUpdateQuantity(id, val)}
            max={10}
          />
        </div>
      </div>
    </div>
  );
}
