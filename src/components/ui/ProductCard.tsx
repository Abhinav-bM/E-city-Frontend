import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

export interface ProductCardProps {
  id: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
}

export function ProductCard({
  id,
  title,
  brand,
  price,
  originalPrice,
  imageUrl,
  rating,
  reviewCount,
}: ProductCardProps) {
  return (
    <Link
      href={`/product/${id}`}
      className="group flex flex-col gap-3 rounded-2xl p-3 transition-shadow hover:shadow-[0px_4px_12px_rgba(15,23,42,0.08)] bg-white active:scale-[0.98]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-50">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        {originalPrice && originalPrice > price && (
          <div className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
            -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {brand}
        </span>
        <h3 className="text-sm font-medium text-slate-900 line-clamp-2 leading-tight">
          {title}
        </h3>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-bold text-slate-900">
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-xs text-slate-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {rating && (
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-slate-700">
              {rating.toFixed(1)}
            </span>
            {reviewCount && (
              <span className="text-xs text-slate-500">({reviewCount})</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
