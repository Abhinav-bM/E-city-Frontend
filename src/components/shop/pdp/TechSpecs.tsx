"use client";

import React from "react";
import { BaseProduct } from "./types";

interface TechSpecsProps {
  baseProduct: BaseProduct;
}

const TechSpecs: React.FC<TechSpecsProps> = ({ baseProduct }) => {
  if (!baseProduct?.specifications || baseProduct.specifications.length === 0) {
    return null;
  }

  return (
    <div className="mt-20">
      <div className="flex flex-col gap-2 mb-10">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">
          Details
        </span>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
          Technical Specifications
        </h3>
      </div>

      <div className="bg-slate-50/50 rounded-[2.5rem] p-8 lg:p-14 border border-slate-100/60 shadow-[inset_0_2px_20px_rgb(0,0,0,0.01)] transition-all">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 lg:gap-x-24 gap-y-12">
          {baseProduct.specifications.map((group, idx) => (
            <div key={idx} className="flex flex-col gap-6">
              <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em] pb-3 border-b border-slate-200/60">
                {group.group}
              </h4>
              <div className="flex flex-col gap-5">
                {group.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="grid grid-cols-2 gap-4 text-xs font-medium"
                  >
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                      {item.key}
                    </span>
                    <span className="text-slate-900 tracking-wide text-[13px] leading-relaxed">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechSpecs;
