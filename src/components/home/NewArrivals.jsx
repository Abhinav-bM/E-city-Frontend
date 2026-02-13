"use client";
import React, { useEffect, useState } from "react";
import { getProducts } from "@/api/product";
import ProductCard from "@/components/product-card";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await getProducts({
          isNewArrival: true,
          limit: 12,
          inStockOnly: true,
        });
        setProducts(res.data.data.products || []);
      } catch (error) {
        console.error("Failed to fetch new arrivals", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="h-8 w-48 bg-slate-200 animate-pulse rounded mb-2"></div>
              <div className="h-4 w-64 bg-slate-200 animate-pulse rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
              <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-slate-100 h-[400px] flex flex-col"
              >
                <div className="w-full aspect-square bg-slate-200 animate-pulse rounded-xl mb-4"></div>
                <div className="h-4 w-20 bg-slate-200 animate-pulse rounded mb-2"></div>
                <div className="h-6 w-full bg-slate-200 animate-pulse rounded mb-2"></div>
                <div className="h-6 w-3/4 bg-slate-200 animate-pulse rounded mb-4"></div>
                <div className="mt-auto flex justify-between items-end">
                  <div className="h-6 w-24 bg-slate-200 animate-pulse rounded"></div>
                  <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (products.length === 0) return null;

  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              New Arrivals
            </h2>
            <p className="text-slate-500 mt-2">
              Check out the latest gadgets in stock
            </p>
          </div>
          <div className="flex gap-2">
            {/* Custom Navigation Buttons (linked via classNames in Swiper) */}
            <button className="new-prev w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white hover:shadow-md transition-all text-slate-600">
              <ChevronLeft size={20} />
            </button>
            <button className="new-next w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white hover:shadow-md transition-all text-slate-600">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            nextEl: ".new-next",
            prevEl: ".new-prev",
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="!pb-12 !px-1" // minimal padding for shadow
        >
          {products.map((product) => (
            <SwiperSlide key={product._id} className="h-auto">
              <ProductCard
                product={product}
                onAddToCart={() => console.log("Add to cart", product._id)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default NewArrivals;
