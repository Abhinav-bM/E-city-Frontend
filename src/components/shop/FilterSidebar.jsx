"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { getCategories } from "@/api/category";
import Slider from "@/components/ui/Slider";

// Redux
import { useAppSelector } from "@/store";
import { selectProduct } from "@/store/productSlice";

const FilterSidebar = ({
  className = "",
  hideHeader = false,
  categories = [],
}) => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const { facets } = useAppSelector(selectProduct);



  // State for filter values
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  // Dynamic Attributes State: { Color: ["Red", "Blue"], RAM: ["8GB"] }
  const [selectedAttributes, setSelectedAttributes] = useState({});

  // Collapsible states
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    condition: true,
    brand: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Derive data from facets
  const brands = facets?.brands?.length > 0 ? facets.brands : [];
  const attributes = facets?.attributes || {}; // { Color: [...], Storage: [...] }

  const minPrice = facets?.minPrice !== undefined ? facets.minPrice : 0;
  const maxPrice = facets?.maxPrice !== undefined ? facets.maxPrice : 5000;

  // Sync state with URL
  useEffect(() => {
    // Price
    const urlMin = searchParams.get("minPrice");
    const urlMax = searchParams.get("maxPrice");
    if (urlMin || urlMax) {
      setPriceRange([Number(urlMin) || minPrice, Number(urlMax) || maxPrice]);
    } else if (facets.maxPrice > 0) {
      setPriceRange([minPrice, maxPrice]);
    }

    // Brands
    const brandsParam = searchParams.get("brand");
    setSelectedBrands(brandsParam ? brandsParam.split(",") : []);

    // Conditions
    const conditionParam = searchParams.get("condition");
    setSelectedConditions(conditionParam ? conditionParam.split(",") : []);

    // Dynamic Attributes
    const newSelectedAttributes = {};
    if (attributes) {
      Object.keys(attributes).forEach((key) => {
        const param = searchParams.get(key);
        if (param) {
          newSelectedAttributes[key] = param.split(",");
        }
      });
    }
    setSelectedAttributes(newSelectedAttributes);
  }, [searchParams, facets, minPrice, maxPrice]);


  const updateFilters = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.keys(newParams).forEach((key) => {
      if (newParams[key]) {
        params.set(key, newParams[key]);
      } else {
        params.delete(key);
      }
    });
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  };

  const handlePriceChange = (value) => setPriceRange(value);
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
    updateFilters({ brand: newBrands.join(",") });
  };

  const toggleCondition = (condition) => {
    const newConditions = selectedConditions.includes(condition)
      ? selectedConditions.filter((c) => c !== condition)
      : [...selectedConditions, condition];
    updateFilters({ condition: newConditions.join(",") });
  };

  const toggleAttribute = (key, value) => {
    const currentValues = selectedAttributes[key] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    updateFilters({ [key]: newValues.join(",") });
  };

  const clearFilters = () => {
    const type = searchParams.get("type");
    if (type) router.push(`/shop?type=${type}`);
    else router.push("/shop");
  };

  return (
    <div
      className={`w-full bg-white rounded-2xl shadow-sm flex flex-col sticky top-24 max-h-[calc(100vh-120px)] overflow-hidden ${className}`}
    >
      {/* Fixed Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white z-10 shrink-0">
          <h2 className="font-bold text-base tracking-tight text-slate-900">
            Filters
          </h2>
          {Array.from(searchParams.keys()).filter((key) => key !== "page")
            .length > 0 && (
            <button
              onClick={clearFilters}
              className="text-[11px] text-slate-400 hover:text-slate-700 font-bold uppercase tracking-wider transition-colors duration-200"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6">
        {/* Categories */}
        <div className="border-b border-gray-100 py-5 pt-4">
          <button
            className="flex items-center justify-between w-full mb-3 group"
            onClick={() => toggleSection("category")}
          >
            <span className="font-semibold text-gray-900 text-[15px]">
              Categories
            </span>
            <div
              className={`transition-transform duration-300 ${
                expandedSections.category ? "rotate-180" : ""
              }`}
            >
              <ChevronDown size={18} className="text-gray-400" />
            </div>
          </button>
          {expandedSections.category && (
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateFilters({ category: cat._id })}
                  className={`block text-sm text-left w-full py-2 px-3 rounded-lg transition-all duration-200 truncate ${
                    searchParams.get("category") === cat._id
                      ? "bg-gray-900 text-white font-medium shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 from-gray-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Condition */}
        <div className="border-b border-gray-100 py-5">
          <button
            className="flex items-center justify-between w-full mb-3 group"
            onClick={() => toggleSection("condition")}
          >
            <span className="font-semibold text-gray-900 text-[15px]">
              Condition
            </span>
            <div
              className={`transition-transform duration-300 ${
                expandedSections.condition ? "rotate-180" : ""
              }`}
            >
              <ChevronDown size={18} className="text-gray-400" />
            </div>
          </button>
          {expandedSections.condition && (
            <div className="space-y-1">
              {["New", "Open Box", "Refurbished", "Used"].map((condition) => (
                <label
                  key={condition}
                  className="flex items-center space-x-3 cursor-pointer w-full group py-1.5 px-1 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    checked={selectedConditions.includes(condition)}
                    onChange={() => toggleCondition(condition)}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900/20 h-4 w-4 cursor-pointer"
                  />
                  <span
                    className={`text-sm transition-colors duration-200 ${
                      selectedConditions.includes(condition)
                        ? "text-gray-900 font-medium"
                        : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  >
                    {condition}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="border-b border-gray-100 py-5">
          <button
            className="flex items-center justify-between w-full mb-4 group"
            onClick={() => toggleSection("price")}
          >
            <span className="font-semibold text-gray-900 text-[15px]">
              Price Range
            </span>
            <div
              className={`transition-transform duration-300 ${
                expandedSections.price ? "rotate-180" : ""
              }`}
            >
              <ChevronDown size={18} className="text-gray-400" />
            </div>
          </button>
          {expandedSections.price && (
            <div className="space-y-6 px-1">
              <Slider
                min={minPrice}
                max={maxPrice}
                value={priceRange}
                onChange={handlePriceChange}
                className="accent-gray-900"
              />
              <div className="flex items-center justify-between">
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex flex-col w-[45%]">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    Min
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{priceRange[0].toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-gray-300">-</div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex flex-col w-[45%]">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    Max
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{priceRange[1].toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <button
                onClick={applyPriceFilter}
                className="w-full bg-gray-900 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-md"
              >
                Apply Price
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Attributes */}
        {Object.entries(attributes).map(([key, values]) => {
          if (!values || values.length === 0) return null;
          if (key.toLowerCase() === "color") return null;

          const isOpen = expandedSections[key] !== false;

          return (
            <div key={key} className="border-b border-gray-100 py-5">
              <button
                className="flex items-center justify-between w-full mb-3 group"
                onClick={() => toggleSection(key)}
              >
                <span className="font-semibold text-gray-900 text-[15px]">
                  {key}
                </span>
                <div
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
              </button>

              {isOpen && (
                <div className="space-y-2">
                  {values.map((val) => {
                    const isSelected = (selectedAttributes[key] || []).includes(
                      val,
                    );

                    return (
                      <label
                        key={val}
                        className="flex items-center space-x-3 cursor-pointer w-full group py-1.5 px-1 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleAttribute(key, val)}
                            className="peer h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900/20 focus:ring-offset-0 transition-all cursor-pointer"
                          />
                        </div>
                        <span
                          className={`text-sm transition-colors duration-200 ${
                            isSelected
                              ? "text-gray-900 font-medium"
                              : "text-gray-600 group-hover:text-gray-900"
                          }`}
                        >
                          {val}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Brands */}
        <div className="py-5">
          <button
            className="flex items-center justify-between w-full mb-3 group"
            onClick={() => toggleSection("brand")}
          >
            <span className="font-semibold text-gray-900 text-[15px]">
              Brands
            </span>
            <div
              className={`transition-transform duration-300 ${
                expandedSections.brand ? "rotate-180" : ""
              }`}
            >
              <ChevronDown size={18} className="text-gray-400" />
            </div>
          </button>
          {expandedSections.brand && (
            <div className="space-y-1">
              {brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center space-x-3 cursor-pointer w-full group py-1.5 px-1 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900/20 h-4 w-4 cursor-pointer"
                  />
                  <span
                    className={`text-sm transition-colors duration-200 ${
                      selectedBrands.includes(brand)
                        ? "text-gray-900 font-medium"
                        : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  >
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
