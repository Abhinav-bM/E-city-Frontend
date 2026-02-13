"use client";

import React, { useEffect, useRef } from "react";

interface InfiniteScrollTriggerProps {
  onIntersect: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

const InfiniteScrollTrigger: React.FC<InfiniteScrollTriggerProps> = ({
  onIntersect,
  isLoading,
  hasMore,
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoading) {
          onIntersect();
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    const currentTrigger = triggerRef.current;
    if (currentTrigger) {
      observer.observe(currentTrigger);
    }

    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
    };
  }, [onIntersect, hasMore, isLoading]);

  if (!hasMore) return null;

  return (
    <div
      ref={triggerRef}
      className="w-full py-12 flex justify-center"
      style={{ animation: "slideUp 0.4s ease-out" }}
    >
      {isLoading && (
        <div className="flex flex-col items-center gap-3">
          {/* Modern Spinner */}
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-border/30" />
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary"
              style={{ animation: "spin-slow 1s linear infinite" }}
            />
          </div>
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Loading more products...
          </span>
        </div>
      )}
    </div>
  );
};

export default InfiniteScrollTrigger;
