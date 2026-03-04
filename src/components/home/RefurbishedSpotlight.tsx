import React from "react";
import ProductCarousel from "@/components/product/ProductCarousel";

// Temporary mock data
const mockRefurbished = [
  {
    id: "rf1",
    title: "Apple iPhone 13 (Mobile) - Used Box",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop",
    price: 38999,
    originalPrice: 59900,
    condition: "grade-a" as const,
    rating: 4.6,
    reviews: 42,
  },
  {
    id: "rf2",
    title: "Samsung Galaxy S22 5G (Green, 8GB/128GB)",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop", // placeholder
    price: 24500,
    originalPrice: 72999,
    condition: "grade-b" as const,
    rating: 4.4,
    reviews: 18,
  },
  {
    id: "rf3",
    title: "MacBook Pro 13-inch M1 (2020) Space Gray",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop", // placeholder
    price: 65900,
    originalPrice: 122900,
    condition: "grade-a" as const,
    rating: 4.9,
    reviews: 104,
  },
  {
    id: "rf4",
    title: "Google Pixel 7 Pro (Obsidian, 128GB)",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351cb315?q=80&w=600&auto=format&fit=crop", // placeholder
    price: 34999,
    originalPrice: 84999,
    condition: "grade-c" as const,
    rating: 4.2,
    reviews: 7,
  },
];

const RefurbishedSpotlight: React.FC = () => {
  return (
    <div className="bg-surface-card mb-2 py-4 relative isolation-isolate overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10" />
      <ProductCarousel
        title="Certified Refurbished Deals"
        subtitle="Up to 60% off. 32-point inspection. 1-Year warranty."
        products={mockRefurbished as any}
        actionLabel="Shop All Refurbished"
        actionHref="/shop?condition=refurbished"
      />
    </div>
  );
};

export default RefurbishedSpotlight;
