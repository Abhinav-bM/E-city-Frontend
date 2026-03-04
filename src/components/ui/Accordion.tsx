"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  id: string;
  title: string | React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  className = "",
}) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        return (
          <div
            key={item.id}
            className="border-b border-slate-200 last:border-0"
          >
            <button
              className="flex w-full items-center justify-between py-4 text-left font-medium outline-none transition-colors"
              onClick={() => toggleItem(item.id)}
            >
              <span className="text-sm font-semibold">{item.title}</span>
              <ChevronDown
                size={18}
                className={`text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pb-4 text-sm text-slate-600">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
