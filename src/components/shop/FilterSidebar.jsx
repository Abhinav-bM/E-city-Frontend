"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { getCategories } from "@/api/category";
import Slider from "@/components/ui/Slider";

// I'll stick to simple inputs for Price to avoid missing dependencies for now.

import { useAppSelector } from "@/store";
import { selectProduct } from "@/store/productSlice";

const FilterSidebar = ({ className = "" }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { facets } = useAppSelector(selectProduct);

  const [categories, setCategories] = useState([]);
  // Price range state: [min, max]
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);

  // Collapsible states
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isConditionOpen, setIsConditionOpen] = useState(true);

  // Use dynamic facets if available, else fallback (though facets should load with products)
  const brands = facets?.brands?.length > 0 ? facets.brands : [];
  const conditions =
    facets?.conditions?.length > 0
      ? facets.conditions
      : ["New", "Refurbished", "Open Box"];
  const minPrice = facets?.minPrice !== undefined ? facets.minPrice : 0;
  const maxPrice = facets?.maxPrice !== undefined ? facets.maxPrice : 5000;

  useEffect(() => {
    // initialize price range from URL or Facets when facets load
    // If URL has params, use them. Else use facet limits.
    const urlMin = searchParams.get("minPrice");
    const urlMax = searchParams.get("maxPrice");

    if (urlMin || urlMax) {
      setPriceRange([Number(urlMin) || minPrice, Number(urlMax) || maxPrice]);
    } else if (facets.maxPrice > 0) {
      // Only update if facets are loaded and no URL override
      setPriceRange([minPrice, maxPrice]);
    }
  }, [searchParams, facets, minPrice, maxPrice]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCats();
  }, []);

  // Sync state with URL params on mount/update
  useEffect(() => {
    const brandsParam = searchParams.get("brand");
    setSelectedBrands(brandsParam ? brandsParam.split(",") : []);

    const conditionParam = searchParams.get("condition");
    setSelectedConditions(conditionParam ? conditionParam.split(",") : []);
  }, [searchParams]);

  const updateFilters = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());

    // Merge new params
    Object.keys(newParams).forEach((key) => {
      if (newParams[key]) {
        params.set(key, newParams[key]);
      } else {
        params.delete(key);
      }
    });

    // Reset page to 1 on filter change
    params.set("page", "1");

    router.push(`/shop?${params.toString()}`);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const applyPriceFilter = () => {
    updateFilters({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  const toggleBrand = (brand) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];

    setSelectedBrands(newBrands);
    updateFilters({ brand: newBrands.join(",") });
  };

  const toggleCondition = (condition) => {
    const newConditions = selectedConditions.includes(condition)
      ? selectedConditions.filter((c) => c !== condition)
      : [...selectedConditions, condition];

    setSelectedConditions(newConditions);
    updateFilters({ condition: newConditions.join(",") });
  };

  const clearFilters = () => {
    router.push("/shop");
  };

  return (
    <div
      className={`w-full bg-white border border-slate-200 rounded-lg p-5 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg text-slate-900">Filters</h2>
        {(selectedBrands.length > 0 ||
          selectedConditions.length > 0 ||
          priceRange[0] > 0 ||
          priceRange[1] < 5000 ||
          searchParams.get("category")) && (
          <button
            onClick={clearFilters}
            className="text-xs text-red-500 hover:text-red-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="border-b border-slate-100 py-4">
        <button
          className="flex items-center justify-between w-full mb-3 group"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        >
          <span className="font-semibold text-slate-800 text-sm">
            Categories
          </span>
          {isCategoryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {isCategoryOpen && (
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => updateFilters({ category: cat._id })}
                className={`block text-sm text-left w-full hover:text-primary transition-colors ${
                  searchParams.get("category") === cat._id
                    ? "text-primary font-medium"
                    : "text-slate-600"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-slate-100 py-4">
        <button
          className="flex items-center justify-between w-full mb-3"
          onClick={() => setIsPriceOpen(!isPriceOpen)}
        >
          <span className="font-semibold text-slate-800 text-sm">
            Price ($)
          </span>
          {isPriceOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {isPriceOpen && (
          <div className="space-y-5 px-1">
            <Slider
              min={minPrice}
              max={maxPrice}
              value={priceRange}
              onChange={handlePriceChange}
            />

            <div className="flex items-center justify-between text-sm text-slate-600 font-medium">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={applyPriceFilter}
                className="col-span-2 w-full bg-slate-900 text-white text-xs font-semibold py-2 rounded hover:bg-slate-800 transition-colors"
              >
                Apply Price
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Condition */}
      <div className="border-b border-slate-100 py-4">
        <button
          className="flex items-center justify-between w-full mb-3"
          onClick={() => setIsConditionOpen(!isConditionOpen)}
        >
          <span className="font-semibold text-slate-800 text-sm">
            Condition
          </span>
          {isConditionOpen ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>
        {isConditionOpen && (
          <div className="space-y-2">
            {conditions.map((cond) => (
              <label
                key={cond}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedConditions.includes(cond)}
                  onChange={() => toggleCondition(cond)}
                  className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-slate-600 text-sm">{cond}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="py-4">
        <button
          className="flex items-center justify-between w-full mb-3"
          onClick={() => setIsBrandOpen(!isBrandOpen)}
        >
          <span className="font-semibold text-slate-800 text-sm">Brands</span>
          {isBrandOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {isBrandOpen && (
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-slate-600 text-sm">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
