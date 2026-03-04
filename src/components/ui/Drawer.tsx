"use client";

import React, { useEffect, useState } from "react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  side?: "left" | "right";
  className?: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  side = "left",
  className = "",
  children,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const translateClass =
    side === "left"
      ? isOpen
        ? "translate-x-0"
        : "-translate-x-full"
      : isOpen
        ? "translate-x-0"
        : "translate-x-full";

  const sideClass = side === "left" ? "left-0" : "right-0";

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 bottom-0 z-50 w-4/5 max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out ${sideClass} ${translateClass} ${className}`}
      >
        {children}
      </div>
    </>
  );
};
