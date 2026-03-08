"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";

const banners = [
  {
    id: 1,
    title: "iPhone 15 Pro",
    subtitle: "Titanium. So strong. So light. So Pro.",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop",
    ctaText: "Shop New",
    link: "/shop?category=smartphones",
    color: "bg-navy-900 text-white",
  },
  {
    id: 2,
    title: "Premium Refurbished",
    subtitle: "Like new, but better for your wallet. 32-point inspection.",
    image:
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=1200&auto=format&fit=crop",
    ctaText: "Shop Refurbished",
    link: "/shop?condition=refurbished",
    color: "bg-surface-page text-navy-900",
  },
  {
    id: 3,
    title: "MacBook Air M3",
    subtitle: "Lean. Mean. M3 machine.",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
    ctaText: "Explore Laptops",
    link: "/shop?category=laptops",
    color: "bg-navy-800 text-white",
  },
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  return (
    <section className="relative w-full overflow-hidden bg-navy-900 group">
      {/* Aspect ratio container: taller on mobile, wider on desktop */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[2/1] lg:aspect-[2.5/1] max-h-[600px]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover object-center"
                priority={index === 0}
              />
              {/* Gradient Overlay for text readability */}
              <div
                className={`absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 md:from-black/70 to-transparent`}
              />
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 flex items-end md:items-center pb-12 md:pb-0">
              <div className="w-full max-w-[var(--container-max-width)] mx-auto px-6 md:px-12">
                <div className="max-w-xl text-white animate-in slide-in-from-bottom-8 duration-700 fade-in delay-100 fill-mode-both">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 md:mb-4 leading-tight">
                    {banner.title}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 md:mb-8 max-w-sm md:max-w-md">
                    {banner.subtitle}
                  </p>
                  <Link href={banner.link} passHref>
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto shadow-lg shadow-blue-500/20"
                    >
                      {banner.ctaText}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows (Desktop only, visible on hover) */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md items-center justify-center text-white z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md items-center justify-center text-white z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-6 bg-blue-500"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
