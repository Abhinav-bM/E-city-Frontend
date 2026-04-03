import React from "react";
import MainWrapper from "@/wrapper/main";

const ProductLoading = () => {
  return (
    <MainWrapper>
      <div className="bg-white min-h-screen pb-20 pt-16 lg:pt-20 animate-pulse">
        {/* Skeleton Breadcrumbs */}
        <div className="border-b border-slate-100/60 sticky top-20 z-20 bg-slate-50/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-3.5 flex items-center gap-2.5">
            <div className="h-3 w-12 bg-slate-200 rounded" />
            <div className="h-3 w-4 bg-slate-100 rounded" />
            <div className="h-3 w-12 bg-slate-200 rounded" />
            <div className="h-3 w-4 bg-slate-100 rounded" />
            <div className="h-3 w-32 bg-slate-200 rounded" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 lg:px-8 mt-8 lg:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            {/* Gallery Skeleton */}
            <div className="lg:col-span-7">
              <div className="aspect-square bg-slate-100 rounded-2xl w-full" />
              <div className="flex gap-4 mt-6 overflow-hidden">
                <div className="w-20 h-20 bg-slate-50 rounded-lg shrink-0" />
                <div className="w-20 h-20 bg-slate-50 rounded-lg shrink-0" />
                <div className="w-20 h-20 bg-slate-50 rounded-lg shrink-0" />
                <div className="w-20 h-20 bg-slate-50 rounded-lg shrink-0" />
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="lg:col-span-5">
              <div className="flex flex-col gap-8">
                <div className="space-y-4">
                  <div className="h-10 w-3/4 bg-slate-100 rounded-lg" />
                  <div className="h-6 w-1/4 bg-slate-100 rounded-md" />
                </div>
                <div className="h-24 w-full bg-slate-50 rounded-xl" />
                <div className="h-48 w-full bg-slate-50 rounded-xl" />
                <div className="h-14 w-full bg-slate-900/10 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainWrapper>
  );
};

export default ProductLoading;
