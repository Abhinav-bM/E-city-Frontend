"use client";
import React from "react";
import { ShieldCheck, Truck, Clock, Headphones } from "lucide-react";

const TrustSignals = () => {
  const features = [
    {
      icon: <ShieldCheck size={40} className="text-primary" />,
      title: "1-Year Warranty",
      description: "Comprehensive coverage on all devices.",
    },
    {
      icon: <Truck size={40} className="text-primary" />,
      title: "Free Shipping",
      description: "Fast delivery on orders over ₹500.",
    },
    {
      icon: <Clock size={40} className="text-primary" />,
      title: "30-Day Returns",
      description: "Hassle-free returns if you change your mind.",
    },
    {
      icon: <Headphones size={40} className="text-primary" />,
      title: "24/7 Support",
      description: "Expert assistance whenever you need it.",
    },
  ];

  return (
    <div className="bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-4 p-3 bg-blue-50 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;
