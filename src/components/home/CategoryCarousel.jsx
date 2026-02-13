"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { getCategories } from "@/api/category";
import { LayoutGrid } from "lucide-react";

const CategoryCarousel = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        // Filter for featured categories if needed, or just show all/top level
        // For now, let's assume we want to show Featured ones if available, or just all top-level
        // The backend `getCategories` returns a tree.
        // If we want "Featured", we might need to filter manually or update backend to return flat list if requested.
        // The backend `buildCategoryTree` returns a tree. The top level items are the roots.
        // Let's iterate through the tree or finding featured ones.
        // Actually, the backend `getCategories` sends the tree.
        // If `isFeatured` is on the category object, we can filter.
        // But since it's a tree, we need to traverse or just show top level.
        // Let's assume we show Top Level categories that are either Featured or just Top Level.

        // Let's flatten the tree to find all Featured categories if that's the requirement,
        // OR just show top-level categories as "Shop by Category".

        // Let's try to show Top Level Categories first.
        const topLevel = res.data.data || [];
        // Optional: Filter by isFeatured if we want only specific ones
        const featured = topLevel.filter((c) => c.isFeatured);
        setCategories(featured.length > 0 ? featured : topLevel);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-white border-b border-slate-100 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between gap-4 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 min-w-[80px]"
              >
                <div className="w-12 h-12 rounded-lg bg-slate-100 animate-pulse"></div>
                <div className="h-3 w-16 bg-slate-100 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (categories.length === 0) return null;

  return (
    <div className="w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <Swiper
          modules={[Navigation]}
          spaceBetween={40}
          slidesPerView="auto"
          centerInsufficientSlides={true}
          className="category-swiper !px-1"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat._id} className="!w-auto">
              <Link
                href={`/shop?category=${cat._id}`}
                className="group flex flex-col items-center gap-2 min-w-[70px] cursor-pointer"
              >
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-50 flex items-center justify-center p-2 group-hover:bg-blue-50 transition-colors border border-slate-100 group-hover:border-blue-200">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  ) : (
                    <LayoutGrid
                      size={24}
                      className="text-slate-400 group-hover:text-blue-600 transition-colors"
                    />
                  )}
                </div>
                <span className="text-[10px] md:text-xs font-semibold text-slate-600 uppercase tracking-wide group-hover:text-blue-600 text-center whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CategoryCarousel;
