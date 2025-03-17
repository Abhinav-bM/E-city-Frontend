"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";

// SWIPER STYLES
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const MainBanner = () => {
  const BannerImages = [
    {
      imageSrc:
        "https://img.freepik.com/free-photo/girl-showing-good-app-recommend-download-very-useful-application-cute-redhead-woman-yellow-sweate_1258-143241.jpg?t=st=1734373126~exp=1734376726~hmac=ff74dc11e250bf617c647e5280b6947b1b6ecb2c0672a62ba999bf417f6f5711&w=1380",
    },
    {
      imageSrc:
        "https://img.pikbest.com/origin/06/63/98/19qpIkbEsTkzP.jpg!w700wp",
    },
  ];

  return (
    <Swiper
      modules={[Navigation, Pagination, A11y]}
      spaceBetween={10}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
    >
      {BannerImages.map((data, i) => (
        <SwiperSlide key={i}>
          <div className=" relative">
            <picture className=" h-min-screen w-full">
              <img
                className=" h-full w-full object-cover"
                src={data.imageSrc}
                alt=""
              />
            </picture>

            <div className=" absolute right-0 top-80 left-40">
              <button className="px-4 py-3 bg-white w-min text-nowrap text-black rounded-2xl font-semibold hover:text-white hover:bg-blue-700">
                Explore now
              </button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MainBanner;
