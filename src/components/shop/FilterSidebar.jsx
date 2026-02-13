"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
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
    // Dynamic sections will be added here
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
      className={`w-full bg-card/50 backdrop-blur-sm border border-border/40 rounded-xl p-6 sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto ${className}`}
      style={{ animation: "slideInLeft 0.4s ease-out" }}
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/30">
        <h2 className="font-bold text-lg text-foreground">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-xs text-destructive hover:text-destructive/80 font-semibold uppercase tracking-wider transition-colors duration-200"
        >
          Clear
        </button>
      </div>

      {/* Categories */}
      <div className="border-b border-border/30 py-4 first:pt-0">
        <button
          className="flex items-center justify-between w-full mb-3 group hover:text-primary transition-colors duration-200"
          onClick={() => toggleSection("category")}
        >
          <span className="font-semibold text-foreground text-sm">
            Categories
          </span>
          <div className="transition-transform duration-300">
            {expandedSections.category ? (
              <ChevronUp
                size={18}
                className="text-muted-foreground group-hover:text-primary"
              />
            ) : (
              <ChevronDown
                size={18}
                className="text-muted-foreground group-hover:text-primary"
              />
            )}
          </div>
        </button>
        {expandedSections.category && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => updateFilters({ category: cat._id })}
                className={`block text-sm text-left w-full py-1.5 px-2 rounded-md transition-all duration-200 ${
                  searchParams.get("category") === cat._id
                    ? "bg-primary/10 text-primary font-medium border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-border/30 py-4">
        <button
          className="flex items-center justify-between w-full mb-3 group hover:text-primary transition-colors duration-200"
          onClick={() => toggleSection("price")}
        >
          <span className="font-semibold text-foreground text-sm">
            Price Range
          </span>
          <div className="transition-transform duration-300">
            {expandedSections.price ? (
              <ChevronUp
                size={18}
                className="text-muted-foreground group-hover:text-primary"
              />
            ) : (
              <ChevronDown
                size={18}
                className="text-muted-foreground group-hover:text-primary"
              />
            )}
          </div>
        </button>
        {expandedSections.price && (
          <div className="space-y-5 px-1 mt-4">
            <Slider
              min={minPrice}
              max={maxPrice}
              value={priceRange}
              onChange={handlePriceChange}
              className="accent-primary"
            />
            <div className="flex items-center justify-between text-sm font-semibold text-foreground">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground uppercase">
                  From
                </span>
                <span className="text-lg">
                  ₹{priceRange[0].toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground uppercase">
                  To
                </span>
                <span className="text-lg">
                  ₹{priceRange[1].toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            <button
              onClick={applyPriceFilter}
              className="w-full bg-primary text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-primary/90 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-primary/40"
            >
              Apply Filter
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
          <div key={key} className="border-b border-border/30 py-4">
            <button
              className="flex items-center justify-between w-full mb-3 group hover:text-primary transition-colors duration-200"
              onClick={() => toggleSection(key)}
            >
              <span className="font-semibold text-foreground text-sm">
                {key}
              </span>
              <div className="transition-transform duration-300">
                {isOpen ? (
                  <ChevronUp
                    size={18}
                    className="text-muted-foreground group-hover:text-primary"
                  />
                ) : (
                  <ChevronDown
                    size={18}
                    className="text-muted-foreground group-hover:text-primary"
                  />
                )}
              </div>
            </button>

            {isOpen && (
              <div
                className={`${isColor ? "flex flex-wrap gap-2" : "space-y-2 max-h-48 overflow-y-auto"}`}
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
                        className={`group relative w-8 h-8 rounded-full border transition-all duration-200 flex items-center justify-center ${
                          isSelected
                            ? "ring-2 ring-primary ring-offset-2 border-transparent"
                            : "border-border hover:border-primary/50 hover:scale-110"
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
                          <Check
                            size={14}
                            className={`${
                              val.toLowerCase() === "white"
                                ? "text-black"
                                : "text-white"
                            }`}
                            strokeWidth={3}
                          />
                        )}
                        {/* Tooltip-like label on hover */}
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-border">
                          {val}
                        </span>
                      </button>
                    );
                  }

                  return (
                    <label
                      key={val}
                      className="flex items-center space-x-2 cursor-pointer w-full group py-1.5 px-2 rounded-lg hover:bg-muted/40 transition-colors duration-200"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleAttribute(key, val)}
                        className="rounded border-border text-primary accent-primary h-4 w-4 cursor-pointer"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
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
      <div className="py-4">
        <button
          className="flex items-center justify-between w-full mb-3 group hover:text-primary transition-colors duration-200"
          onClick={() => toggleSection("brand")}
        >
          <span className="font-semibold text-foreground text-sm">Brands</span>
          <div className="transition-transform duration-300">
            {expandedSections.brand ? (
              <ChevronUp
                size={18}
                className="text-muted-foreground group-hover:text-primary"
              />
            ) : (
              <ChevronDown
                size={18}
                className="text-muted-foreground group-hover:text-primary"
              />
            )}
          </div>
        </button>
        {expandedSections.brand && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center space-x-2 cursor-pointer w-full group py-1.5 px-2 rounded-lg hover:bg-muted/40 transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="rounded border-border text-primary accent-primary h-4 w-4 cursor-pointer"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
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
