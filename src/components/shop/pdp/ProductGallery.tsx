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
        <div className="absolute top-6 left-6 z-10 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg shadow-black/5 border border-white/50 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.1em]">
            Actual Photos
          </span>
        </div>
      )}

      {/* Main Slider */}
      <div className="relative group bg-white rounded-2xl overflow-hidden border border-slate-50 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-100">
        <Swiper
          spaceBetween={10}
          navigation={true}
          pagination={{ clickable: true }}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[Pagination, Navigation, Thumbs]}
          className="w-full aspect-square md:aspect-[4/3] lg:aspect-square"
        >
          {validImages.map((img, index) => (
            <SwiperSlide
              key={index}
              className="bg-white flex items-center justify-center p-8"
            >
              <div className="relative w-full h-full">
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

      {/* Thumbnails (Desktop Only usually, but good for all) */}
      <div className="hidden md:block">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={5}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[Thumbs]}
          className="thumbs-gallery"
        >
          {validImages.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="cursor-pointer border border-slate-100 hover:border-slate-900 rounded-lg overflow-hidden transition-all aspect-square bg-white p-3">
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
    </div>
  );
};

export default ProductGallery;
