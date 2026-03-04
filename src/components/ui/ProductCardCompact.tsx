import Image from "next/image";
import Link from "next/link";

export interface ProductCardCompactProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  variantText?: string;
}

export function ProductCardCompact({
  id,
  title,
  price,
  imageUrl,
  variantText,
}: ProductCardCompactProps) {
  return (
    <Link
      href={`/product/${id}`}
      className="flex w-full items-center gap-4 rounded-xl bg-white p-2 transition-colors hover:bg-slate-50 active:scale-[0.99]"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover object-center"
          sizes="80px"
        />
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <h3 className="text-sm font-medium text-slate-900 line-clamp-2 leading-snug">
          {title}
        </h3>
        {variantText && (
          <span className="mt-0.5 text-xs text-slate-500">{variantText}</span>
        )}
        <span className="mt-1 text-base font-bold text-slate-900">
          ${price.toFixed(2)}
        </span>
      </div>
    </Link>
  );
}
