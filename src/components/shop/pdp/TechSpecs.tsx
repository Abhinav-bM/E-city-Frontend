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
      <div className="flex flex-col gap-2 mb-12">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">
          Details
        </span>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
          Technical Specifications
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-12">
        {baseProduct.specifications.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-6">
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest pb-3 border-b border-slate-100">
              {group.group}
            </h4>
            <div className="flex flex-col gap-4">
              {group.items.map((item, itemIdx) => (
                <div key={itemIdx} className="grid grid-cols-2 gap-4 text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">
                    {item.key}
                  </span>
                  <span className="text-slate-900 font-bold tracking-wide">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechSpecs;
