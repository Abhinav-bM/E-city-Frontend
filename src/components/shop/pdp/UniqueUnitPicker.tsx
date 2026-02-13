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

      <div className="flex flex-col gap-3">
        {relatedUnits.map((unit) => {
          const isSelected = unit.variantId === currentVariant.variantId;
          const unitId = unit.variantId.slice(-6).toUpperCase();

          return (
            <div
              key={unit.variantId}
              onClick={() => onSelectVariant(unit)}
              className={`relative cursor-pointer rounded-lg border-2 transition-all p-5 ${
                isSelected
                  ? "border-slate-900 bg-white shadow-xl shadow-slate-100"
                  : "border-slate-100 bg-white hover:border-slate-200"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">
                    Unit #{unitId}
                  </div>
                  <div className="text-xl text-slate-900 font-bold tracking-tight">
                    ₹{unit.price.toLocaleString()}
                  </div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center">
                    <Check size={12} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                    Cosmetic Grade
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <ShieldCheck size={12} className="text-slate-400" />
                    {unit.conditionGrade || "Standard"}
                  </div>
                </div>

                {unit.attributes?.["Battery Health"] && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                      Battery Health
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                      <Battery size={12} className="text-emerald-500" />
                      {unit.attributes["Battery Health"]}
                    </div>
                  </div>
                )}
              </div>

              {unit.conditionDescription && (
                <div className="mt-4 pt-4 border-t border-slate-50 text-[11px] text-slate-500 flex items-start gap-2 italic">
                  <AlertCircle
                    size={12}
                    className="mt-0.5 opacity-40 shrink-0"
                  />
                  {unit.conditionDescription}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UniqueUnitPicker;
