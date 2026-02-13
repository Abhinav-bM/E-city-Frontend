"use client";

import React from "react";
import { SpecificationGroup } from "./types";
import {
  Cpu,
  Smartphone,
  Battery,
  Monitor,
  HardDrive,
  ShieldCheck,
} from "lucide-react";

interface ProductHighlightsProps {
  specifications: SpecificationGroup[];
}

const ProductHighlights: React.FC<ProductHighlightsProps> = ({
  specifications,
}) => {
  if (
    !specifications ||
    !Array.isArray(specifications) ||
    specifications.length === 0
  ) {
    return null;
  }

  // Extract key specs based on group or item keys
  const highlights = [];

  const findSpec = (keys: string[]) => {
    for (const group of specifications) {
      for (const item of group.items) {
        if (
          keys.some((k) => item.key.toLowerCase().includes(k.toLowerCase()))
        ) {
          return item.value;
        }
      }
    }
    return null;
  };

  const display = findSpec(["display", "screen", "resolution"]);
  const processor = findSpec(["processor", "chipset", "cpu"]);
  const battery = findSpec(["battery", "capacity"]);
  const storage = findSpec(["storage", "rom", "ssd"]);

  if (display)
    highlights.push({
      icon: <Monitor size={14} />,
      label: "Display",
      value: display,
    });
  if (processor)
    highlights.push({
      icon: <Cpu size={14} />,
      label: "Processor",
      value: processor,
    });
  if (battery)
    highlights.push({
      icon: <Battery size={14} />,
      label: "Battery",
      value: battery,
    });
  if (storage)
    highlights.push({
      icon: <HardDrive size={14} />,
      label: "Storage",
      value: storage,
    });

  if (highlights.length === 0) return null;

  if (highlights.length === 0) return null;

  return (
    <div className="py-6">
      <div className="grid grid-cols-2 gap-3">
        {highlights.slice(0, 4).map((h, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100/60"
          >
            <div className="text-slate-900 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-slate-100">
              {h.icon}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {h.label}
              </span>
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {h.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductHighlights;
