"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ImageObject {
  url: string;
  [key: string]: any;
}

interface ProductImageViewerProps {
  images?: (string | ImageObject)[];
}

const ProductImageViewer: React.FC<ProductImageViewerProps> = ({
  images = [],
}) => {
  const [selectedImage, setSelectedImage] = useState<string | ImageObject>(
    images[0] || "",
  );

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
        <svg
          className="w-20 h-20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  // Update selected image if images prop changes and selected is not in new list
  useEffect(() => {
    if (images.length > 0 && !images.includes(selectedImage)) {
      setSelectedImage(images[0]);
    }
  }, [images, selectedImage]);

  const getUrl = (img: string | ImageObject): string => {
    return typeof img === "string" ? img : img.url;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-slate-100">
        <Image
          src={getUrl(selectedImage)}
          alt="Product Image"
          fill
          className="object-contain p-8 mix-blend-multiply"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {images.map((img, i) => {
            const url = getUrl(img);
            const isSelected =
              selectedImage === img || getUrl(selectedImage) === url;

            return (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-20 flex-shrink-0 bg-white rounded-xl border-2 overflow-hidden transition-all ${
                  isSelected
                    ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2"
                    : "border-transparent hover:border-slate-300"
                }`}
              >
                <Image
                  src={url}
                  alt={`Thumbnail ${i}`}
                  fill
                  className="object-contain p-2 mix-blend-multiply"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductImageViewer;
