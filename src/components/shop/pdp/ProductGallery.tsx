"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface ProductGalleryProps {
  images: string[];
  isRefurbished?: boolean;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  isRefurbished = false,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const validImages =
    images?.filter((img) => typeof img === "string" && img.trim() !== "") || [];

  if (validImages.length === 0) {
    return (
      <div className="w-full aspect-square bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
        No Image Available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Badge for Refurbished/Used Items - Minimalist */}
      {isRefurbished && (
        <div className="absolute top-5 left-5 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-200/60 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.15em]">
            Actual Photos
          </span>
        </div>
      )}

      {/* Main Slider */}
      <div className="relative group bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300">
        <Swiper
          spaceBetween={0}
          navigation={true}
          pagination={{ clickable: true }}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          modules={[Pagination, Navigation, Thumbs]}
          className="w-full aspect-square product-gallery-swiper"
        >
          {validImages.map((img, index) => (
            <SwiperSlide
              key={index}
              className="flex items-center justify-center bg-white"
            >
              <div className="relative w-full h-full p-8 md:p-12 flex items-center justify-center">
                <Image
                  src={img}
                  alt={`Product View ${index + 1}`}
                  fill
                  className="object-contain hover:scale-105 transition-transform duration-500 ease-out"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnails */}
      <div className="hidden lg:block mt-3 px-1">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={16}
          slidesPerView={5}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[Thumbs]}
          className="thumbs-gallery py-2"
        >
          {validImages.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="thumb-wrapper cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 aspect-square bg-white border-2 border-transparent hover:border-slate-300/[0.8] p-2 flex items-center justify-center relative shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                <div className="relative w-full h-full">
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Global Swiper Overrides */}
      <style jsx global>{`
        .product-gallery-swiper .swiper-button-next,
        .product-gallery-swiper .swiper-button-prev {
          color: #0f172a;
          background-color: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
        }

        .product-gallery-swiper:hover .swiper-button-next,
        .product-gallery-swiper:hover .swiper-button-prev {
          opacity: 1;
        }

        .product-gallery-swiper .swiper-button-next:hover,
        .product-gallery-swiper .swiper-button-prev:hover {
          transform: scale(1.05);
          color: #000000;
          background-color: #ffffff;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          border-color: #cbd5e1;
        }

        .product-gallery-swiper .swiper-button-next:after,
        .product-gallery-swiper .swiper-button-prev:after {
          font-size: 14px;
          font-weight: 800;
        }

        .product-gallery-swiper .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: #cbd5e1;
          opacity: 1;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .product-gallery-swiper .swiper-pagination-bullet-active {
          background: #0f172a;
          width: 24px;
          border-radius: 12px;
        }

        /* Active Thumbnail Styling */
        .thumbs-gallery .swiper-slide-thumb-active .thumb-wrapper {
          border-color: #0f172a;
          box-shadow: 0 8px 30px rgb(0, 0, 0, 0.08);
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default ProductGallery;
