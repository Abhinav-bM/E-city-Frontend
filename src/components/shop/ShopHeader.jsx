"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List, SlidersHorizontal, Filter } from "lucide-react";

const ShopHeader = ({ totalProducts, onFilterClick }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortValue);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
      {/* Mobile Filter Toggle & Count */}
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="text-slate-600 text-sm font-medium">
          Showing{" "}
          <span className="font-bold text-slate-900">{totalProducts}</span>{" "}
          results
        </div>

        <button
          onClick={onFilterClick}
          className="lg:hidden flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-2 rounded-md hover:bg-slate-200 transition-colors"
        >
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort"
            className="text-sm text-slate-500 whitespace-nowrap"
          >
            Sort by:
          </label>
          <select
            id="sort"
            value={currentSort}
            onChange={handleSortChange}
            className="text-sm border-none bg-slate-50 rounded-md py-1.5 pl-3 pr-8 focus:ring-0 cursor-pointer font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A-Z</option>
          </select>
        </div>

        {/* View Toggles (Visual only for now, functionality can be added if needed) */}
        {/* 
        <div className="flex bg-slate-100 rounded-md p-1 gap-1">
          <button className="p-1.5 bg-white rounded shadow-sm text-primary">
            <LayoutGrid size={18} />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600">
            <List size={18} />
          </button>
        </div> 
        */}
      </div>
    </div>
  );
};

export default ShopHeader;
