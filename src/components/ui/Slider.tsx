import React, { useState, useEffect, useRef, useCallback } from "react";

interface SliderProps {
  min?: number;
  max?: number;
  value: number[];
  onChange: (value: number[]) => void;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  value,
  onChange,
  className = "",
}) => {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const minValRef = useRef(value[0]);
  const maxValRef = useRef(value[1]);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max],
  );

  // Sync state with props
  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
    minValRef.current = value[0];
    maxValRef.current = value[1];
  }, [value]);

  // Update range width/pos
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  return (
    <div className={`relative w-full h-6 flex items-center group ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const val = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(val);
          minValRef.current = val;
          onChange([val, maxVal]);
        }}
        className="thumb thumb--left pointer-events-none absolute h-0 w-full outline-none z-[3]"
        style={{ zIndex: minVal > max - 100 ? "5" : undefined }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const val = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(val);
          maxValRef.current = val;
          onChange([minVal, val]);
        }}
        className="thumb thumb--right pointer-events-none absolute h-0 w-full outline-none z-[4]"
      />

      <div className="relative w-full">
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 bg-slate-200 rounded-full z-[1]"></div>
        <div
          ref={range}
          className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-gray-900 rounded-full z-[2]"
        ></div>
      </div>

      <style>{`
        /* Make the input itself invisible but keep it in the flow to handle clicks */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }

        /* Webkit Thumbs */
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          -webkit-tap-highlight-color: transparent;
          pointer-events: all;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background-color: #fff;
          border: 3px solid #111827; /* gray-900 */
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
          cursor: grab;
          position: relative;
          z-index: 10;
        }

        .thumb:active::-webkit-slider-thumb {
          cursor: grabbing;
          transform: scale(1.1);
        }

        /* Firefox Thumbs */
        .thumb::-moz-range-thumb {
          pointer-events: all;
          height: 14px; /* Account for border in firefox */
          width: 14px;
          border-radius: 50%;
          background-color: #fff;
          border: 3px solid #111827;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
          cursor: grab;
        }

        .thumb:active::-moz-range-thumb {
          cursor: grabbing;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default Slider;
