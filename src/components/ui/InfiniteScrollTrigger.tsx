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
    <div ref={triggerRef} className="w-full py-10 flex justify-center">
      {isLoading && (
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-slate-300"
            style={{ animation: "pulse-dot 1.4s ease-in-out infinite" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-slate-300"
            style={{ animation: "pulse-dot 1.4s ease-in-out 0.2s infinite" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-slate-300"
            style={{ animation: "pulse-dot 1.4s ease-in-out 0.4s infinite" }}
          />

          {/* Inline keyframes */}
          <style jsx>{`
            @keyframes pulse-dot {
              0%,
              80%,
              100% {
                opacity: 0.3;
                transform: scale(0.8);
              }
              40% {
                opacity: 1;
                transform: scale(1.2);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default InfiniteScrollTrigger;
