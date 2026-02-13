"use client";

import React from "react";

const PDPSkeleton = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs Skeleton */}
      <div className="border-b border-slate-50">
        <div className="container mx-auto px-4 lg:px-8 py-3 h-10 flex items-center gap-2">
          <div className="w-12 h-3 bg-slate-100 animate-pulse rounded"></div>
          <div className="w-4 h-4 rounded-full bg-slate-50 animate-pulse"></div>
          <div className="w-12 h-3 bg-slate-100 animate-pulse rounded"></div>
          <div className="w-4 h-4 rounded-full bg-slate-50 animate-pulse"></div>
          <div className="w-32 h-3 bg-slate-100 animate-pulse rounded"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 mt-12 pb-20 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Gallery Skeleton */}
          <div className="lg:col-span-6">
            <div className="aspect-square w-full bg-slate-50 rounded-2xl animate-pulse"></div>
            <div className="flex gap-4 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-20 aspect-square bg-slate-50 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="lg:col-span-6 flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="w-24 h-4 bg-slate-100 animate-pulse rounded"></div>
                <div className="w-3/4 h-12 bg-slate-50 animate-pulse rounded"></div>
                <div className="w-1/2 h-4 bg-slate-50 animate-pulse rounded"></div>
              </div>
              <div className="w-32 h-10 bg-slate-50 animate-pulse rounded"></div>
              <div className="w-20 h-4 bg-slate-50 animate-pulse rounded"></div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="w-full h-32 bg-slate-50 animate-pulse rounded-lg"></div>
              <div className="flex gap-4">
                <div className="flex-1 h-16 bg-slate-100 animate-pulse rounded-lg"></div>
                <div className="flex-1 h-16 bg-slate-100 animate-pulse rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDPSkeleton;
