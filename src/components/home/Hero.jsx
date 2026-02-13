"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

// Animation styles in global css or tailwind config would be ideal,
// but using inline styles/utility classes for now.

const Hero = () => {
  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2001&auto=format&fit=crop",
      title: "Next-Gen Electronics",
      subtitle: "Upgrade your lifestyle with the latest tech innovations.",
      accent: "Premium Collection",
      link: "/shop?type=new", // Updated link
      color: "from-blue-600 to-violet-600",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1932&auto=format&fit=crop",
      title: "Certified Refurbished",
      subtitle: "Premium quality, sustainable choice. Save up to 40%.",
      accent: "Eco-Friendly Choice",
      link: "/shop?type=used", // Updated link
      color: "from-emerald-600 to-teal-600",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1780&auto=format&fit=crop",
      title: "Smart Accessories",
      subtitle: "Enhance your experience with essential add-ons.",
      accent: "Trending Now",
      link: "/shop?category=accessories&type=new", // Assumed accessories are usually new
      color: "from-orange-600 to-red-600",
    },
  ];

  return (
    <div className="relative group w-full h-[600px] lg:h-[700px] overflow-hidden bg-gray-900">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        speed={1000}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: ".hero-next",
          prevEl: ".hero-prev",
        }}
        pagination={{
          clickable: true,
          el: ".hero-pagination",
          bulletClass:
            "w-3 h-3 bg-white/30 rounded-full cursor-pointer transition-all duration-300 mx-1 hover:bg-white/80",
          bulletActiveClass: "!bg-white !w-8",
        }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] scale-100 hover:scale-105"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              </div>

              {/* Content Container */}
              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start">
                <div
                  className="max-w-2xl text-white space-y-6 opacity-0 animate-fade-in-up"
                  style={{
                    animationDelay: "0.3s",
                    animationFillMode: "forwards",
                  }}
                >
                  {/* Badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${slide.color} backdrop-blur-md border border-white/10 shadow-lg`}
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    <span className="text-sm font-bold tracking-wide uppercase">
                      {slide.accent}
                    </span>
                  </div>

                  {/* Main Title */}
                  <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-xl">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xl md:text-2xl text-gray-200 font-light max-w-lg leading-relaxed drop-shadow-md">
                    {slide.subtitle}
                  </p>

                  {/* CTA Button */}
                  <div className="pt-6">
                    <Link
                      href={slide.link}
                      className="group/btn relative inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg overflow-hidden transition-all duration-300 hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    >
                      <span className="relative z-10">Shop Now</span>
                      <div className="relative z-10 p-1.5 bg-gray-900 rounded-full text-white transition-transform duration-300 group-hover/btn:translate-x-1">
                        <ArrowRight size={18} />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div className="absolute bottom-8 right-8 z-20 flex items-center gap-4 hidden md:flex">
          <button className="hero-prev w-12 h-12 flex items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300 group">
            <ChevronRight size={24} className="rotate-180" />
          </button>
          <button className="hero-next w-12 h-12 flex items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300 group">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Custom Pagination */}
        <div className="hero-pagination absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex md:left-8 md:translate-x-0"></div>
      </Swiper>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent dark:from-slate-900 z-10 pointer-events-none"></div>
    </div>
  );
};

export default Hero;
