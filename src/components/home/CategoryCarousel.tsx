"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { getCategories } from "@/api/category";
import { LayoutGrid } from "lucide-react";
import { Category } from "@/types";

const CategoryCarousel: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        const topLevel: Category[] = res.data.data || [];
        const featured = topLevel.filter((c: any) => c.isFeatured);
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
