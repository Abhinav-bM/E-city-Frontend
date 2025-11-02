"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

const ProductImageViewer = ({ product }) => {
  return (
    <Swiper
      navigation={true}
      modules={[Navigation, Autoplay]}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      loop={true}
      className=" overflow-hidden max-w-[550px] max-h-[550px] w-full swiper-shop select-none"
    >
      {product.images?.map((image, index) => (
        <SwiperSlide key={index} className="max-w-[550px] max-h-[550px] ">
          <img
            src={image.url}
            alt={product.name}
            className="w-full h-auto  object-contain"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductImageViewer;
