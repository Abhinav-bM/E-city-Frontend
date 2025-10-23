"use client";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";

const ProductVariantSelector = ({ product }) => {
  console.log("PRODUCT : ", product);
  const { price, variantAttributes, variants } = product;
  const [selectedVariant, setSelectedVariant] = useState();
  useEffect(() => {
    setSelectedVariant(product.variantAttributes);
  }, [product]);

  // store all the attributes and their values

  return (
    // <div className={clsx("my-4")}>
    //   <span className="font-semibold text-2xl">₹ {price}</span>
    //   {/* Attribute Selection */}
    //   <div className="mt-5">
    //     {variantAttributes.map((attr, id) => {
    //       const availableValues = getAvailableValues(attr.name);

    //       return (
    //         <div key={id} className="mb-4">
    //           <h4 className="font-semibold">{attr.name}</h4>
    //           <div className="flex gap-2 mt-1">
    //             {attr.values.map((value, id) => {
    //               // Option is available if it exists in any variant for this attribute
    //               const isAvailable = availableValues.includes(value);

    //               return (
    //                 <button
    //                   key={id}
    //                   onClick={() =>
    //                     isAvailable && _handleSelection(attr.name, value)
    //                   }
    //                   disabled={!isAvailable}
    //                   className={clsx(
    //                     "px-4 py-1 rounded-sm border transition relative",
    //                     selectedAttributes[attr.name] === value
    //                       ? "border-primary bg-primary text-textSecondary"
    //                       : "border-primary",
    //                     !isAvailable
    //                       ? "opacity-50 cursor-not-allowed"
    //                       : "hover:bg-primary hover:text-textSecondary"
    //                   )}
    //                 >
    //                   {value}
    //                 </button>
    //               );
    //             })}
    //           </div>
    //         </div>
    //       );
    //     })}
    //   </div>
    // </div>
    <>Onnulla patticheee, haha ahahahahahhahh</>
  );
};

export default ProductVariantSelector;
