"use client";
import React, { useEffect, useState } from "react";
import { getProducts } from "@/api/product";
import ProductCard from "@/components/product-card";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const RefurbishedSpotlight = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRefurbished = async () => {
      try {
        const res = await getProducts({ inventoryType: "Unique", limit: 8 });
        setProducts(res.data.data.products || []);
      } catch (error) {
        console.error("Failed to fetch refurbished products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRefurbished();
  }, []);

  if (loading) {
    return (
      <div className="py-16 bg-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-4">
            <div>
              <div className="h-4 w-32 bg-blue-100 animate-pulse rounded mb-2"></div>
              <div className="h-8 w-64 bg-slate-200 animate-pulse rounded mb-2"></div>
              <div className="h-4 w-96 bg-slate-200 animate-pulse rounded"></div>
            </div>
            <div className="h-6 w-40 bg-blue-100 animate-pulse rounded"></div>
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
    <div className="py-16 bg-blue-50/50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2 block">
              Sustainability
            </span>
            <h2 className="text-3xl font-bold text-slate-900">
              Refurbished Spotlight
            </h2>
            <p className="text-slate-500 mt-2 max-w-xl">
              Good as new. Better for the planet. Verified by our experts with
              1-year warranty.
            </p>
          </div>
          <Link
            href="/shop?condition=Refurbished"
            className="group flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            Shop all Refurbished
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="!pb-12 !px-1"
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

export default RefurbishedSpotlight;
