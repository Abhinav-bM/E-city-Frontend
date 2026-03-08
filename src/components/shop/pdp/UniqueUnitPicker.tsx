"use client";

import React from "react";
import { Variant } from "./types";
import { Check, Battery, ShieldCheck, AlertCircle } from "lucide-react";

interface UniqueUnitPickerProps {
  currentVariant: Variant;
  availableVariants: Variant[];
  onSelectVariant: (variant: Variant) => void;
}

const UniqueUnitPicker: React.FC<UniqueUnitPickerProps> = ({
  currentVariant,
  availableVariants,
  onSelectVariant,
}) => {
  // Filter for other related units with SAME attributes (Color, Storage)
  const relatedUnits = availableVariants?.filter((v) => {
    // Only show the picker for Unique inventory items
    if (v.inventoryType !== "Unique") return false;

    // Must match all attributes of the current selection
    const isSameSpec =
      v.attributes?.Color === currentVariant.attributes?.Color &&
      v.attributes?.Storage === currentVariant.attributes?.Storage;

    return isSameSpec;
  });

  if (relatedUnits.length === 0) return null;
  if (currentVariant.inventoryType !== "Unique") return null;

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
          Select Specific Unit
        </span>
        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
          {relatedUnits.length} Available
        </span>
      </div>

      <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar -mr-2">
        {relatedUnits.map((unit) => {
          const isSelected = unit.variantId === currentVariant.variantId;
          const unitId = unit.variantId.slice(-6).toUpperCase();

          return (
            <div
              key={unit.variantId}
              onClick={() => onSelectVariant(unit)}
              className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-300 p-5 group ${
                isSelected
                  ? "border-slate-900 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] scale-[1.01]"
                  : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm hover:bg-slate-50/50"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1.5 flex items-center gap-2">
                    <span>Unit #{unitId}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    )}
                  </div>
                  <div className="text-xl text-slate-900 font-bold tracking-tight">
                    ₹{unit.price.toLocaleString()}
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-300 group-hover:bg-slate-200"
                  }`}
                >
                  <Check size={14} strokeWidth={isSelected ? 3 : 2} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50/80 rounded-xl p-3 border border-slate-100/50">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                    Cosmetic Grade
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <ShieldCheck size={14} className="text-slate-400" />
                    {unit.conditionGrade || "Standard"}
                  </div>
                </div>

                {unit.attributes?.["Battery Health"] && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                      Battery Health
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                      <Battery size={14} className="text-emerald-500" />
                      {unit.attributes["Battery Health"]}
                    </div>
                  </div>
                )}
              </div>

              {unit.conditionDescription && (
                <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-2 italic">
                  <AlertCircle
                    size={14}
                    className="mt-0.5 text-slate-400 shrink-0"
                  />
                  {unit.conditionDescription}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default UniqueUnitPicker;
