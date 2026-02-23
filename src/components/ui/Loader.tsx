import React from "react";
import { clsx, type ClassValue } from "clsx";

/**
 * Utility to merge tailwind classes safely
 * Required for tailwind dynamic class usage.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export interface LoaderProps {
  /**
   * Size variants for the loader
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  /**
   * Additional custom classes to apply to the main container wrapper
   */
  className?: string;
  /**
   * Whether to display the loader as a fixed, full screen background overlay
   * @default false
   */
  fullScreen?: boolean;
  /**
   * Optional loading text to display below the animation
   */
  text?: string;
  /**
   * Color theme variant of the loader
   * @default "primary"
   */
  theme?: "primary" | "secondary" | "monochrome" | "gadget";
}

export const Loader = ({
  size = "md",
  className,
  fullScreen = false,
  text,
  theme = "primary",
}: LoaderProps) => {
  // Dimensions and border scaling based on size
  const sizeConfig = {
    sm: "w-8 h-8 border-[2px]",
    md: "w-14 h-14 border-[3px]",
    lg: "w-20 h-20 border-[3px]",
    xl: "w-28 h-28 border-[4px]",
    "2xl": "w-40 h-40 border-[5px]",
  };

  const getThemeClasses = () => {
    switch (theme) {
      case "secondary":
        return {
          ring1: "border-t-rose-500 border-b-rose-500",
          ring2: "border-r-amber-500 border-l-amber-500",
          ring3: "border-t-orange-500 border-r-orange-500",
          center:
            "from-rose-500 to-amber-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]",
          text: "from-rose-500 to-amber-500",
        };
      case "monochrome":
        return {
          ring1: "border-t-neutral-800 border-b-neutral-800",
          ring2: "border-r-neutral-600 border-l-neutral-600",
          ring3: "border-t-neutral-500 border-r-neutral-500",
          center:
            "from-neutral-800 to-neutral-600 shadow-[0_0_15px_rgba(115,115,115,0.4)]",
          text: "from-neutral-800 to-neutral-600",
        };
      case "gadget":
        // Cyberpunk / Gadget store vibe
        return {
          ring1:
            "border-t-emerald-400 border-b-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]",
          ring2:
            "border-r-cyan-400 border-l-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]",
          ring3: "border-t-fuchsia-400 border-r-fuchsia-400",
          center:
            "from-emerald-400 to-cyan-400 shadow-[0_0_20px_rgba(52,211,153,0.8)]",
          text: "from-emerald-400 to-cyan-400",
        };
      case "primary":
      default:
        return {
          ring1: "border-t-blue-600 border-b-blue-600",
          ring2: "border-r-purple-600 border-l-purple-600",
          ring3: "border-t-indigo-500 border-r-indigo-500",
          center:
            "from-blue-600 to-purple-600 shadow-[0_0_15px_rgba(59,130,246,0.6)]",
          text: "from-blue-600 to-purple-600",
        };
    }
  };

  const currentTheme = getThemeClasses();

  // Extract specific parts of the config
  const dimensionClass = `${sizeConfig[size].split(" ")[0]} ${sizeConfig[size].split(" ")[1]}`;
  const borderWidthClass = sizeConfig[size].split(" ")[2];

  const loaderContent = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-center",
          dimensionClass,
        )}
      >
        {/* Layer 1: Outer fast glowing ring structure */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-r-transparent border-l-transparent animate-spin opacity-80",
            borderWidthClass,
            currentTheme.ring1,
          )}
          style={{ animationDuration: "1.8s" }}
        />

        {/* Layer 2: Inner medium counter-rotating ring */}
        <div
          className={cn(
            "absolute inset-2 rounded-full border-t-transparent border-b-transparent animate-spin opacity-90",
            borderWidthClass,
            currentTheme.ring2,
          )}
          style={{ animationDirection: "reverse", animationDuration: "1.2s" }}
        />

        {/* Layer 3: Dashed inner structure for mechanical/tech feel */}
        <div
          className={cn(
            "absolute inset-4 rounded-full border-b-transparent border-l-transparent animate-spin opacity-100",
            borderWidthClass,
            currentTheme.ring3,
          )}
          style={{ animationDuration: "0.8s" }}
        />

        {/* Layer 4: Core pulsing gradient source */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              "w-1/3 h-1/3 bg-gradient-to-tr rounded-full animate-pulse",
              currentTheme.center,
            )}
            style={{ animationDuration: "1.5s" }}
          />
        </div>

        {/* Layer 5: Ambient glow drop shadow (behind everything) */}
        <div
          className={cn(
            "absolute inset-1 rounded-full bg-gradient-to-tr blur-2xl opacity-20 -z-10 animate-pulse",
            currentTheme.center,
          )}
        />
      </div>

      {/* Optional Loading Text */}
      {text && (
        <span
          className={cn(
            "text-sm sm:text-base font-bold tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r animate-pulse",
            currentTheme.text,
          )}
        >
          {text}
        </span>
      )}
    </div>
  );

  // Wraps in overlay if fullScreen is requested
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-sm">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;
