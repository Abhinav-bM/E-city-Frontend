import React from "react";
import ProductCarousel from "@/components/product/ProductCarousel";

// Temporary mock data until Redux is wired
const mockNewArrivals = [
  {
    id: "na1",
    title: "iPhone 15 Pro Max 256GB Natural Titanium",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop",
    price: 159900,
    originalPrice: 159900,
    condition: "new" as const,
    isNewArrival: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "na2",
    title: "MacBook Air M3 2024 (8GB RAM, 256GB SSD)",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop",
    price: 114900,
    originalPrice: 134900, // Show a discount
    condition: "new" as const,
    isNewArrival: true,
    rating: 4.9,
    reviews: 86,
  },
  {
    id: "na3",
    title: "AirPods Pro (2nd Generation) with USB-C",
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&auto=format&fit=crop",
    price: 24900,
    condition: "new" as const,
    isNewArrival: true,
    rating: 4.7,
    reviews: 312,
  },
  {
    id: "na4",
    title: "Samsung Galaxy S24 Ultra 5G AI Smartphone",
    image:
      "https://images.unsplash.com/photo-1706691456942-0c9f1d07c42a?q=80&w=600&auto=format&fit=crop",
    price: 129999,
    originalPrice: 134999,
    condition: "new" as const,
    isNewArrival: true,
    rating: 4.6,
    reviews: 58,
  },
  {
    id: "na5",
    title: "OnePlus 12 (Flowy Emerald, 16GB RAM, 512GB)",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop",
    price: 69999,
    condition: "new" as const,
    isNewArrival: true,
    rating: 4.5,
    reviews: 19,
  },
];

const NewArrivals: React.FC = () => {
  return (
    <ProductCarousel
      title="Fresh Drops"
      subtitle="The latest and greatest tech, just landed."
      products={mockNewArrivals as any}
      className="bg-surface-card mb-2"
      actionLabel="View All New"
      actionHref="/shop?category=smartphones&sort=newest"
    />
  );
};

export default NewArrivals;
