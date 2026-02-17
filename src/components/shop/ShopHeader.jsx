"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Filter,
  Package,
  RefreshCcw,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";

const ShopHeader = ({ totalProducts, onFilterClick }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "newest";
  const currentType = searchParams.get("type") || "new";

  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortValue);
    router.push(`/shop?${params.toString()}`);
  };

  const handleTypeChange = (type) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type);
    params.delete("condition");
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      {/* Left Section: Product Count & Mobile Filter */}
      <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
        <div className="flex items-baseline gap-2 pl-2">
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            {totalProducts}
          </span>
          <span className="text-sm font-medium text-gray-500">
            Products Found
          </span>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={onFilterClick}
          className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 font-semibold text-xs border border-transparent active:scale-95 transition-all"
        >
          <Filter size={14} strokeWidth={2.5} />
          <span>Filter</span>
        </button>
      </div>

      {/* Center Section: Type Toggle */}
      <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl w-full sm:w-auto self-center">
        <button
          onClick={() => handleTypeChange("new")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
            currentType === "new"
              ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          <Package size={16} strokeWidth={currentType === "new" ? 2.5 : 2} />
          <span>New</span>
        </button>
        <button
          onClick={() => handleTypeChange("used")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
            currentType === "used"
              ? "bg-white text-amber-600 shadow-sm ring-1 ring-black/5"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
          }`}
        >
          <RefreshCcw
            size={16}
            strokeWidth={currentType === "used" ? 2.5 : 2}
          />
          <span>Used</span>
        </button>
      </div>

      {/* Right Section: Sort Dropdown */}
      <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <ArrowUpDown
              size={14}
              className="text-gray-400 group-hover:text-gray-600 transition-colors"
            />
          </div>
          <select
            id="sort"
            value={currentSort}
            onChange={handleSortChange}
            className="appearance-none w-full sm:w-auto text-sm bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-9 pr-10 cursor-pointer font-semibold text-gray-700 hover:bg-white hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all duration-200"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A-Z</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDown
              size={14}
              className="text-gray-400 group-hover:text-gray-600 transition-colors"
              strokeWidth={2.5}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
