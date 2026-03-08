import React from "react";

const FilterSidebarSkeleton = () => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm p-5 space-y-4 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="h-5 w-16 bg-slate-100 rounded animate-pulse" />
        <div className="h-4 w-14 bg-slate-100 rounded animate-pulse" />
      </div>

      {/* Section 1 — Categories */}
      <div className="border-b border-slate-100 pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-4 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="space-y-2.5 pl-1">
          <div className="h-3.5 w-full bg-slate-100 rounded animate-pulse" />
          <div className="h-3.5 w-3/4 bg-slate-100 rounded animate-pulse" />
          <div className="h-3.5 w-5/6 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>

      {/* Section 2 — Condition */}
      <div className="border-b border-slate-100 pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-4 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="space-y-2.5 pl-1">
          <div className="h-3.5 w-20 bg-slate-100 rounded animate-pulse" />
          <div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse" />
          <div className="h-3.5 w-16 bg-slate-100 rounded animate-pulse" />
          <div className="h-3.5 w-20 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>

      {/* Section 3 — Price */}
      <div className="border-b border-slate-100 pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-4 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full animate-pulse mt-2" />
        <div className="flex justify-between gap-2">
          <div className="h-12 w-[45%] bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-12 w-[45%] bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-full bg-slate-100 rounded-lg animate-pulse" />
      </div>

      {/* Section 4 — Brands */}
      <div className="pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-4 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="space-y-2.5 pl-1">
          <div className="h-3.5 w-full bg-slate-100 rounded animate-pulse" />
          <div className="h-3.5 w-4/5 bg-slate-100 rounded animate-pulse" />
          <div className="h-3.5 w-3/4 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default FilterSidebarSkeleton;
