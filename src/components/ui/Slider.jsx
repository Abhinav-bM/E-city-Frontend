import React, { useState, useEffect, useRef } from "react";

const Slider = ({ min = 0, max = 100, value, onChange }) => {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const minValRef = useRef(value[0]);
  const maxValRef = useRef(value[1]);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = (value) => Math.round(((value - min) / (max - min)) * 100);

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
    <div className="relative w-full h-6 flex items-center group">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
          onChange([value, maxVal]);
        }}
        className="thumb thumb--left pointer-events-none absolute h-0 w-full outline-none z-[3]"
        style={{ zIndex: minVal > max - 100 && "5" }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;
          onChange([minVal, value]);
        }}
        className="thumb thumb--right pointer-events-none absolute h-0 w-full outline-none z-[4]"
      />

      <div className="relative w-full">
        <div className="absolute w-full h-1.5 bg-slate-200 rounded-full z-[1]"></div>
        <div
          ref={range}
          className="absolute h-1.5 bg-primary rounded-full z-[2]"
        ></div>
      </div>

      <style jsx>{`
        /* Webkit Thumbs */
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          -webkit-tap-highlight-color: transparent;
          pointer-events: auto;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background-color: #fff;
          border: 2px solid #2563eb; /* primary color */
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          margin-top: -8px; /* Correct vertical alignment */
          position: relative;
          z-index: 10;
        }

        /* Firefox Thumbs */
        .thumb::-moz-range-thumb {
          -webkit-appearance: none;
          pointer-events: auto;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background-color: #fff;
          border: 2px solid #2563eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default Slider;
