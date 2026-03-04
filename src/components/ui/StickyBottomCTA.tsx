import { ReactNode } from "react";

export interface StickyBottomCTAProps {
  children: ReactNode;
}

export function StickyBottomCTA({ children }: StickyBottomCTAProps) {
  return (
    <>
      {/* Spacer to prevent content from hiding behind the sticky CTA */}
      <div className="h-[88px] w-full" aria-hidden="true" />

      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 pb-safe backdrop-blur-md shadow-[0px_-4px_12px_rgba(15,23,42,0.05)] border-t border-slate-100">
        <div className="mx-auto flex w-full max-w-screen-md items-center px-4 py-4">
          {children}
        </div>
      </div>
    </>
  );
}
