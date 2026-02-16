"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { getCategories } from "@/api/category";
import Slider from "@/components/ui/Slider";

// Redux
import { useAppSelector } from "@/store";
import { selectProduct } from "@/store/productSlice";

const FilterSidebar = ({ className = "" }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { facets } = useAppSelector(selectProduct);

  const [categories, setCategories] = useState([]);

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

  // Color Mapping Helper
  const colorMap = {
    black: "#000000",
    white: "#FFFFFF",
    red: "#EF4444",
    blue: "#3B82F6",
    green: "#22C55E",
    yellow: "#EAB308",
    purple: "#A855F7",
    pink: "#EC4899",
    orange: "#F97316",
    gray: "#6B7280",
    grey: "#6B7280",
    silver: "#E5E7EB",
    gold: "#FFD700",
    midnight: "#191970",
    starlight: "#F8F9EC",
    "space gray": "#4B4B4B",
    porcelain: "#F0EFEF",
    obsidian: "#1A1A1A",
    titanium: "#878681",
    natural: "#D4C5B3",
  };
  const getColor = (name) => {
    const k = name.toLowerCase().trim();
    return colorMap[k] || (name.startsWith("#") ? name : null);
  };

  return (
    <div
      className={`w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto ${className}`}
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <h2 className="font-bold text-lg text-gray-900">Filters</h2>
        {(selectedBrands.length > 0 ||
          selectedConditions.length > 0 ||
          Object.keys(selectedAttributes).length > 0 ||
          searchParams.get("minPrice")) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-semibold uppercase tracking-wider transition-colors duration-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full"
          >
            <span>Reset</span>
            <X size={12} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="border-b border-gray-100 py-5 first:pt-0">
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

        const isColor = key.toLowerCase() === "color";
        const isOpen = expandedSections[key] !== false;

        let displayValues = values;
        let isFamilyMode = false;

        const FAMILY_MAP = {
          Black: [
            "Black",
            "Obsidian",
            "Midnight",
            "Charcoal",
            "Graphite",
            "Ink",
            "Space Black",
            "Phantom Black",
          ],
          White: [
            "White",
            "Porcelain",
            "Snow",
            "Chalk",
            "Starlight",
            "Cream",
            "Pearl",
            "Ceramic",
            "Cotton",
          ],
          Grey: [
            "Gray",
            "Grey",
            "Space Gray",
            "Space Grey",
            "Titanium",
            "Natural",
            "Silver",
            "Platinum",
            "Hazel",
            "Ash",
          ],
          Blue: [
            "Blue",
            "Sierra Blue",
            "Sky Blue",
            "Navy",
            "Pacific Blue",
            "Alpine Blue",
            "Bay",
            "Azure",
            "Cobalt",
          ],
          Green: [
            "Green",
            "Midnight Green",
            "Alpine Green",
            "Hazel",
            "Lemongrass",
            "Mint",
            "Olive",
            "Sage",
            "Emerald",
          ],
          Red: ["Red", "Product Red", "Coral", "Rose", "Burgundy", "Crimson"],
          Gold: ["Gold", "Rose Gold", "Champagne", "Sunset"],
          Purple: [
            "Purple",
            "Deep Purple",
            "Lilac",
            "Lavender",
            "Violet",
            "Iris",
            "Plum",
          ],
          Yellow: ["Yellow", "Canary", "Lemongrass"],
          Orange: ["Orange", "Amber"],
          Brown: ["Brown", "Leather", "Tan", "Bronze"],
        };

        if (isColor) {
          isFamilyMode = true;
          const availableFamilies = new Set();
          values.forEach((val) => {
            let foundFamily = false;
            for (const [family, members] of Object.entries(FAMILY_MAP)) {
              if (
                members.map((m) => m.toLowerCase()).includes(val.toLowerCase())
              ) {
                availableFamilies.add(family);
                foundFamily = true;
                break;
              }
            }
            if (!foundFamily) {
              availableFamilies.add(val.charAt(0).toUpperCase() + val.slice(1));
            }
          });
          displayValues = Array.from(availableFamilies).sort();
        }

        return (
          <div key={key} className="border-b border-gray-100 py-5">
            <button
              className="flex items-center justify-between w-full mb-3 group"
              onClick={() => toggleSection("key")}
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
              <div
                className={`${
                  isColor ? "flex flex-wrap gap-2.5" : "space-y-2"
                }`}
              >
                {displayValues.map((val) => {
                  let isSelected = false;

                  if (isColor && isFamilyMode) {
                    const currentUrlValues = selectedAttributes[key] || [];
                    const familyMembers = FAMILY_MAP[val] || [val];
                    isSelected = familyMembers.some((member) =>
                      currentUrlValues
                        .map((v) => v.toLowerCase())
                        .includes(member.toLowerCase()),
                    );
                  } else {
                    isSelected = (selectedAttributes[key] || []).includes(val);
                  }

                  if (isColor) {
                    return (
                      <button
                        key={val}
                        onClick={() => {
                          if (isFamilyMode) {
                            const familyMembers = FAMILY_MAP[val] || [val];
                            const currentFilters =
                              selectedAttributes[key] || [];
                            let newFilters;
                            if (isSelected) {
                              newFilters = currentFilters.filter(
                                (f) =>
                                  !familyMembers
                                    .map((m) => m.toLowerCase())
                                    .includes(f.toLowerCase()),
                              );
                            } else {
                              const toAdd = familyMembers.filter(
                                (m) => !currentFilters.includes(m),
                              );
                              newFilters = [...currentFilters, ...toAdd];
                            }
                            updateFilters({ [key]: newFilters.join(",") });
                          } else {
                            toggleAttribute(key, val);
                          }
                        }}
                        className={`group relative w-9 h-9 rounded-full border transition-all duration-200 flex items-center justify-center ${
                          isSelected
                            ? "ring-2 ring-gray-900 ring-offset-2 border-transparent scale-110"
                            : "border-gray-200 hover:border-gray-400 hover:scale-105"
                        }`}
                        title={val}
                        style={{
                          backgroundColor:
                            val.toLowerCase() === "white"
                              ? "#ffffff"
                              : val.toLowerCase(),
                        }}
                      >
                        {/* Checkmark for selected state */}
                        {isSelected && (
                          <div className="bg-white/20 backdrop-blur-[1px] rounded-full p-0.5">
                            <Check
                              size={14}
                              className={`${
                                val.toLowerCase() === "white"
                                  ? "text-black"
                                  : "text-white"
                              } drop-shadow-md`}
                              strokeWidth={3}
                            />
                          </div>
                        )}
                        {/* Tooltip */}
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {val}
                        </span>
                      </button>
                    );
                  }

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
  );
};

export default FilterSidebar;
