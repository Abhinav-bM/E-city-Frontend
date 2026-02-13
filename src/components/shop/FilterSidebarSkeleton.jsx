import React from "react";

const FilterSidebarSkeleton = () => {
  return (
    <div className="w-full bg-card/50 backdrop-blur-sm border border-border/40 rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/30">
        <div className="h-6 w-20 bg-muted rounded shimmer"></div>
        <div className="h-4 w-12 bg-muted rounded shimmer"></div>
      </div>

      {/* Filter Section 1 */}
      <div className="border-b border-border/30 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-muted rounded shimmer"></div>
          <div className="h-4 w-4 bg-muted rounded shimmer"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded shimmer"></div>
          <div className="h-3 w-3/4 bg-muted rounded shimmer"></div>
          <div className="h-3 w-5/6 bg-muted rounded shimmer"></div>
        </div>
      </div>

      {/* Filter Section 2 - Price */}
      <div className="border-b border-border/30 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-muted rounded shimmer"></div>
          <div className="h-4 w-4 bg-muted rounded shimmer"></div>
        </div>
        <div className="space-y-4">
          <div className="h-2 w-full bg-muted rounded-full shimmer"></div>
          <div className="flex justify-between gap-2">
            <div className="h-3 w-16 bg-muted rounded shimmer"></div>
            <div className="h-3 w-16 bg-muted rounded shimmer"></div>
          </div>
          <div className="h-8 w-full bg-muted rounded-lg shimmer"></div>
        </div>
      </div>

      {/* Filter Section 3 - Colors */}
      <div className="border-b border-border/30 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 bg-muted rounded shimmer"></div>
          <div className="h-4 w-4 bg-muted rounded shimmer"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="h-8 w-16 bg-muted rounded-lg shimmer"></div>
          <div className="h-8 w-16 bg-muted rounded-lg shimmer"></div>
          <div className="h-8 w-20 bg-muted rounded-lg shimmer"></div>
          <div className="h-8 w-16 bg-muted rounded-lg shimmer"></div>
        </div>
      </div>

      {/* Filter Section 4 - Brands */}
      <div className="py-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 bg-muted rounded shimmer"></div>
          <div className="h-4 w-4 bg-muted rounded shimmer"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded shimmer"></div>
          <div className="h-3 w-4/5 bg-muted rounded shimmer"></div>
          <div className="h-3 w-3/4 bg-muted rounded shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebarSkeleton;
