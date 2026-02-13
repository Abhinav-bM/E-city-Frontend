"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Package, RefreshCcw, ChevronDown } from "lucide-react";

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
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-card/50 backdrop-blur-sm p-5 rounded-xl border border-border/40 shadow-lg"
      style={{ animation: "slideUp 0.4s ease-out" }}
    >
      {/* Left Section: Product Count */}
      <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-muted-foreground uppercase tracking-wide">
            Showing
          </span>
          <span className="text-2xl font-bold text-foreground">
            {totalProducts}
          </span>
          <span className="text-sm text-muted-foreground uppercase tracking-wide">
            Results
          </span>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={onFilterClick}
          className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-semibold text-sm transition-all duration-200 border border-primary/20"
        >
          <Filter size={16} />
          <span>Filters</span>
        </button>
      </div>

      {/* Center Section: Type Toggle */}
      <div className="flex items-center gap-2 bg-muted rounded-full p-1.5 w-full sm:w-auto">
        <button
          onClick={() => handleTypeChange("new")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            currentType === "new"
              ? "bg-primary text-white shadow-lg shadow-primary/40 scale-105"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Package size={16} />
          <span className="hidden sm:inline">New</span>
        </button>
        <button
          onClick={() => handleTypeChange("used")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            currentType === "used"
              ? "bg-success text-white shadow-lg shadow-success/40 scale-105"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <RefreshCcw size={16} />
          <span className="hidden sm:inline">Used</span>
        </button>
      </div>

      {/* Right Section: Sort Dropdown */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <label
          htmlFor="sort"
          className="text-sm font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
        >
          Sort by
        </label>
        <div className="relative flex-1 sm:flex-none">
          <select
            id="sort"
            value={currentSort}
            onChange={handleSortChange}
            className="appearance-none w-full sm:w-auto text-sm bg-muted border border-border rounded-lg py-2.5 pl-3 pr-8 cursor-pointer font-medium text-foreground hover:border-primary/40 focus:outline-none focus:border-primary transition-all duration-200"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A-Z</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
