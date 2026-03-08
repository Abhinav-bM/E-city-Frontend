"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, ChevronRight } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A–Z" },
];

/* Keys to hide from filter chips (internal / non-user-facing) */
const HIDDEN_CHIP_KEYS = new Set(["page", "sort", "limit", "isActive"]);

/* Friendly labels for chip display */
const CHIP_LABELS = {
  condition: "Condition",
  category: "Category",
  brand: "Brand",
  minPrice: "Min Price",
  maxPrice: "Max Price",
};

const ShopHeader = ({
  totalProducts,
  loadedCount,
  onFilterClick,
  categoryName,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  /* ── Display range (infinite scroll — always starts at 1) ── */
  const end = Math.min(loadedCount || 0, totalProducts);

  /* ── Sort handler ── */
  const handleSortChange = (sortValue) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortValue);
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  };

  /* ── Active filter chips ── */
  const activeFilters = [];
  for (const [key, value] of searchParams.entries()) {
    if (HIDDEN_CHIP_KEYS.has(key)) continue;
    // Show category name instead of raw ID
    const displayValue =
      key === "category" && categoryName ? categoryName : value;
    activeFilters.push({ key, value: displayValue });
  }

  const removeFilter = (key) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const sort = searchParams.get("sort");
    const params = new URLSearchParams();
    if (sort) params.set("sort", sort);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm px-5 py-4 mt-2 sm:px-6 sm:py-5 space-y-3">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm text-slate-400">
        <a href="/" className="hover:text-slate-700 transition-colors">
          Home
        </a>
        <ChevronRight size={14} className="text-slate-300" />
        {categoryName ? (
          <>
            <a href="/shop" className="hover:text-slate-700 transition-colors">
              Shop
            </a>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-slate-700 font-medium">{categoryName}</span>
          </>
        ) : (
          <span className="text-slate-700 font-medium">Shop</span>
        )}
      </nav>
      {/* Row 1: Product count + mobile filter button */}
      <div className="flex items-center justify-between">
        <p className="text-sm sm:text-base font-semibold text-slate-800 !hidden">
          {totalProducts > 0 ? (
            <>
              Showing <span className="font-bold text-slate-900">1–{end}</span>{" "}
              of{" "}
              <span className="font-bold text-slate-900">
                {totalProducts.toLocaleString("en-IN")}
              </span>{" "}
              results
              {categoryName && (
                <span className="text-slate-500">
                  {" "}
                  for &ldquo;
                  <span className="text-slate-700">{categoryName}</span>
                  &rdquo;
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-500">No results found</span>
          )}
        </p>

        <button
          onClick={onFilterClick}
          className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-slate-600 text-sm font-semibold border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
        >
          <Filter size={14} strokeWidth={2.5} />
          Filter
          {activeFilters.length > 0 && (
            <span className="ml-0.5 bg-slate-800 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilters.length}
            </span>
          )}
        </button>
      </div>

      {/* Row 2: Active filter chips (if any) */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {activeFilters.map(({ key, value }) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-full pl-3 pr-1.5 py-1.5"
            >
              <span className="text-slate-400 font-semibold">
                {CHIP_LABELS[key] || key}:
              </span>
              <span className="font-semibold truncate max-w-[120px]">
                {value}
              </span>
              <button
                onClick={() => removeFilter(key)}
                className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                aria-label={`Remove ${key} filter`}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </span>
          ))}
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors ml-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Row 3: Sort links */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
          Sort by
        </span>
        {SORT_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleSortChange(value)}
            className={`text-sm px-2.5 py-1 rounded-md transition-all duration-200 cursor-pointer ${
              currentSort === value
                ? "text-slate-900 font-semibold underline underline-offset-4 decoration-2 decoration-slate-800"
                : "text-slate-400 font-medium hover:text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShopHeader;
