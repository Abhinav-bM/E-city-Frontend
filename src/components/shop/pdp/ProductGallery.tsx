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
      <div className="relative group bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)] overflow-hidden transition-all">
        <Swiper
          spaceBetween={10}
          navigation={true}
          pagination={{ clickable: true }}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[Pagination, Navigation, Thumbs]}
          className="w-full aspect-[4/3] md:aspect-square product-gallery-swiper"
        >
          {validImages.map((img, index) => (
            <SwiperSlide
              key={index}
              className="flex items-center justify-center p-8 bg-white"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={img}
                  alt={`Product View ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnails */}
      <div className="hidden md:block mt-2">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={12}
          slidesPerView={6}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[Thumbs]}
          className="thumbs-gallery px-1 py-2"
        >
          {validImages.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="cursor-pointer border-2 border-transparent ui-selected:border-slate-900 hover:border-slate-300 rounded-xl overflow-hidden transition-all aspect-square bg-white shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] my-2 p-2">
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
          color: #0f172a; /* Custom Slate-900 */
          background-color: transparent;
          width: 32px;
          height: 32px;
          transition: all 0.2s ease;
        }

        .product-gallery-swiper .swiper-button-next:hover,
        .product-gallery-swiper .swiper-button-prev:hover {
          transform: scale(1.1);
          color: #000000;
        }

        .product-gallery-swiper .swiper-button-next:after,
        .product-gallery-swiper .swiper-button-prev:after {
          font-size: 12px;
          font-weight: 800;
        }

        .product-gallery-swiper .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: #cbd5e1;
          opacity: 1;
          transition: all 0.3s ease;
        }

        .product-gallery-swiper .swiper-pagination-bullet-active {
          background: #0f172a;
          width: 20px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default ProductGallery;
